// packages/catalog/src/recommendation-engine.ts
// Deterministic recommendation engine for persisted run/result generation.
// Keeps published-school reads, scoring, and persistence on one canonical server path.

import type * as dbSchema from "@etest/db";
import {
  recommendationResults,
  recommendationRuns,
  type BudgetFitLabel,
  type ConfidenceLevel,
  type DeadlinePressureLabel,
  type OutlookLabel,
  type RecommendationResultRecord,
  type RecommendationRunRecord,
  type RecommendationTier,
  type RecommendationRunStatus,
  type ScoreComponentBreakdown,
  type StudentProfileMissingField,
  type StudentProfileRecord,
} from "@etest/db";
import { eq } from "drizzle-orm";
import type { PgQueryResultHKT } from "drizzle-orm/pg-core";
import type { PgDatabase } from "drizzle-orm/pg-core";

import type { RecommendationCandidateSchool } from "./types.js";
import { listRecommendationCandidateSchools } from "./recommendation-catalog-read-path.js";

export type RecommendationEngineDb = PgDatabase<
  PgQueryResultHKT,
  typeof dbSchema
>;

export interface RecommendationEngineProfileState {
  profile: {
    id: string;
    userId: string;
  } | null;
  snapshots: {
    current: {
      id: string | null;
      assumptions: string[];
      profile: StudentProfileRecord | null;
    };
    projected: {
      id: string | null;
      assumptions: string[];
      profile: StudentProfileRecord | null;
    };
  };
  missingFields: StudentProfileMissingField[];
}

export interface RecommendationEngineResult {
  run: RecommendationRunRecord;
  results: RecommendationResultRecord[];
}

export class RecommendationEngineInputError extends Error {
  readonly missingFields: StudentProfileMissingField[];

  constructor(message: string, missingFields: StudentProfileMissingField[]) {
    super(message);
    this.name = "RecommendationEngineInputError";
    this.missingFields = missingFields;
  }
}

export async function runRecommendationEngineForUser(input: {
  db: RecommendationEngineDb;
  userId: string;
  profileState: RecommendationEngineProfileState;
}): Promise<RecommendationEngineResult> {
  const { db, userId, profileState } = input;
  const currentSnapshot = profileState.snapshots.current;
  const projectedSnapshot = profileState.snapshots.projected;

  if (!profileState.profile || !currentSnapshot.id || !currentSnapshot.profile) {
    throw new RecommendationEngineInputError(
      "A saved current profile snapshot is required before a recommendation run can start.",
      profileState.missingFields,
    );
  }

  const missingProfileFields = profileState.missingFields.map(
    (field) => `${field.snapshotKind}.${field.path}`,
  );
  const currentProfile = currentSnapshot.profile;

  const [pendingRun] = await db
    .insert(recommendationRuns)
    .values({
      userId,
      studentProfileId: profileState.profile.id,
      currentSnapshotId: currentSnapshot.id,
      projectedSnapshotId: projectedSnapshot.id,
      runStatus: "pending",
      missingProfileFields,
      candidateSchoolCount: 0,
    })
    .returning();

  if (profileState.missingFields.length > 0) {
    const [failedRun] = await db
      .update(recommendationRuns)
      .set({
        runStatus: "failed",
        candidateSchoolCount: 0,
        finishedAt: new Date(),
      })
      .where(eq(recommendationRuns.id, pendingRun.id))
      .returning();

    return {
      run: toRecommendationRunRecord(failedRun),
      results: [],
    };
  }

  const candidateSchools = await listRecommendationCandidateSchools(db);
  const projectedEnabled =
    Boolean(projectedSnapshot.id) &&
    Boolean(projectedSnapshot.profile) &&
    projectedSnapshot.profile?.academic.projectedGpa100 !== null &&
    projectedSnapshot.assumptions.length > 0;

  const scoredSchools = candidateSchools
    .map((school) =>
      scoreCandidateSchool({
        school,
        currentProfile,
        projectedProfile: projectedEnabled ? projectedSnapshot.profile : null,
        currentAssumptions: currentSnapshot.assumptions,
        projectedAssumptions: projectedSnapshot.assumptions,
      }),
    )
    .sort((left, right) => {
      if (right.currentScore !== left.currentScore) {
        return right.currentScore - left.currentScore;
      }

      if ((right.projectedScore ?? -1) !== (left.projectedScore ?? -1)) {
        return (right.projectedScore ?? -1) - (left.projectedScore ?? -1);
      }

      return left.school.schoolName.localeCompare(right.school.schoolName);
    });

  const insertedResults = scoredSchools.length
    ? await db
        .insert(recommendationResults)
        .values(
          scoredSchools.map((result, index) => ({
            recommendationRunId: pendingRun.id,
            universityId: result.school.universityId,
            tier: result.tier,
            currentOutlook: result.currentOutlook,
            projectedOutlook: result.projectedOutlook,
            confidenceLevel: result.confidenceLevel,
            budgetFit: result.budgetFit,
            deadlinePressure: result.deadlinePressure,
            currentScore: result.currentScore,
            projectedScore: result.projectedScore,
            currentScoreBreakdown: result.currentScoreBreakdown,
            projectedScoreBreakdown: result.projectedScoreBreakdown,
            projectedAssumptionDelta: result.projectedAssumptionDelta,
            rankOrder: index + 1,
          })),
        )
        .returning()
    : [];

  const [succeededRun] = await db
    .update(recommendationRuns)
    .set({
      runStatus: "succeeded",
      candidateSchoolCount: candidateSchools.length,
      finishedAt: new Date(),
    })
    .where(eq(recommendationRuns.id, pendingRun.id))
    .returning();

  return {
    run: toRecommendationRunRecord(succeededRun),
    results: insertedResults
      .sort((left, right) => left.rankOrder - right.rankOrder)
      .map(toRecommendationResultRecord),
  };
}

function scoreCandidateSchool(input: {
  school: RecommendationCandidateSchool;
  currentProfile: StudentProfileRecord;
  projectedProfile: StudentProfileRecord | null;
  currentAssumptions: string[];
  projectedAssumptions: string[];
}) {
  const currentScoreBreakdown = scoreBreakdown({
    school: input.school,
    profile: input.currentProfile,
    improvementUpside: scoreImprovementUpside({
      currentProfile: input.currentProfile,
      projectedProfile: input.projectedProfile,
      projectedAssumptions: input.projectedAssumptions,
    }),
  });

  const currentScore = totalBreakdown(currentScoreBreakdown);
  const projectedScoreBreakdown = input.projectedProfile
    ? scoreBreakdown({
        school: input.school,
        profile: input.projectedProfile,
        improvementUpside: 0,
      })
    : null;
  const projectedScore = projectedScoreBreakdown
    ? totalBreakdown(projectedScoreBreakdown)
    : null;

  return {
    school: input.school,
    tier: scoreToTier(currentScore),
    currentOutlook: scoreToOutlook(currentScore),
    projectedOutlook: projectedScore === null ? null : scoreToOutlook(projectedScore),
    confidenceLevel: scoreConfidenceLevel(input.school),
    budgetFit: scoreBudgetLabel(input.school, input.currentProfile),
    deadlinePressure: scoreDeadlinePressure(input.currentProfile),
    currentScore,
    projectedScore,
    currentScoreBreakdown,
    projectedScoreBreakdown,
    projectedAssumptionDelta: differenceAssumptions(
      input.currentAssumptions,
      input.projectedAssumptions,
    ),
  };
}

function scoreBreakdown(input: {
  school: RecommendationCandidateSchool;
  profile: StudentProfileRecord;
  improvementUpside: number;
}): ScoreComponentBreakdown {
  return {
    admissionFit: scoreAdmissionFit(input.school, input.profile),
    readinessFit: scoreReadinessFit(input.profile),
    budgetFit: scoreBudgetComponent(input.school, input.profile),
    preferenceFit: scorePreferenceFit(input.school, input.profile),
    improvementUpside: clampScore(input.improvementUpside),
  };
}

function scoreAdmissionFit(
  school: RecommendationCandidateSchool,
  profile: StudentProfileRecord,
) {
  const studentIndex = scoreStudentIndex(profile);
  const schoolIndex = scoreSchoolIndex(school);
  let score = 12;
  const gap = studentIndex - schoolIndex;

  if (gap >= 18) score = 20;
  else if (gap >= 8) score = 17;
  else if (gap >= -4) score = 14;
  else if (gap >= -14) score = 10;
  else if (gap >= -24) score = 6;
  else score = 2;

  const testingRequired =
    school.recommendationInputs.testingRequirements.minimumSatTotal !== null ||
    school.recommendationInputs.testingRequirements.minimumActComposite !== null;

  if (testingRequired && profile.testing.willSubmitTests === false) {
    score -= 6;
  }

  return clampScore(score);
}

function scoreReadinessFit(profile: StudentProfileRecord) {
  const readinessValues = [
    profile.readiness.hasTeacherRecommendationsReady,
    profile.readiness.hasCounselorDocumentsReady,
    profile.readiness.hasEssayDraftsStarted,
  ];
  const readyCount = readinessValues.filter(Boolean).length;
  let score = readyCount * 5;

  if (profile.readiness.wantsEarlyRound === false) {
    score += 5;
  } else if (profile.readiness.wantsEarlyRound === true && readyCount >= 2) {
    score += 5;
  }

  return clampScore(score);
}

function scoreBudgetComponent(
  school: RecommendationCandidateSchool,
  profile: StudentProfileRecord,
) {
  return budgetLabelToComponent(scoreBudgetLabel(school, profile));
}

function scorePreferenceFit(
  school: RecommendationCandidateSchool,
  profile: StudentProfileRecord,
) {
  let score = 0;
  const schoolTags = new Set(
    school.recommendationInputs.programFitTags.map(normalizeToken),
  );
  const intendedMajors = profile.preferences.intendedMajors.map(normalizeToken);

  if (intendedMajors.some((major) => schoolTags.has(major))) {
    score += 8;
  } else if (schoolTags.size > 0) {
    score += 2;
  }

  if (profile.preferences.preferredStates.includes(school.state)) {
    score += 4;
  }

  const campusLocale = normalizeToken(school.recommendationInputs.campusLocale);
  if (
    campusLocale &&
    profile.preferences.preferredCampusLocale.map(normalizeToken).includes(
      campusLocale,
    )
  ) {
    score += 3;
  }

  if (
    school.recommendationInputs.schoolControl !== "private_for_profit" &&
    school.recommendationInputs.schoolControl !== "unknown" &&
    profile.preferences.preferredSchoolControl.includes(
      school.recommendationInputs.schoolControl,
    )
  ) {
    score += 2;
  }

  if (
    school.recommendationInputs.undergraduateSize !== null &&
    schoolSizeBucket(school.recommendationInputs.undergraduateSize) ===
      profile.preferences.preferredUndergraduateSize
  ) {
    score += 3;
  }

  return clampScore(score);
}

function scoreImprovementUpside(input: {
  currentProfile: StudentProfileRecord;
  projectedProfile: StudentProfileRecord | null;
  projectedAssumptions: string[];
}) {
  if (
    !input.projectedProfile ||
    input.projectedProfile.academic.projectedGpa100 === null ||
    input.currentProfile.academic.currentGpa100 === null
  ) {
    return 0;
  }

  const gpaDelta =
    input.projectedProfile.academic.projectedGpa100 -
    input.currentProfile.academic.currentGpa100;
  const assumptionBonus = Math.min(4, input.projectedAssumptions.length);

  return clampScore(Math.max(0, Math.round(gpaDelta / 1.5)) + assumptionBonus);
}

function scoreStudentIndex(profile: StudentProfileRecord) {
  const gpaScore = (profile.academic.currentGpa100 ?? 0) * 0.6;
  const curriculumBonus =
    profile.academic.curriculumStrength === "most_rigorous"
      ? 14
      : profile.academic.curriculumStrength === "rigorous"
        ? 10
        : profile.academic.curriculumStrength === "baseline"
          ? 5
          : 0;
  const classRankBonus =
    profile.academic.classRankPercent === null
      ? 0
      : profile.academic.classRankPercent <= 5
        ? 14
        : profile.academic.classRankPercent <= 10
          ? 11
          : profile.academic.classRankPercent <= 20
            ? 8
            : profile.academic.classRankPercent <= 35
              ? 4
              : 0;
  const satScore =
    profile.testing.satTotal === null
      ? 0
      : ((profile.testing.satTotal - 800) / 800) * 18;
  const actScore =
    profile.testing.actComposite === null
      ? 0
      : ((profile.testing.actComposite - 15) / 21) * 18;

  return clampToRange(
    Math.round(
      gpaScore + curriculumBonus + classRankBonus + Math.max(satScore, actScore),
    ),
    0,
    100,
  );
}

function scoreSchoolIndex(school: RecommendationCandidateSchool) {
  const admissionRateScore =
    school.recommendationInputs.admissionRateOverall === null
      ? 50
      : clampToRange(
          Math.round((1 - school.recommendationInputs.admissionRateOverall) * 100),
          10,
          95,
        );
  const satScore =
    school.recommendationInputs.satAverageOverall === null
      ? 0
      : clampToRange(
          Math.round(
            ((school.recommendationInputs.satAverageOverall - 800) / 800) * 100,
          ),
          0,
          100,
        );
  const actScore =
    school.recommendationInputs.actMidpointCumulative === null
      ? 0
      : clampToRange(
          Math.round(
            ((school.recommendationInputs.actMidpointCumulative - 15) / 21) * 100,
          ),
          0,
          100,
        );

  if (
    school.recommendationInputs.satAverageOverall === null &&
    school.recommendationInputs.actMidpointCumulative === null
  ) {
    return admissionRateScore;
  }

  return Math.round((admissionRateScore + Math.max(satScore, actScore)) / 2);
}

function scoreBudgetLabel(
  school: RecommendationCandidateSchool,
  profile: StudentProfileRecord,
): BudgetFitLabel {
  const budget = profile.budget.annualBudgetUsd;

  if (budget === null) {
    return "unknown";
  }

  const totalCost = school.estimatedCostOfAttendanceUsd;
  const netPrice =
    school.recommendationInputs.averageNetPriceUsd ?? totalCost;

  if (budget >= totalCost) {
    return "comfortable";
  }

  const aidAvailable =
    school.recommendationInputs.hasNeedBasedAid === true ||
    school.recommendationInputs.hasMeritAid === true ||
    school.scholarshipAvailabilityFlag;
  const flexibilityBuffer =
    profile.budget.budgetFlexibility === "high"
      ? 12000
      : profile.budget.budgetFlexibility === "medium"
        ? 6000
        : 0;
  const effectiveBudget = budget + flexibilityBuffer;

  if (effectiveBudget >= netPrice && aidAvailable) {
    return "stretch";
  }

  if (effectiveBudget + 5000 >= totalCost && aidAvailable) {
    return "stretch";
  }

  return "high_risk";
}

function budgetLabelToComponent(label: BudgetFitLabel) {
  switch (label) {
    case "comfortable":
      return 20;
    case "stretch":
      return 11;
    case "high_risk":
      return 4;
    default:
      return 0;
  }
}

function scoreDeadlinePressure(profile: StudentProfileRecord): DeadlinePressureLabel {
  const readyCount = [
    profile.readiness.hasTeacherRecommendationsReady,
    profile.readiness.hasCounselorDocumentsReady,
    profile.readiness.hasEssayDraftsStarted,
  ].filter(Boolean).length;

  if (profile.readiness.wantsEarlyRound && readyCount <= 1) {
    return "high";
  }

  if (profile.readiness.wantsEarlyRound || readyCount === 2) {
    return "medium";
  }

  return "low";
}

function scoreConfidenceLevel(
  school: RecommendationCandidateSchool,
): ConfidenceLevel {
  let missingClusters = 0;

  if (
    school.recommendationInputs.admissionRateOverall === null &&
    school.recommendationInputs.satAverageOverall === null &&
    school.recommendationInputs.actMidpointCumulative === null
  ) {
    missingClusters += 1;
  }

  if (
    school.recommendationInputs.averageNetPriceUsd === null &&
    school.recommendationInputs.hasNeedBasedAid === null &&
    school.recommendationInputs.hasMeritAid === null
  ) {
    missingClusters += 1;
  }

  if (
    school.recommendationInputs.programFitTags.length === 0 ||
    school.recommendationInputs.campusLocale === null ||
    school.recommendationInputs.schoolControl === "unknown" ||
    school.recommendationInputs.undergraduateSize === null
  ) {
    missingClusters += 1;
  }

  if (missingClusters === 0) {
    return "high";
  }

  if (missingClusters === 1) {
    return "medium";
  }

  return "low";
}

function totalBreakdown(breakdown: ScoreComponentBreakdown) {
  return clampToRange(
    breakdown.admissionFit +
      breakdown.readinessFit +
      breakdown.budgetFit +
      breakdown.preferenceFit +
      breakdown.improvementUpside,
    0,
    100,
  );
}

function scoreToTier(score: number): RecommendationTier {
  if (score >= 80) {
    return "safety";
  }

  if (score >= 60) {
    return "target";
  }

  return "reach";
}

function scoreToOutlook(score: number): OutlookLabel {
  if (score >= 85) {
    return "very_strong";
  }

  if (score >= 70) {
    return "strong";
  }

  if (score >= 55) {
    return "possible";
  }

  if (score >= 40) {
    return "stretch";
  }

  return "unlikely";
}

function schoolSizeBucket(size: number) {
  if (size < 5000) {
    return "small";
  }

  if (size <= 15000) {
    return "medium";
  }

  return "large";
}

function differenceAssumptions(current: string[], projected: string[]) {
  const currentSet = new Set(current.map(normalizeToken));

  return projected.filter(
    (assumption) => !currentSet.has(normalizeToken(assumption)),
  );
}

function normalizeToken(value: string | null) {
  if (!value) {
    return "";
  }

  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function clampScore(score: number) {
  return clampToRange(Math.round(score), 0, 20);
}

function clampToRange(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toRecommendationRunRecord(
  row: typeof recommendationRuns.$inferSelect,
): RecommendationRunRecord {
  return {
    id: row.id,
    userId: row.userId,
    studentProfileId: row.studentProfileId,
    currentSnapshotId: row.currentSnapshotId,
    projectedSnapshotId: row.projectedSnapshotId,
    runStatus: row.runStatus as RecommendationRunStatus,
    missingProfileFields: row.missingProfileFields,
    candidateSchoolCount: row.candidateSchoolCount,
    createdAt: row.createdAt.toISOString(),
    finishedAt: row.finishedAt?.toISOString() ?? null,
  };
}

function toRecommendationResultRecord(
  row: typeof recommendationResults.$inferSelect,
): RecommendationResultRecord {
  return {
    id: row.id,
    recommendationRunId: row.recommendationRunId,
    universityId: row.universityId,
    tier: row.tier as RecommendationTier,
    currentOutlook: row.currentOutlook as OutlookLabel,
    projectedOutlook: row.projectedOutlook as OutlookLabel | null,
    confidenceLevel: row.confidenceLevel as ConfidenceLevel,
    budgetFit: row.budgetFit as BudgetFitLabel,
    deadlinePressure: row.deadlinePressure as DeadlinePressureLabel,
    currentScore: row.currentScore,
    projectedScore: row.projectedScore,
    currentScoreBreakdown: row.currentScoreBreakdown,
    projectedScoreBreakdown: row.projectedScoreBreakdown,
    projectedAssumptionDelta: row.projectedAssumptionDelta,
    rankOrder: row.rankOrder,
    createdAt: row.createdAt.toISOString(),
  };
}

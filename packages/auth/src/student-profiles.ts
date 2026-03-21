// packages/auth/src/student-profiles.ts
// Canonical profile persistence helpers for the authenticated student path.
// Keeps profile writes and snapshot writes consistent with one DB-backed workflow.

import {
  defaultStudentAcademicProfile,
  defaultStudentBudgetProfile,
  defaultStudentPreferenceProfile,
  defaultStudentReadinessProfile,
  defaultStudentTestingProfile,
  studentProfileSnapshots,
  studentProfiles,
  type StudentAcademicProfile,
  type StudentBudgetProfile,
  type StudentPreferenceProfile,
  type StudentProfileMissingField,
  type StudentProfileRecord,
  type StudentProfileSnapshotKind,
  type StudentReadinessProfile,
  type StudentTestingProfile,
} from "@etest/db";
import { and, eq } from "drizzle-orm";

import { getAuthDb } from "./auth.js";

export interface StudentProfileInput {
  citizenshipCountry: string;
  targetEntryTerm: string;
  academic: StudentAcademicProfile;
  testing: StudentTestingProfile;
  preferences: StudentPreferenceProfile;
  budget: StudentBudgetProfile;
  readiness: StudentReadinessProfile;
}

export interface StudentProfileState {
  profile: StudentProfileRecord | null;
  snapshots: Record<
    StudentProfileSnapshotKind,
    {
      assumptions: string[];
      profile: StudentProfileRecord | null;
    }
  >;
  missingFields: StudentProfileMissingField[];
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function toStudentProfileRecord(
  row: typeof studentProfiles.$inferSelect,
): StudentProfileRecord {
  return {
    id: row.id,
    userId: row.userId,
    citizenshipCountry: row.citizenshipCountry,
    targetEntryTerm: row.targetEntryTerm,
    academic: row.academic,
    testing: row.testing,
    preferences: row.preferences,
    budget: row.budget,
    readiness: row.readiness,
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  };
}

export function getDefaultStudentProfileInput(): StudentProfileInput {
  return {
    citizenshipCountry: "",
    targetEntryTerm: "",
    academic: { ...defaultStudentAcademicProfile },
    testing: { ...defaultStudentTestingProfile },
    preferences: { ...defaultStudentPreferenceProfile },
    budget: { ...defaultStudentBudgetProfile },
    readiness: { ...defaultStudentReadinessProfile },
  };
}

export function evaluateMissingStudentProfileFields(
  profile: StudentProfileInput,
): StudentProfileMissingField[] {
  const missingFields: StudentProfileMissingField[] = [];

  if (!profile.citizenshipCountry.trim()) {
    missingFields.push({
      path: "citizenshipCountry",
      message: "Citizenship country is required.",
    });
  }

  if (!profile.targetEntryTerm.trim()) {
    missingFields.push({
      path: "targetEntryTerm",
      message: "Target entry term is required.",
    });
  }

  if (profile.academic.currentGpa100 === null) {
    missingFields.push({
      path: "academic.currentGpa100",
      message: "Current GPA is required.",
    });
  }

  if (profile.academic.curriculumStrength === "unknown") {
    missingFields.push({
      path: "academic.curriculumStrength",
      message: "Curriculum strength is required.",
    });
  }

  if (profile.preferences.intendedMajors.length === 0) {
    missingFields.push({
      path: "preferences.intendedMajors",
      message: "At least one intended major is required.",
    });
  }

  if (profile.testing.englishExamType === "unknown") {
    missingFields.push({
      path: "testing.englishExamType",
      message: "English exam status is required.",
    });
  }

  if (profile.testing.willSubmitTests === null) {
    missingFields.push({
      path: "testing.willSubmitTests",
      message: "Test submission intent is required.",
    });
  }

  if (profile.budget.annualBudgetUsd === null) {
    missingFields.push({
      path: "budget.annualBudgetUsd",
      message: "Annual budget is required.",
    });
  }

  if (profile.budget.needsFinancialAid === null) {
    missingFields.push({
      path: "budget.needsFinancialAid",
      message: "Financial aid need is required.",
    });
  }

  if (profile.budget.needsMeritAid === null) {
    missingFields.push({
      path: "budget.needsMeritAid",
      message: "Merit aid preference is required.",
    });
  }

  if (profile.readiness.wantsEarlyRound === null) {
    missingFields.push({
      path: "readiness.wantsEarlyRound",
      message: "Early-round intent is required.",
    });
  }

  return missingFields;
}

export async function getStudentProfileStateForUser(
  userId: string,
): Promise<StudentProfileState> {
  const authDb = await getAuthDb();
  const profile = await authDb.query.studentProfiles.findFirst({
    where: eq(studentProfiles.userId, userId),
    with: {
      snapshots: true,
    },
  });

  if (!profile) {
    return {
      profile: null,
      snapshots: {
        current: {
          assumptions: [],
          profile: null,
        },
        projected: {
          assumptions: [],
          profile: null,
        },
      },
      missingFields: evaluateMissingStudentProfileFields(
        getDefaultStudentProfileInput(),
      ),
    };
  }

  const normalizedProfile = toStudentProfileRecord(profile);
  const currentSnapshot =
    profile.snapshots.find((snapshot) => snapshot.snapshotKind === "current") ??
    null;
  const projectedSnapshot =
    profile.snapshots.find((snapshot) => snapshot.snapshotKind === "projected") ??
    null;

  return {
    profile: normalizedProfile,
    snapshots: {
      current: {
        assumptions: currentSnapshot?.assumptions ?? [],
        profile: currentSnapshot?.profile ?? normalizedProfile,
      },
      projected: {
        assumptions: projectedSnapshot?.assumptions ?? [],
        profile: projectedSnapshot?.profile ?? normalizedProfile,
      },
    },
    missingFields: evaluateMissingStudentProfileFields({
      citizenshipCountry: profile.citizenshipCountry,
      targetEntryTerm: profile.targetEntryTerm,
      academic: profile.academic,
      testing: profile.testing,
      preferences: profile.preferences,
      budget: profile.budget,
      readiness: profile.readiness,
    }),
  };
}

export async function saveStudentProfileStateForUser(input: {
  userId: string;
  currentProfile: StudentProfileInput;
  projectedProfile: StudentProfileInput;
  currentAssumptions: string[];
  projectedAssumptions: string[];
}) {
  const authDb = await getAuthDb();
  const existingProfile = await authDb.query.studentProfiles.findFirst({
    where: eq(studentProfiles.userId, input.userId),
  });

  const values = {
    userId: input.userId,
    citizenshipCountry: input.currentProfile.citizenshipCountry.trim(),
    targetEntryTerm: input.currentProfile.targetEntryTerm.trim(),
    academic: {
      ...input.currentProfile.academic,
      projectedGpa100: input.projectedProfile.academic.projectedGpa100,
    },
    testing: input.currentProfile.testing,
    preferences: input.currentProfile.preferences,
    budget: input.currentProfile.budget,
    readiness: input.currentProfile.readiness,
    updatedAt: new Date(),
  };

  const [savedProfile] = existingProfile
    ? await authDb
        .update(studentProfiles)
        .set(values)
        .where(eq(studentProfiles.id, existingProfile.id))
        .returning()
    : await authDb
        .insert(studentProfiles)
        .values(values)
        .returning();

  const profileRecord = toStudentProfileRecord(savedProfile);
  const currentSnapshotProfile: StudentProfileRecord = {
    ...profileRecord,
    citizenshipCountry: input.currentProfile.citizenshipCountry.trim(),
    targetEntryTerm: input.currentProfile.targetEntryTerm.trim(),
    academic: {
      ...input.currentProfile.academic,
      projectedGpa100: input.projectedProfile.academic.projectedGpa100,
    },
    testing: input.currentProfile.testing,
    preferences: input.currentProfile.preferences,
    budget: input.currentProfile.budget,
    readiness: input.currentProfile.readiness,
  };
  const projectedSnapshotProfile: StudentProfileRecord = {
    ...profileRecord,
    citizenshipCountry: input.projectedProfile.citizenshipCountry.trim(),
    targetEntryTerm: input.projectedProfile.targetEntryTerm.trim(),
    academic: input.projectedProfile.academic,
    testing: input.projectedProfile.testing,
    preferences: input.projectedProfile.preferences,
    budget: input.projectedProfile.budget,
    readiness: input.projectedProfile.readiness,
  };

  await upsertStudentProfileSnapshot({
    studentProfileId: savedProfile.id,
    snapshotKind: "current",
    assumptions: input.currentAssumptions,
    profile: currentSnapshotProfile,
  });

  await upsertStudentProfileSnapshot({
    studentProfileId: savedProfile.id,
    snapshotKind: "projected",
    assumptions: input.projectedAssumptions,
    profile: projectedSnapshotProfile,
  });

  return getStudentProfileStateForUser(input.userId);
}

async function upsertStudentProfileSnapshot(input: {
  studentProfileId: string;
  snapshotKind: StudentProfileSnapshotKind;
  assumptions: string[];
  profile: StudentProfileRecord;
}) {
  const authDb = await getAuthDb();
  const existingSnapshot = await authDb.query.studentProfileSnapshots.findFirst({
    where: and(
      eq(studentProfileSnapshots.studentProfileId, input.studentProfileId),
      eq(studentProfileSnapshots.snapshotKind, input.snapshotKind),
    ),
  });

  if (!existingSnapshot) {
    await authDb.insert(studentProfileSnapshots).values({
      studentProfileId: input.studentProfileId,
      snapshotKind: input.snapshotKind,
      assumptions: input.assumptions,
      profile: input.profile,
    });
    return;
  }

  await authDb
    .update(studentProfileSnapshots)
    .set({
      assumptions: input.assumptions,
      profile: input.profile,
    })
    .where(eq(studentProfileSnapshots.id, existingSnapshot.id));
}

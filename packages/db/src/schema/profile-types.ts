// packages/db/src/schema/profile-types.ts
// Canonical student-profile and auth-adjacent types for recommendation inputs.
// Keeps profile shapes isolated from the larger catalog type bucket.

import type { SchoolControl } from "./types.js";

export const studentCurriculumStrengths = [
  "baseline",
  "rigorous",
  "most_rigorous",
  "unknown",
] as const;

export type StudentCurriculumStrength =
  (typeof studentCurriculumStrengths)[number];

export const englishExamTypes = [
  "ielts",
  "toefl",
  "duolingo",
  "none",
  "unknown",
] as const;

export type EnglishExamType = (typeof englishExamTypes)[number];

export const preferredUndergraduateSizes = [
  "small",
  "medium",
  "large",
  "unknown",
] as const;

export type PreferredUndergraduateSize =
  (typeof preferredUndergraduateSizes)[number];

export const budgetFlexibilities = [
  "low",
  "medium",
  "high",
  "unknown",
] as const;

export type BudgetFlexibility = (typeof budgetFlexibilities)[number];

export const studentProfileSnapshotKinds = ["current", "projected"] as const;

export type StudentProfileSnapshotKind =
  (typeof studentProfileSnapshotKinds)[number];

export type StudentPreferredSchoolControl = Extract<
  SchoolControl,
  "public" | "private_nonprofit"
>;

export interface StudentAcademicProfile {
  currentGpa100: number | null;
  projectedGpa100: number | null;
  curriculumStrength: StudentCurriculumStrength;
  classRankPercent: number | null;
}

export interface StudentTestingProfile {
  satTotal: number | null;
  actComposite: number | null;
  englishExamType: EnglishExamType;
  englishExamScore: number | null;
  willSubmitTests: boolean | null;
}

export interface StudentPreferenceProfile {
  intendedMajors: string[];
  preferredStates: string[];
  preferredCampusLocale: string[];
  preferredSchoolControl: StudentPreferredSchoolControl[];
  preferredUndergraduateSize: PreferredUndergraduateSize;
}

export interface StudentBudgetProfile {
  annualBudgetUsd: number | null;
  needsFinancialAid: boolean | null;
  needsMeritAid: boolean | null;
  budgetFlexibility: BudgetFlexibility;
}

export interface StudentReadinessProfile {
  wantsEarlyRound: boolean | null;
  hasTeacherRecommendationsReady: boolean | null;
  hasCounselorDocumentsReady: boolean | null;
  hasEssayDraftsStarted: boolean | null;
}

export interface StudentProfileRecord {
  id: string;
  userId: string;
  citizenshipCountry: string;
  targetEntryTerm: string;
  academic: StudentAcademicProfile;
  testing: StudentTestingProfile;
  preferences: StudentPreferenceProfile;
  budget: StudentBudgetProfile;
  readiness: StudentReadinessProfile;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfileSnapshotRecord {
  id: string;
  studentProfileId: string;
  snapshotKind: StudentProfileSnapshotKind;
  assumptions: string[];
  profile: StudentProfileRecord;
  createdAt: string;
}

export interface StudentProfileMissingField {
  snapshotKind: StudentProfileSnapshotKind;
  path: string;
  message: string;
}

export const defaultStudentAcademicProfile: StudentAcademicProfile = {
  currentGpa100: null,
  projectedGpa100: null,
  curriculumStrength: "unknown",
  classRankPercent: null,
};

export const defaultStudentTestingProfile: StudentTestingProfile = {
  satTotal: null,
  actComposite: null,
  englishExamType: "unknown",
  englishExamScore: null,
  willSubmitTests: null,
};

export const defaultStudentPreferenceProfile: StudentPreferenceProfile = {
  intendedMajors: [],
  preferredStates: [],
  preferredCampusLocale: [],
  preferredSchoolControl: [],
  preferredUndergraduateSize: "unknown",
};

export const defaultStudentBudgetProfile: StudentBudgetProfile = {
  annualBudgetUsd: null,
  needsFinancialAid: null,
  needsMeritAid: null,
  budgetFlexibility: "unknown",
};

export const defaultStudentReadinessProfile: StudentReadinessProfile = {
  wantsEarlyRound: null,
  hasTeacherRecommendationsReady: null,
  hasCounselorDocumentsReady: null,
  hasEssayDraftsStarted: null,
};

// packages/db/src/schema/types.ts
// Shared catalog schema types for Drizzle tables and downstream packages.
// Keeps the database and domain packages aligned on one canonical field model.

export const catalogRequiredFields = [
  "schoolName",
  "city",
  "state",
  "officialAdmissionsUrl",
  "applicationRounds",
  "deadlinesByRound",
  "englishRequirements",
  "testPolicy",
  "requiredMaterials",
  "tuitionAnnualUsd",
  "estimatedCostOfAttendanceUsd",
  "livingCostEstimateUsd",
  "scholarshipAvailabilityFlag",
  "scholarshipNotes",
  "lastVerifiedAt",
] as const;

export type CatalogRequiredField = (typeof catalogRequiredFields)[number];

export const universityValidationStatuses = [
  "draft",
  "publishable",
  "rejected",
] as const;

export type UniversityValidationStatus =
  (typeof universityValidationStatuses)[number];

export const universitySourceKinds = [
  "official_admissions",
  "official_tuition",
  "official_cost_of_attendance",
  "official_scholarship",
  "manual_review",
] as const;

export type UniversitySourceKind = (typeof universitySourceKinds)[number];

export const catalogImportStatuses = [
  "pending",
  "fetching",
  "extracting",
  "normalizing",
  "validating",
  "persisting",
  "succeeded",
  "failed",
] as const;

export type CatalogImportStatus = (typeof catalogImportStatuses)[number];

export const universityValidationReasonCodes = [
  "missing_required_field",
  "missing_source_provenance",
] as const;

export type UniversityValidationReasonCode =
  (typeof universityValidationReasonCodes)[number];

export type ApplicationRound =
  | "early_action"
  | "early_decision"
  | "regular_decision"
  | "rolling_admission"
  | "priority";

export type DeadlinesByRound = Partial<Record<ApplicationRound, string>>;

export interface EnglishRequirements {
  minimumIelts: number | null;
  minimumToeflInternetBased: number | null;
  waiverNotes: string | null;
}

export interface UniversityValidationReason {
  code: UniversityValidationReasonCode;
  field: CatalogRequiredField;
  message: string;
}

export interface UniversitySourceMetadata {
  capturedValue?: string;
  notes?: string;
}

export interface CatalogImportRunMetadata {
  triggeredBy: "seed" | "manual" | "scheduled";
  attemptCount: number;
}

export interface CatalogImportItemPayload {
  html?: string;
  extractedText?: string;
  normalizedValue?: unknown;
}

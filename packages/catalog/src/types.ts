// packages/catalog/src/types.ts
// Normalized catalog types used by validators and downstream catalog workflows.
// Mirrors the required school facts from the PRD while keeping provenance separate.

import type {
  ApplicationRound,
  CatalogRequiredField,
  DeadlinesByRound,
  EnglishRequirements,
  UniversitySourceKind,
  UniversityValidationReason,
  UniversityValidationStatus,
} from "@etest/db";

export interface NormalizedUniversityCatalogRecord {
  schoolName: string;
  city: string;
  state: string;
  officialAdmissionsUrl: string;
  applicationRounds: ApplicationRound[];
  deadlinesByRound: DeadlinesByRound;
  englishRequirements: EnglishRequirements;
  testPolicy: string;
  requiredMaterials: string[];
  tuitionAnnualUsd: number;
  estimatedCostOfAttendanceUsd: number;
  livingCostEstimateUsd: number;
  scholarshipAvailabilityFlag: boolean;
  scholarshipNotes: string;
  lastVerifiedAt: Date;
}

export interface UniversityFieldProvenance {
  fieldKey: CatalogRequiredField | string;
  sourceKind: UniversitySourceKind;
  sourceUrl: string;
  lastVerifiedAt: Date;
}

export interface UniversityPublishabilityResult {
  status: Extract<UniversityValidationStatus, "publishable" | "rejected">;
  reasons: UniversityValidationReason[];
}

// packages/auth/src/index.ts
// Public export surface for the shared Better Auth package.
// Keeps the web app importing one canonical auth instance and helpers.

export { getAuth, getAuthDb } from "./auth.js";
export type { StudentLocationPreferenceKind } from "@etest/db";
export {
  buildStudentProfileDocumentFromState,
  evaluateMissingStudentProfileFields,
  evaluateRecommendationMissingFields,
  evaluateRecommendationRunReadinessFromDocument,
  evaluateRecommendationRunReadinessFromState,
  getDefaultStudentProfileInput,
  getStudentIntakeStateForUser,
  getStudentProfileStateForUser,
  saveStudentIntakeStateForUser,
  saveStudentProfileStateForUser,
  toRecommendationMissingFieldPaths,
  type StudentIntakeMessageInput,
  type StudentIntakeStateInput,
  type StudentProfileDocument,
  type StudentProfileInput,
  type StudentProfileMissingField,
  type StudentProfileSnapshotInput,
  type StudentProfileState,
} from "./student-profiles.js";

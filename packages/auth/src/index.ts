// packages/auth/src/index.ts
// Public export surface for the shared Better Auth package.
// Keeps the web app importing one canonical auth instance and helpers.

export { getAuth, getAuthDb } from "./auth.js";
export {
  buildStudentProfileDocumentFromState,
  evaluateMissingStudentProfileFields,
  evaluateRecommendationMissingFields,
  evaluateRecommendationRunReadinessFromDocument,
  evaluateRecommendationRunReadinessFromState,
  getDefaultStudentProfileInput,
  getStudentProfileStateForUser,
  saveStudentProfileStateForUser,
  toRecommendationMissingFieldPaths,
  type StudentProfileDocument,
  type StudentProfileInput,
  type StudentProfileMissingField,
  type StudentProfileSnapshotInput,
  type StudentProfileState,
} from "./student-profiles.js";

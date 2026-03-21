// packages/auth/src/index.ts
// Public export surface for the shared Better Auth package.
// Keeps the web app importing one canonical auth instance and helpers.

export { getAuth, getAuthDb } from "./auth.js";
export {
  evaluateMissingStudentProfileFields,
  getDefaultStudentProfileInput,
  getStudentProfileStateForUser,
  saveStudentProfileStateForUser,
  type StudentProfileInput,
  type StudentProfileState,
} from "./student-profiles.js";

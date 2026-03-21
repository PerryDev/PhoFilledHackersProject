// Entry wrapper for the standalone student onboarding app.
// Keeps the route import stable while delegating to the new Figma-aligned experience.
"use client";

import { StudentOnboardingExperience } from "./student-onboarding-experience";

export function StudentOnboardingApp() {
  return <StudentOnboardingExperience />;
}

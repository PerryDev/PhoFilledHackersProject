// apps/student-onboarding/app/page.tsx
// Home route for the canonical student onboarding app.
// Loads the shared profile state on the server before rendering the client experience.
import {
  getStudentIntakeStateForUser,
  getStudentProfileStateForUser,
} from "@etest/auth";
import { requireAuthSession } from "@/lib/auth-session";
import { buildStudentProfileDocumentFromState } from "@/lib/student-profile";
import { StudentOnboardingExperience } from "@/components/student-onboarding/student-onboarding-experience";

export default async function HomePage() {
  const session = await requireAuthSession();
  const [initialState, initialIntakeState] = await Promise.all([
    getStudentProfileStateForUser(session.user.id),
    getStudentIntakeStateForUser(session.user.id),
  ]);
  const initialDocument = buildStudentProfileDocumentFromState(initialState);

  return (
    <StudentOnboardingExperience
      viewer={{
        name: session.user.name || "Student",
        email: session.user.email,
      }}
      initialDocument={initialDocument}
      initialIntakeState={initialIntakeState}
      initialRoute="chat"
    />
  );
}

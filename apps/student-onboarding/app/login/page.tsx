// apps/student-onboarding/app/login/page.tsx
// Public auth entrypoint for the canonical student onboarding app.
// Redirects authenticated users away before rendering the Figma-auth-wall-aligned login surface.
import { getAuthSession } from "@/lib/auth-session";
import { StudentOnboardingLoginScreen } from "@/components/student-onboarding/student-onboarding-login-screen";
import { redirect } from "next/navigation";

export default async function LoginRoute() {
  const session = await getAuthSession();

  if (session) {
    redirect("/");
  }

  return <StudentOnboardingLoginScreen />;
}

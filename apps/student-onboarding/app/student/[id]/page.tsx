// apps/student-onboarding/app/student/[id]/page.tsx
// Legacy student detail route.
// Redirects to the canonical onboarding home route for authenticated users.
import { redirect } from "next/navigation";
import { requireAuthSession } from "@/lib/auth-session";

export default async function StudentPage() {
  await requireAuthSession();
  redirect("/");
}

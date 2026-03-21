import { LoginPage } from "@/components/dashboard/login-page";
import { getAuthSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function LoginRoute() {
  const session = await getAuthSession();

  if (session) {
    redirect("/profile");
  }

  return <LoginPage />;
}

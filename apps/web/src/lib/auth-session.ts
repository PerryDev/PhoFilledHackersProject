// apps/web/src/lib/auth-session.ts
// Server-side Better Auth session helpers for protected routes and handlers.
// Keeps authorization checks on the server instead of trusting client state.

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@etest/auth";

export async function getOptionalServerSession() {
  const auth = await getAuth();

  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireServerSession() {
  const session = await getOptionalServerSession();

  if (!session?.session || !session.user) {
    redirect("/login");
  }

  return session;
}

export const getAuthSession = getOptionalServerSession;
export const requireAuthSession = requireServerSession;

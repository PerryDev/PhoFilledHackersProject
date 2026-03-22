// apps/student-onboarding/app/api/auth/[...all]/route.ts
// Better Auth App Router endpoint for the student-onboarding app.
// Exposes the canonical shared auth handler under /api/auth.

import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@etest/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { GET } = toNextJsHandler(await getAuth());
  return GET(request);
}

export async function POST(request: Request) {
  const { POST } = toNextJsHandler(await getAuth());
  return POST(request);
}

// apps/web/app/api/auth/[...all]/route.ts
// Better Auth App Router endpoint for session and credential flows.
// Exposes the canonical shared auth handler under `/api/auth`.

import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@etest/auth";

export async function GET(request: Request) {
  const { GET } = toNextJsHandler(await getAuth());
  return GET(request);
}

export async function POST(request: Request) {
  const { POST } = toNextJsHandler(await getAuth());
  return POST(request);
}

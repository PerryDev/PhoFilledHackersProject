// apps/web/app/api/recommendations/runs/route.ts
// Authenticated recommendation-run endpoint for the current student profile.
// Orchestrates session lookup, canonical run-readiness, and deterministic scoring.

import {
  getAuthDb,
  getStudentProfileStateForUser,
} from "@etest/auth";
import {
  RecommendationEngineInputError,
  runRecommendationEngineForUser,
} from "@etest/catalog";
import { NextResponse } from "next/server";

import { getOptionalServerSession } from "@/lib/auth-session";

export const runtime = "nodejs";

export async function POST() {
  const session = await getOptionalServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [authDb, profileState] = await Promise.all([
    getAuthDb(),
    getStudentProfileStateForUser(session.user.id),
  ]);
  try {
    const runResult = await runRecommendationEngineForUser({
      db: authDb,
      userId: session.user.id,
      profileState,
    });

    return NextResponse.json(runResult);
  } catch (error) {
    if (error instanceof RecommendationEngineInputError) {
      return NextResponse.json(
        {
          error: error.message,
          missingFields: error.missingFields,
        },
        { status: 400 },
      );
    }

    throw error;
  }
}

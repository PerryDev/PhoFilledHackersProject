// apps/web/app/api/profile/route.ts
// Internal profile persistence endpoint for the authenticated student.
// Reads and writes the canonical student profile plus current/projected snapshot assumptions.

import {
  getStudentProfileStateForUser,
  saveStudentProfileStateForUser,
  type StudentProfileInput,
} from "@etest/auth";
import { NextResponse } from "next/server";
import { getOptionalServerSession } from "@/lib/auth-session";

type ProfileRoutePayload = {
  currentProfile: StudentProfileInput;
  projectedProfile: StudentProfileInput;
  currentAssumptions: string[];
  projectedAssumptions: string[];
};

export async function GET() {
  const session = await getOptionalServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profileState = await getStudentProfileStateForUser(session.user.id);

  return NextResponse.json(profileState);
}

export async function PUT(request: Request) {
  const session = await getOptionalServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as ProfileRoutePayload;

  const profileState = await saveStudentProfileStateForUser({
    userId: session.user.id,
    currentProfile: body.currentProfile,
    projectedProfile: body.projectedProfile,
    currentAssumptions: body.currentAssumptions,
    projectedAssumptions: body.projectedAssumptions,
  });

  return NextResponse.json(profileState);
}

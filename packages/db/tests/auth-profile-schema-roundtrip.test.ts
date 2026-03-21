// packages/db/tests/auth-profile-schema-roundtrip.test.ts
// Integration coverage for the auth and student-profile schema slice.
// Verifies Better Auth tables and profile snapshots round-trip through the checked-in migration.

import assert from "node:assert/strict";
import test from "node:test";

import { eq } from "drizzle-orm";

import {
  accounts,
  sessions,
  studentProfiles,
  studentProfileSnapshots,
  users,
} from "../src/index.js";
import { createCatalogTestDatabase } from "../src/testing/pglite.js";

test("auth rows and student profile snapshots round-trip through the schema", async () => {
  const database = await createCatalogTestDatabase();

  try {
    await database.db.insert(users).values({
      id: "user_1",
      name: "Minh Anh",
      email: "minh.anh@example.com",
      emailVerified: true,
      image: null,
    });

    await database.db.insert(accounts).values({
      id: "account_1",
      accountId: "minh.anh@example.com",
      providerId: "credential",
      userId: "user_1",
      password: "hashed-password",
    });

    await database.db.insert(sessions).values({
      id: "session_1",
      expiresAt: new Date("2026-04-21T00:00:00.000Z"),
      token: "token_1",
      userId: "user_1",
      ipAddress: "127.0.0.1",
      userAgent: "node:test",
    });

    const [insertedProfile] = await database.db
      .insert(studentProfiles)
      .values({
        userId: "user_1",
        citizenshipCountry: "VN",
        targetEntryTerm: "fall_2027",
        academic: {
          currentGpa100: 91,
          projectedGpa100: 94,
          curriculumStrength: "rigorous",
          classRankPercent: 12,
        },
        testing: {
          satTotal: 1450,
          actComposite: null,
          englishExamType: "ielts",
          englishExamScore: 7.5,
          willSubmitTests: true,
        },
        preferences: {
          intendedMajors: ["computer_science", "data_science"],
          preferredStates: ["CA", "MA"],
          preferredCampusLocale: ["urban"],
          preferredSchoolControl: ["public", "private_nonprofit"],
          preferredUndergraduateSize: "medium",
        },
        budget: {
          annualBudgetUsd: 50000,
          needsFinancialAid: true,
          needsMeritAid: true,
          budgetFlexibility: "medium",
        },
        readiness: {
          wantsEarlyRound: true,
          hasTeacherRecommendationsReady: false,
          hasCounselorDocumentsReady: false,
          hasEssayDraftsStarted: true,
        },
      })
      .returning();

    const snapshotProfile = {
      id: insertedProfile.id,
      userId: insertedProfile.userId,
      citizenshipCountry: insertedProfile.citizenshipCountry,
      targetEntryTerm: insertedProfile.targetEntryTerm,
      academic: insertedProfile.academic,
      testing: insertedProfile.testing,
      preferences: insertedProfile.preferences,
      budget: insertedProfile.budget,
      readiness: insertedProfile.readiness,
      createdAt: insertedProfile.createdAt.toISOString(),
      updatedAt: insertedProfile.updatedAt.toISOString(),
    };

    await database.db.insert(studentProfileSnapshots).values([
      {
        studentProfileId: insertedProfile.id,
        snapshotKind: "current",
        assumptions: [],
        profile: snapshotProfile,
      },
      {
        studentProfileId: insertedProfile.id,
        snapshotKind: "projected",
        assumptions: ["Raise GPA to 94", "Complete counselor documents"],
        profile: snapshotProfile,
      },
    ]);

    const storedProfile = await database.db.query.studentProfiles.findFirst({
      where: eq(studentProfiles.id, insertedProfile.id),
      with: {
        user: true,
        snapshots: true,
      },
    });

    assert.ok(storedProfile);
    assert.equal(storedProfile.user.email, "minh.anh@example.com");
    assert.equal(storedProfile.testing.englishExamType, "ielts");
    assert.equal(storedProfile.preferences.preferredUndergraduateSize, "medium");
    assert.equal(storedProfile.snapshots.length, 2);

    const projectedSnapshot = storedProfile.snapshots.find(
      (snapshot) => snapshot.snapshotKind === "projected",
    );

    assert.ok(projectedSnapshot);
    assert.deepEqual(projectedSnapshot.assumptions, [
      "Raise GPA to 94",
      "Complete counselor documents",
    ]);
    assert.equal(projectedSnapshot.profile.targetEntryTerm, "fall_2027");
  } finally {
    await database.close();
  }
});

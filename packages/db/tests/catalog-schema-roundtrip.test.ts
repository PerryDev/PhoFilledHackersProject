// packages/db/tests/catalog-schema-roundtrip.test.ts
// Integration coverage for the branch-2 catalog schema slice.
// Verifies the checked-in migration and Drizzle schema work together for universities and provenance rows.

import assert from "node:assert/strict";
import test from "node:test";

import { eq } from "drizzle-orm";

import {
  universities,
  universitySources,
} from "../src/index.js";
import { createCatalogTestDatabase } from "../src/testing/pglite.js";

test("universities and university_sources round-trip through the catalog schema", async () => {
  const database = await createCatalogTestDatabase();

  try {
    const [insertedUniversity] = await database.db
      .insert(universities)
      .values({
        schoolName: "Example University",
        city: "Boston",
        state: "MA",
        officialAdmissionsUrl: "https://example.edu/admissions",
        applicationRounds: ["regular_decision"],
        deadlinesByRound: { regular_decision: "2026-01-15" },
        englishRequirements: {
          minimumIelts: 6.5,
          minimumToeflInternetBased: 90,
          waiverNotes: null,
        },
        testPolicy: "test_optional",
        requiredMaterials: ["transcript", "essay"],
        tuitionAnnualUsd: 55000,
        estimatedCostOfAttendanceUsd: 71000,
        livingCostEstimateUsd: 16000,
        scholarshipAvailabilityFlag: true,
        scholarshipNotes: "Merit scholarships available for international applicants.",
        lastVerifiedAt: new Date("2026-03-21T00:00:00.000Z"),
        validationStatus: "publishable",
      })
      .returning();

    await database.db.insert(universitySources).values({
      universityId: insertedUniversity.id,
      sourceKind: "official_admissions",
      fieldKey: "officialAdmissionsUrl",
      sourceUrl: "https://example.edu/admissions",
      excerpt: "Official admissions landing page.",
      lastVerifiedAt: new Date("2026-03-21T00:00:00.000Z"),
      isPrimary: true,
      metadata: {
        notes: "Primary source for admissions facts.",
      },
    });

    const storedUniversity = await database.db.query.universities.findFirst({
      where: eq(universities.id, insertedUniversity.id),
      with: {
        universitySources: true,
      },
    });

    assert.ok(storedUniversity);
    assert.equal(storedUniversity.schoolName, "Example University");
    assert.equal(storedUniversity.validationStatus, "publishable");
    assert.equal(storedUniversity.universitySources.length, 1);
    assert.equal(
      storedUniversity.universitySources[0]?.fieldKey,
      "officialAdmissionsUrl",
    );
    assert.equal(
      storedUniversity.universitySources[0]?.sourceUrl,
      "https://example.edu/admissions",
    );
  } finally {
    await database.close();
  }
});

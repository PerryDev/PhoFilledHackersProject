// packages/catalog/tests/publishability.test.ts
// Unit tests for branch-2 publishability rules.
// Covers required-field validation and provenance gating for canonical catalog records.

import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateUniversityPublishability,
  validateRequiredUniversityFields,
  type NormalizedUniversityCatalogRecord,
} from "../src/index.js";

function buildRecord(
  overrides: Partial<NormalizedUniversityCatalogRecord> = {},
): NormalizedUniversityCatalogRecord {
  return {
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
    scholarshipNotes: "Merit scholarships available.",
    lastVerifiedAt: new Date("2026-03-21T00:00:00.000Z"),
    ...overrides,
  };
}

const completeProvenance = [
  "schoolName",
  "city",
  "state",
  "officialAdmissionsUrl",
  "applicationRounds",
  "deadlinesByRound",
  "englishRequirements",
  "testPolicy",
  "requiredMaterials",
  "tuitionAnnualUsd",
  "estimatedCostOfAttendanceUsd",
  "livingCostEstimateUsd",
  "scholarshipAvailabilityFlag",
  "scholarshipNotes",
].map((fieldKey) => ({
  fieldKey,
  sourceKind: "official_admissions" as const,
  sourceUrl: `https://example.edu/${fieldKey}`,
  lastVerifiedAt: new Date("2026-03-21T00:00:00.000Z"),
}));

test("a complete source-backed university record is publishable", () => {
  const result = evaluateUniversityPublishability(
    buildRecord(),
    completeProvenance,
  );

  assert.equal(result.status, "publishable");
  assert.deepEqual(result.reasons, []);
});

test("missing required fields produce explicit rejection reasons", () => {
  const reasons = validateRequiredUniversityFields(
    buildRecord({
      schoolName: " ",
      scholarshipNotes: "",
    }),
  );

  assert.deepEqual(
    reasons.map((reason) => [reason.code, reason.field]),
    [
      ["missing_required_field", "schoolName"],
      ["missing_required_field", "scholarshipNotes"],
    ],
  );
});

test("missing provenance produces explicit rejection reasons", () => {
  const result = evaluateUniversityPublishability(buildRecord(), [
    completeProvenance[0]!,
  ]);

  assert.equal(result.status, "rejected");
  assert.ok(
    result.reasons.some(
      (reason) =>
        reason.code === "missing_source_provenance" &&
        reason.field === "tuitionAnnualUsd",
    ),
  );
});

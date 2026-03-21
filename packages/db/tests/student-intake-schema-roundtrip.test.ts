// packages/db/tests/student-intake-schema-roundtrip.test.ts
// Integration coverage for the canonical student intake persistence table.
// Verifies chat history and progress metadata round-trip through the checked-in migration.

import assert from "node:assert/strict";
import test from "node:test";

import { eq } from "drizzle-orm";

import { studentIntakeSessions, users } from "../src/index.js";
import { createCatalogTestDatabase } from "../src/testing/pglite.js";

test("student intake sessions round-trip through the schema", async () => {
  const database = await createCatalogTestDatabase();

  try {
    await database.db.insert(users).values({
      id: "user_1",
      name: "Minh Anh",
      email: "minh.anh@example.com",
      emailVerified: true,
      image: null,
    });

    await database.db.insert(studentIntakeSessions).values({
      userId: "user_1",
      currentStepIndex: 3,
      conversationDone: false,
      messages: [
        {
          id: "message_1",
          role: "assistant",
          text: "Welcome to the intake flow.",
          createdAt: "2026-03-22T00:00:00.000Z",
        },
        {
          id: "message_2",
          role: "student",
          text: "I want to major in computer science.",
          createdAt: "2026-03-22T00:00:05.000Z",
        },
      ],
    });

    const storedSession = await database.db.query.studentIntakeSessions.findFirst({
      where: eq(studentIntakeSessions.userId, "user_1"),
    });

    assert.ok(storedSession);
    assert.equal(storedSession?.currentStepIndex, 3);
    assert.equal(storedSession?.conversationDone, false);
    assert.equal(storedSession?.messages.length, 2);
    assert.equal(storedSession?.messages[0].role, "assistant");
    assert.equal(storedSession?.messages[1].text, "I want to major in computer science.");
  } finally {
    await database.close();
  }
});

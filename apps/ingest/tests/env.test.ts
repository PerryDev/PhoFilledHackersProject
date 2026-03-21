// apps/ingest/tests/env.test.ts
// Verifies the ingest env bootstrap prefers the repo root .env file.

import assert from "node:assert/strict";
import test from "node:test";

import { initializeIngestEnv } from "../src/env.js";

test("initializeIngestEnv loads the repo root .env file when cwd has none", () => {
  const loaded: string[] = [];

  initializeIngestEnv({
    cwd: "/workspace/repo/apps/ingest",
    moduleUrl: "file:///workspace/repo/apps/ingest/src/env.ts",
    existsSyncImpl(path) {
      return String(path).endsWith("/workspace/repo/.env");
    },
    loadEnvFileImpl(path) {
      loaded.push(String(path));
    },
  });

  assert.deepEqual(loaded, ["file:///workspace/repo/.env"]);
});

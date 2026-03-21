// packages/db/src/testing/pglite.ts
// In-memory Postgres helper for db-package integration tests.
// Applies the checked-in migration so tests exercise the same schema contract shipped in this branch.

import { readFile } from "node:fs/promises";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

import * as schema from "../index.js";

export async function createCatalogTestDatabase() {
  const client = new PGlite();
  const migrationSql = await readFile(
    new URL("../../drizzle/0000_catalog_schema.sql", import.meta.url),
    "utf8",
  );

  await client.exec(migrationSql);

  return {
    client,
    db: drizzle(client, { schema }),
    async close() {
      await client.close();
    },
  };
}

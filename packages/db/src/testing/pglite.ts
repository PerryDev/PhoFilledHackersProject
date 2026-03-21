// packages/db/src/testing/pglite.ts
// In-memory Postgres helper for db-package integration tests.
// Applies the same Drizzle migration journal used by the live database workflow.

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import * as schema from "../index.js";

export async function createCatalogTestDatabase() {
  const client = new PGlite();
  const db = drizzle(client, { schema });
  await migrate(db, {
    migrationsFolder: new URL("../../drizzle", import.meta.url).pathname,
  });

  return {
    client,
    db,
    async close() {
      await client.close();
    },
  };
}

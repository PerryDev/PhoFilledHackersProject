// packages/db/drizzle.config.ts
// Drizzle Kit config for the catalog schema package.
// Keeps migration generation anchored to the db package rather than the repo root.

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
});

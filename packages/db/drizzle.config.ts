// packages/db/drizzle.config.ts
// Drizzle Kit config for the catalog schema package.
// Keeps migration generation anchored to the db package rather than the repo root.

import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

import { defineConfig } from "drizzle-kit";

const repoRootEnv = new URL("../../.env", import.meta.url);

if (existsSync(repoRootEnv)) {
  loadEnvFile(repoRootEnv);
}

export default defineConfig({
  schema: "./src/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});

// packages/auth/src/auth.ts
// Shared Better Auth server configuration for the web app.
// Initializes auth and the Drizzle client lazily so app builds stay side-effect free.

import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";

import * as dbSchema from "@etest/db";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __etestAuthSqlClient: postgres.Sql | undefined;
}

const envCandidates = [
  path.join(process.cwd(), ".env"),
  path.join(process.cwd(), "..", ".env"),
  path.join(process.cwd(), "..", "..", ".env"),
];

const repoRootEnvPath = envCandidates.find((candidate) => existsSync(candidate));

if (repoRootEnvPath) {
  loadEnvFile(repoRootEnvPath);
}

type AuthDb = ReturnType<typeof drizzle<typeof dbSchema>>;
type AuthInstance = ReturnType<typeof betterAuth>;

let authDbPromise: Promise<AuthDb> | null = null;
let authPromise: Promise<AuthInstance> | null = null;

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL.");
  }

  return databaseUrl;
}

function getBaseUrl() {
  return (
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

function getSecret() {
  return (
    process.env.BETTER_AUTH_SECRET ??
    "phofilledhackers-development-secret-001"
  );
}

function getSqlClient() {
  if (!globalThis.__etestAuthSqlClient) {
    globalThis.__etestAuthSqlClient = postgres(getDatabaseUrl(), {
      prepare: false,
      max: 5,
    });
  }

  return globalThis.__etestAuthSqlClient;
}

function buildAuthOptions(db: AuthDb): BetterAuthOptions {
  return {
    baseURL: getBaseUrl(),
    secret: getSecret(),
        database: drizzleAdapter(db, {
            provider: "pg",
            schema: {
                ...dbSchema,
                user: dbSchema.users,
        session: dbSchema.sessions,
        account: dbSchema.accounts,
                verification: dbSchema.verifications,
            },
        }),
        emailAndPassword: {
            enabled: true,
        },
    advanced: {
      database: {
        generateId: () => randomUUID(),
      },
    },
  };
}

export async function getAuthDb() {
  if (!authDbPromise) {
    authDbPromise = Promise.resolve(
      drizzle(getSqlClient(), {
        schema: dbSchema,
      }),
    );
  }

  return authDbPromise;
}

export async function getAuth() {
  if (!authPromise) {
    authPromise = getAuthDb().then((db) => betterAuth(buildAuthOptions(db)));
  }

  return authPromise;
}

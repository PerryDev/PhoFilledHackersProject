// packages/db/src/schema/relations.ts
// Drizzle relations for catalog tables used by tests and later application queries.
// Keeps ownership inside the db package so downstream packages can consume one schema surface.

import { relations } from "drizzle-orm";

import {
  catalogImportItems,
  catalogImportRuns,
} from "./imports.js";
import {
  accounts,
  sessions,
  studentProfileSnapshots,
  studentProfiles,
  users,
  verifications,
} from "./student-profiles.js";
import { universities, universitySources } from "./universities.js";

export const universitiesRelations = relations(universities, ({ many }) => ({
  universitySources: many(universitySources),
  catalogImportRuns: many(catalogImportRuns),
  catalogImportItems: many(catalogImportItems),
}));

export const universitySourcesRelations = relations(
  universitySources,
  ({ one }) => ({
    university: one(universities, {
      fields: [universitySources.universityId],
      references: [universities.id],
    }),
  }),
);

export const catalogImportRunsRelations = relations(
  catalogImportRuns,
  ({ many, one }) => ({
    university: one(universities, {
      fields: [catalogImportRuns.universityId],
      references: [universities.id],
    }),
    items: many(catalogImportItems),
  }),
);

export const catalogImportItemsRelations = relations(
  catalogImportItems,
  ({ one }) => ({
    importRun: one(catalogImportRuns, {
      fields: [catalogImportItems.importRunId],
      references: [catalogImportRuns.id],
    }),
    university: one(universities, {
      fields: [catalogImportItems.universityId],
      references: [universities.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationsRelations = relations(verifications, () => ({}));

export const studentProfilesRelations = relations(
  studentProfiles,
  ({ many, one }) => ({
    user: one(users, {
      fields: [studentProfiles.userId],
      references: [users.id],
    }),
    snapshots: many(studentProfileSnapshots),
  }),
);

export const studentProfileSnapshotsRelations = relations(
  studentProfileSnapshots,
  ({ one }) => ({
    studentProfile: one(studentProfiles, {
      fields: [studentProfileSnapshots.studentProfileId],
      references: [studentProfiles.id],
    }),
  }),
);

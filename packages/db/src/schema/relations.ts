// packages/db/src/schema/relations.ts
// Drizzle relations for catalog tables used by tests and later application queries.
// Keeps ownership inside the db package so downstream packages can consume one schema surface.

import { relations } from "drizzle-orm";

import {
  catalogImportItems,
  catalogImportRuns,
} from "./imports.js";
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

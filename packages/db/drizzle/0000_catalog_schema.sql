-- packages/db/drizzle/0000_catalog_schema.sql
-- Initial branch-2 catalog schema for normalized universities, provenance, and import tracking.
-- This is the canonical schema baseline for the catalog-first MVP path.

CREATE TYPE "university_validation_status" AS ENUM (
  'draft',
  'publishable',
  'rejected'
);

CREATE TYPE "university_source_kind" AS ENUM (
  'official_admissions',
  'official_tuition',
  'official_cost_of_attendance',
  'official_scholarship',
  'manual_review'
);

CREATE TYPE "catalog_import_status" AS ENUM (
  'pending',
  'fetching',
  'extracting',
  'normalizing',
  'validating',
  'persisting',
  'succeeded',
  'failed'
);

CREATE TABLE "universities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "school_name" text NOT NULL,
  "city" text NOT NULL,
  "state" text NOT NULL,
  "official_admissions_url" text NOT NULL,
  "application_rounds" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "deadlines_by_round" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "english_requirements" jsonb NOT NULL,
  "test_policy" text NOT NULL,
  "required_materials" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "tuition_annual_usd" integer NOT NULL,
  "estimated_cost_of_attendance_usd" integer NOT NULL,
  "living_cost_estimate_usd" integer NOT NULL,
  "scholarship_availability_flag" boolean NOT NULL,
  "scholarship_notes" text NOT NULL,
  "last_verified_at" timestamptz NOT NULL,
  "validation_status" "university_validation_status" DEFAULT 'draft' NOT NULL,
  "validation_reasons" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "universities_admissions_url_idx"
  ON "universities" ("official_admissions_url");

CREATE INDEX "universities_validation_status_idx"
  ON "universities" ("validation_status");

CREATE TABLE "university_sources" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "university_id" uuid NOT NULL REFERENCES "universities"("id") ON DELETE cascade,
  "source_kind" "university_source_kind" NOT NULL,
  "field_key" text NOT NULL,
  "source_url" text NOT NULL,
  "excerpt" text,
  "last_verified_at" timestamptz NOT NULL,
  "is_primary" boolean DEFAULT false NOT NULL,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "university_sources_university_field_url_idx"
  ON "university_sources" ("university_id", "field_key", "source_url");

CREATE INDEX "university_sources_university_id_idx"
  ON "university_sources" ("university_id");

CREATE TABLE "catalog_import_runs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "university_id" uuid REFERENCES "universities"("id") ON DELETE set null,
  "requested_school_name" text NOT NULL,
  "status" "catalog_import_status" DEFAULT 'pending' NOT NULL,
  "failure_code" text,
  "failure_message" text,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "started_at" timestamptz DEFAULT now() NOT NULL,
  "finished_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX "catalog_import_runs_status_idx"
  ON "catalog_import_runs" ("status");

CREATE TABLE "catalog_import_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "import_run_id" uuid NOT NULL REFERENCES "catalog_import_runs"("id") ON DELETE cascade,
  "university_id" uuid REFERENCES "universities"("id") ON DELETE set null,
  "source_kind" "university_source_kind" NOT NULL,
  "field_key" text NOT NULL,
  "source_url" text NOT NULL,
  "status" "catalog_import_status" DEFAULT 'pending' NOT NULL,
  "raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "normalized_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "failure_code" text,
  "failure_message" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "catalog_import_items_run_field_url_idx"
  ON "catalog_import_items" ("import_run_id", "field_key", "source_url");

CREATE INDEX "catalog_import_items_run_id_idx"
  ON "catalog_import_items" ("import_run_id");

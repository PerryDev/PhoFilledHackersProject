CREATE TYPE "public"."catalog_import_status" AS ENUM('pending', 'fetching', 'extracting', 'normalizing', 'validating', 'persisting', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."university_source_kind" AS ENUM('official_admissions', 'official_tuition', 'official_cost_of_attendance', 'official_scholarship', 'manual_review');--> statement-breakpoint
CREATE TYPE "public"."university_validation_status" AS ENUM('draft', 'publishable', 'rejected');--> statement-breakpoint
CREATE TABLE "catalog_import_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"import_run_id" uuid NOT NULL,
	"university_id" uuid,
	"source_kind" "university_source_kind" NOT NULL,
	"field_key" text NOT NULL,
	"source_url" text NOT NULL,
	"status" "catalog_import_status" DEFAULT 'pending' NOT NULL,
	"raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"normalized_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"failure_code" text,
	"failure_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_import_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"university_id" uuid,
	"requested_school_name" text NOT NULL,
	"status" "catalog_import_status" DEFAULT 'pending' NOT NULL,
	"failure_code" text,
	"failure_message" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
	"recommendation_inputs" jsonb NOT NULL,
	"explanation_inputs" jsonb NOT NULL,
	"last_verified_at" timestamp with time zone NOT NULL,
	"validation_status" "university_validation_status" DEFAULT 'draft' NOT NULL,
	"validation_reasons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "university_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"university_id" uuid NOT NULL,
	"source_kind" "university_source_kind" NOT NULL,
	"field_key" text NOT NULL,
	"source_url" text NOT NULL,
	"excerpt" text,
	"last_verified_at" timestamp with time zone NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catalog_import_items" ADD CONSTRAINT "catalog_import_items_import_run_id_catalog_import_runs_id_fk" FOREIGN KEY ("import_run_id") REFERENCES "public"."catalog_import_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_import_items" ADD CONSTRAINT "catalog_import_items_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_import_runs" ADD CONSTRAINT "catalog_import_runs_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "university_sources" ADD CONSTRAINT "university_sources_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_import_items_run_field_url_idx" ON "catalog_import_items" USING btree ("import_run_id","field_key","source_url");--> statement-breakpoint
CREATE INDEX "catalog_import_items_run_id_idx" ON "catalog_import_items" USING btree ("import_run_id");--> statement-breakpoint
CREATE INDEX "catalog_import_runs_status_idx" ON "catalog_import_runs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "universities_validation_status_idx" ON "universities" USING btree ("validation_status");--> statement-breakpoint
CREATE UNIQUE INDEX "universities_admissions_url_idx" ON "universities" USING btree ("official_admissions_url");--> statement-breakpoint
CREATE UNIQUE INDEX "university_sources_university_field_url_idx" ON "university_sources" USING btree ("university_id","field_key","source_url");--> statement-breakpoint
CREATE INDEX "university_sources_university_id_idx" ON "university_sources" USING btree ("university_id");--> statement-breakpoint

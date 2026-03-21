CREATE TYPE "public"."student_budget_flexibility" AS ENUM('low', 'medium', 'high', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."student_english_exam_type" AS ENUM('ielts', 'toefl', 'duolingo', 'none', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."student_preferred_undergraduate_size" AS ENUM('small', 'medium', 'large', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."student_curriculum_strength" AS ENUM('baseline', 'rigorous', 'most_rigorous', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."student_profile_snapshot_kind" AS ENUM('current', 'projected');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_profile_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_profile_id" uuid NOT NULL,
	"snapshot_kind" "student_profile_snapshot_kind" NOT NULL,
	"assumptions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"profile" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"citizenship_country" text NOT NULL,
	"target_entry_term" text NOT NULL,
	"academic" jsonb DEFAULT '{"currentGpa100":null,"projectedGpa100":null,"curriculumStrength":"unknown","classRankPercent":null}'::jsonb NOT NULL,
	"testing" jsonb DEFAULT '{"satTotal":null,"actComposite":null,"englishExamType":"unknown","englishExamScore":null,"willSubmitTests":null}'::jsonb NOT NULL,
	"preferences" jsonb DEFAULT '{"intendedMajors":[],"preferredStates":[],"preferredCampusLocale":[],"preferredSchoolControl":[],"preferredUndergraduateSize":"unknown"}'::jsonb NOT NULL,
	"budget" jsonb DEFAULT '{"annualBudgetUsd":null,"needsFinancialAid":null,"needsMeritAid":null,"budgetFlexibility":"unknown"}'::jsonb NOT NULL,
	"readiness" jsonb DEFAULT '{"wantsEarlyRound":null,"hasTeacherRecommendationsReady":null,"hasCounselorDocumentsReady":null,"hasEssayDraftsStarted":null}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profile_snapshots" ADD CONSTRAINT "student_profile_snapshots_student_profile_id_student_profiles_id_fk" FOREIGN KEY ("student_profile_id") REFERENCES "public"."student_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_provider_account_idx" ON "accounts" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "student_profile_snapshots_profile_id_idx" ON "student_profile_snapshots" USING btree ("student_profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "student_profile_snapshots_profile_kind_idx" ON "student_profile_snapshots" USING btree ("student_profile_id","snapshot_kind");--> statement-breakpoint
CREATE UNIQUE INDEX "student_profiles_user_id_idx" ON "student_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "verifications_identifier_value_idx" ON "verifications" USING btree ("identifier","value");

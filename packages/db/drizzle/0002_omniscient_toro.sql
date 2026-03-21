CREATE TYPE "public"."recommendation_budget_fit_label" AS ENUM('comfortable', 'stretch', 'high_risk', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."recommendation_confidence_level" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."recommendation_deadline_pressure_label" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."recommendation_outlook_label" AS ENUM('very_strong', 'strong', 'possible', 'stretch', 'unlikely');--> statement-breakpoint
CREATE TYPE "public"."recommendation_run_status" AS ENUM('pending', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."recommendation_tier" AS ENUM('reach', 'target', 'safety');--> statement-breakpoint
CREATE TABLE "recommendation_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recommendation_run_id" uuid NOT NULL,
	"university_id" uuid NOT NULL,
	"tier" "recommendation_tier" NOT NULL,
	"current_outlook" "recommendation_outlook_label" NOT NULL,
	"projected_outlook" "recommendation_outlook_label",
	"confidence_level" "recommendation_confidence_level" NOT NULL,
	"budget_fit" "recommendation_budget_fit_label" NOT NULL,
	"deadline_pressure" "recommendation_deadline_pressure_label" NOT NULL,
	"current_score" integer NOT NULL,
	"projected_score" integer,
	"current_score_breakdown" jsonb NOT NULL,
	"projected_score_breakdown" jsonb,
	"projected_assumption_delta" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rank_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendation_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"student_profile_id" uuid NOT NULL,
	"current_snapshot_id" uuid NOT NULL,
	"projected_snapshot_id" uuid,
	"run_status" "recommendation_run_status" DEFAULT 'pending' NOT NULL,
	"missing_profile_fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"candidate_school_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "recommendation_results" ADD CONSTRAINT "recommendation_results_recommendation_run_id_recommendation_runs_id_fk" FOREIGN KEY ("recommendation_run_id") REFERENCES "public"."recommendation_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_results" ADD CONSTRAINT "recommendation_results_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_runs" ADD CONSTRAINT "recommendation_runs_user_id_student_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."student_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_runs" ADD CONSTRAINT "recommendation_runs_student_profile_id_student_profiles_id_fk" FOREIGN KEY ("student_profile_id") REFERENCES "public"."student_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_runs" ADD CONSTRAINT "recommendation_runs_current_snapshot_id_student_profile_snapshots_id_fk" FOREIGN KEY ("current_snapshot_id") REFERENCES "public"."student_profile_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_runs" ADD CONSTRAINT "recommendation_runs_projected_snapshot_id_student_profile_snapshots_id_fk" FOREIGN KEY ("projected_snapshot_id") REFERENCES "public"."student_profile_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recommendation_results_run_id_idx" ON "recommendation_results" USING btree ("recommendation_run_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recommendation_results_run_rank_idx" ON "recommendation_results" USING btree ("recommendation_run_id","rank_order");--> statement-breakpoint
CREATE UNIQUE INDEX "recommendation_results_run_university_idx" ON "recommendation_results" USING btree ("recommendation_run_id","university_id");--> statement-breakpoint
CREATE INDEX "recommendation_runs_user_id_idx" ON "recommendation_runs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "recommendation_runs_student_profile_id_idx" ON "recommendation_runs" USING btree ("student_profile_id");--> statement-breakpoint
CREATE INDEX "recommendation_runs_created_at_idx" ON "recommendation_runs" USING btree ("created_at");
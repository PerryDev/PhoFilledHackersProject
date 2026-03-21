CREATE TABLE "recommendation_explanations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recommendation_shortlist_id" uuid NOT NULL,
	"recommendation_result_id" uuid NOT NULL,
	"why_recommended" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"top_blockers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"next_recommended_actions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"budget_summary" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"assumption_changes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"explanation_confidence" "recommendation_confidence_level" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendation_shortlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recommendation_run_id" uuid NOT NULL,
	"model" text NOT NULL,
	"prompt_version" text NOT NULL,
	"system_prompt" text NOT NULL,
	"shortlisted_recommendation_result_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"shortlist_rationale" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recommendation_explanations" ADD CONSTRAINT "recommendation_explanations_recommendation_shortlist_id_recommendation_shortlists_id_fk" FOREIGN KEY ("recommendation_shortlist_id") REFERENCES "public"."recommendation_shortlists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_explanations" ADD CONSTRAINT "recommendation_explanations_recommendation_result_id_recommendation_results_id_fk" FOREIGN KEY ("recommendation_result_id") REFERENCES "public"."recommendation_results"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_shortlists" ADD CONSTRAINT "recommendation_shortlists_recommendation_run_id_recommendation_runs_id_fk" FOREIGN KEY ("recommendation_run_id") REFERENCES "public"."recommendation_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recommendation_explanations_shortlist_id_idx" ON "recommendation_explanations" USING btree ("recommendation_shortlist_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recommendation_explanations_result_id_idx" ON "recommendation_explanations" USING btree ("recommendation_result_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recommendation_shortlists_run_id_idx" ON "recommendation_shortlists" USING btree ("recommendation_run_id");
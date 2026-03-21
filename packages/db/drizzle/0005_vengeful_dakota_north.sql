CREATE TABLE "student_intake_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"current_step_index" integer DEFAULT 0 NOT NULL,
	"conversation_done" boolean DEFAULT false NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "student_intake_sessions" ADD CONSTRAINT "student_intake_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "student_intake_sessions_user_id_idx" ON "student_intake_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "student_intake_sessions_updated_at_idx" ON "student_intake_sessions" USING btree ("updated_at");
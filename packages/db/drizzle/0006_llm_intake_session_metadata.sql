-- packages/db/drizzle/0006_llm_intake_session_metadata.sql
-- Add LLM intake metadata to the canonical student intake session table.
-- Keeps the transcript rows intact while storing multi-turn Responses API state.

ALTER TABLE "student_intake_sessions"
	ADD COLUMN "previous_response_id" text,
	ADD COLUMN "field_statuses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	ADD COLUMN "outstanding_fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	ADD COLUMN "progress_completed_count" integer DEFAULT 0 NOT NULL,
	ADD COLUMN "progress_total_count" integer DEFAULT 0 NOT NULL;

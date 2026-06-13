CREATE TABLE IF NOT EXISTS "notifications" (
  "id" text PRIMARY KEY NOT NULL,
  "booking_id" text NOT NULL,
  "user_id" text NOT NULL,
  "room_id" text NOT NULL,
  "status" text NOT NULL,
  "message" text NOT NULL,
  "source_event_id" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "notifications_source_event_id_unique" UNIQUE("source_event_id")
);
--> statement-breakpoint

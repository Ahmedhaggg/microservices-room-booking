CREATE TABLE IF NOT EXISTS "booking_users" (
  "user_id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "display_name" text NOT NULL,
  "source_event_id" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "booking_users_source_event_id_unique" UNIQUE("source_event_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "room_id" text NOT NULL,
  "starts_at" timestamp with time zone NOT NULL,
  "ends_at" timestamp with time zone NOT NULL,
  "status" text NOT NULL,
  "rejection_reason" text,
  "requested_event_id" text NOT NULL,
  "room_decision_event_id" text,
  "final_event_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "bookings_requested_event_id_unique" UNIQUE("requested_event_id"),
  CONSTRAINT "bookings_final_event_id_unique" UNIQUE("final_event_id")
);
--> statement-breakpoint

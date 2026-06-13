CREATE TABLE IF NOT EXISTS "rooms" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "rooms_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room_reservation_decisions" (
  "booking_id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "room_id" text NOT NULL,
  "starts_at" timestamp with time zone NOT NULL,
  "ends_at" timestamp with time zone NOT NULL,
  "status" text NOT NULL,
  "rejection_reason" text,
  "source_event_id" text NOT NULL,
  "published_event_id" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "room_reservation_decisions_source_event_id_unique" UNIQUE("source_event_id"),
  CONSTRAINT "room_reservation_decisions_published_event_id_unique" UNIQUE("published_event_id")
);
--> statement-breakpoint

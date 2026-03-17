CREATE TABLE IF NOT EXISTS "booking_service_metadata" (
  "id" serial PRIMARY KEY NOT NULL,
  "service_name" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "booking_service_metadata_service_name_unique" UNIQUE("service_name")
);
--> statement-breakpoint

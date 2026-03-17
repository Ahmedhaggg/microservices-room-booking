CREATE TABLE IF NOT EXISTS "auth_service_metadata" (
  "id" serial PRIMARY KEY NOT NULL,
  "service_name" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "auth_service_metadata_service_name_unique" UNIQUE("service_name")
);
--> statement-breakpoint

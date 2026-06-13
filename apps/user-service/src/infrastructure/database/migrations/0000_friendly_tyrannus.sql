CREATE TYPE "public"."role" AS ENUM('CUSTOMER', 'EMPLOYEE', 'MANAGER');--> statement-breakpoint
CREATE TABLE "user_service_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_service_metadata_service_name_unique" UNIQUE("service_name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"password" text NOT NULL,
	"roles" "role" DEFAULT 'CUSTOMER' NOT NULL,
	"registered_event_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_registered_event_id_unique" UNIQUE("registered_event_id")
);

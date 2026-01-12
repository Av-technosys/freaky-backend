ALTER TYPE "public"."payment_status" ADD VALUE 'PARTIAL';--> statement-breakpoint
ALTER TABLE "booking" ALTER COLUMN "contact_number" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "booking_draft" ALTER COLUMN "contact_number" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "booking_item" ALTER COLUMN "contact_number" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "contact_number" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_address" ALTER COLUMN "reciver_number" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "number" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "vendor_ownership" ALTER COLUMN "ssn_number" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "vendor" ALTER COLUMN "ein_number" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "vendor" ALTER COLUMN "primary_phone_number" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "vendor" ALTER COLUMN "bank_account_number" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "vendor" ALTER COLUMN "routing_number" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "vendor_id" integer;--> statement-breakpoint
ALTER TABLE "booking_item" ADD COLUMN "product_name" varchar(255);--> statement-breakpoint
ALTER TABLE "booking_item" ADD COLUMN "product_image" varchar(255);--> statement-breakpoint
ALTER TABLE "booking_item" ADD COLUMN "product_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "user_address" ADD COLUMN "is_default" boolean DEFAULT true;

--> Location change hard coded migration
ALTER TABLE "user_address" ADD COLUMN "location" GEOGRAPHY(Point, 4326);
ALTER TABLE "event" ADD COLUMN "location" GEOGRAPHY(Point, 4326);
ALTER TABLE "booking" ADD COLUMN "location" GEOGRAPHY(Point, 4326);
ALTER TABLE "booking_item" ADD COLUMN "location" GEOGRAPHY(Point, 4326);
ALTER TABLE "product" ADD COLUMN "location" GEOGRAPHY(Point, 4326);
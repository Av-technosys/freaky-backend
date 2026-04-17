ALTER TABLE "product" DROP CONSTRAINT "product_current_price_book_price_book_id_fk";
--> statement-breakpoint
ALTER TABLE "booking_item" ALTER COLUMN "vendor_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "street_address_line_1" varchar(255);--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "street_address_line_2" varchar(255);--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "city" varchar(255);--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "state" varchar(255);--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "country" varchar(255);--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "postal_code" varchar(255);--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "max_booking_at_time" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "return_policy_url" varchar(255);--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "current_price_book";
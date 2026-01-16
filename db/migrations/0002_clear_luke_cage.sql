ALTER TABLE "booking_item" DROP CONSTRAINT "booking_item_product_id_product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_product_id_product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "product_review_summary" DROP CONSTRAINT "product_review_summary_product_id_product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "review_media" DROP CONSTRAINT "review_media_review_id_review_review_id_fk";
--> statement-breakpoint
ALTER TABLE "user_address" DROP CONSTRAINT "user_address_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_notification" DROP CONSTRAINT "user_notification_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "vendor_media" DROP CONSTRAINT "vendor_media_vendor_id_vendor_id_fk";
--> statement-breakpoint
ALTER TABLE "booking_item" ADD COLUMN "vendor_id" integer;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_review_summary" ADD CONSTRAINT "product_review_summary_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_media" ADD CONSTRAINT "review_media_review_id_review_review_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."review"("review_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_media" ADD CONSTRAINT "vendor_media_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE cascade ON UPDATE no action;
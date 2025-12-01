ALTER TABLE "event_product_type" RENAME COLUMN "product_id" TO "product_type_id";--> statement-breakpoint
ALTER TABLE "event_product_type" DROP CONSTRAINT "event_product_type_product_id_product_types_id_fk";
--> statement-breakpoint
ALTER TABLE "event_product_type" ADD CONSTRAINT "event_product_type_product_type_id_product_types_id_fk" FOREIGN KEY ("product_type_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;
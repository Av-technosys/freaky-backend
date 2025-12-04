ALTER TABLE "event_item" RENAME COLUMN "event_type_id" TO "event_id";--> statement-breakpoint
ALTER TABLE "event_item" DROP CONSTRAINT "event_item_event_type_id_event_event_id_fk";
--> statement-breakpoint
ALTER TABLE "event_item" DROP CONSTRAINT "event_item_product_id_product_types_id_fk";
--> statement-breakpoint
ALTER TABLE "event_item" ADD CONSTRAINT "event_item_event_id_event_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("event_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_item" ADD CONSTRAINT "event_item_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;
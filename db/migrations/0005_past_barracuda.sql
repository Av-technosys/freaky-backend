CREATE TABLE "event_item" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_type_id" integer,
	"product_id" integer,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "featured_event" DROP CONSTRAINT "featured_event_event_id_event_event_id_fk";
--> statement-breakpoint
ALTER TABLE "event_item" ADD CONSTRAINT "event_item_event_type_id_event_event_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_item" ADD CONSTRAINT "event_item_product_id_product_types_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_event" ADD CONSTRAINT "featured_event_event_id_event_type_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_type"("id") ON DELETE no action ON UPDATE no action;
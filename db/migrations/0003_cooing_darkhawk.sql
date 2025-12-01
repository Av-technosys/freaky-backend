CREATE TABLE "event_product_type" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_product_type_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_type_id" integer,
	"product_id" integer
);
--> statement-breakpoint
ALTER TABLE "pricing_setting" ALTER COLUMN "effective_from" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "pricing_setting" ALTER COLUMN "effective_from" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "event_product_type" ADD CONSTRAINT "event_product_type_event_type_id_event_type_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_product_type" ADD CONSTRAINT "event_product_type_product_id_product_types_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;
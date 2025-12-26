CREATE TABLE "product_review_summary" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_review_summary_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer,
	"review_count" integer DEFAULT 0,
	"rating1" integer DEFAULT 0,
	"rating2" integer DEFAULT 0,
	"rating3" integer DEFAULT 0,
	"rating4" integer DEFAULT 0,
	"rating5" integer DEFAULT 0,
	"average_rating" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "product_review_summary" ADD CONSTRAINT "product_review_summary_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;
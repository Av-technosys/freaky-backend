ALTER TABLE "event_product_order" ADD COLUMN "start_date" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "event_product_order" ADD COLUMN "end_date" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "event_product_order" ADD COLUMN "color" varchar(52) DEFAULT 'orange';
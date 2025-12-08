CREATE TABLE "cart_booking" (
	"cart_booking_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cart_booking_cart_booking_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cart_item_booking" (
	"cart_item_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cart_item_booking_cart_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cart_booking_id" integer,
	"product_id" integer,
	"name" varchar(255) NOT NULL,
	"description" varchar,
	"contact_number" varchar(255),
	"date" timestamp DEFAULT now(),
	"min_guest_count" integer DEFAULT 1,
	"max_guest_count" integer DEFAULT 1,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"booking_status" "booking_status" DEFAULT 'created',
	"payment_status" "payment_status" DEFAULT 'pending',
	"quantity" integer NOT NULL,
	"added_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "featured_banner" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "featured_banner_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"media_url" varchar(255),
	"alt_text" varchar(255),
	"priority" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_transaction" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payment_transaction_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"transaction_id" varchar(255),
	"payment_id" integer,
	"payment_method" varchar(255),
	"transaction_status" varchar(255),
	"payment_status" varchar(50) NOT NULL,
	"payment_type" varchar(50),
	"payment_meta" jsonb,
	"remarks" varchar(255),
	"reference_number" varchar(255),
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"transaction_time" timestamp DEFAULT now() NOT NULL,
	"error_code" varchar(100),
	"failure_reason" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"payment_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payment_payment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"cart_booking_id" integer,
	"order_booking_id" integer,
	"total_amount" numeric(10, 2),
	"paid_amount" numeric(10, 2),
	"remaining_amount" numeric(10, 2),
	"payment_status" "payment_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "event_order_transaction" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "event_order_transaction" CASCADE;--> statement-breakpoint
ALTER TABLE "event_booking" DROP CONSTRAINT "event_booking_event_id_event_event_id_fk";
--> statement-breakpoint
ALTER TABLE "event_product_order" DROP CONSTRAINT "event_product_order_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "event_product_order" DROP CONSTRAINT "event_product_order_product_id_product_types_id_fk";
--> statement-breakpoint
ALTER TABLE "event_product_order" DROP CONSTRAINT "event_product_order_vendor_id_vendor_id_fk";
--> statement-breakpoint
ALTER TABLE "featured_event" DROP CONSTRAINT "featured_event_event_id_event_type_id_fk";
--> statement-breakpoint
ALTER TABLE "event_booking" ALTER COLUMN "booking_status" SET DEFAULT 'created'::"public"."booking_status";--> statement-breakpoint
ALTER TABLE "event_booking" ALTER COLUMN "booking_status" SET DATA TYPE "public"."booking_status" USING "booking_status"::"public"."booking_status";--> statement-breakpoint
ALTER TABLE "cart_item" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_item" ADD COLUMN "description" varchar;--> statement-breakpoint
ALTER TABLE "cart_item" ADD COLUMN "contact_number" varchar(255);--> statement-breakpoint
ALTER TABLE "cart_item" ADD COLUMN "date" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "cart_item" ADD COLUMN "min_guest_count" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "cart_item" ADD COLUMN "max_guest_count" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "cart_item" ADD COLUMN "latitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "cart_item" ADD COLUMN "longitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "event_booking" ADD COLUMN "event_type_id" integer;--> statement-breakpoint
ALTER TABLE "event_booking" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "event_booking" ADD COLUMN "description" varchar;--> statement-breakpoint
ALTER TABLE "event_booking" ADD COLUMN "contact_number" varchar(255);--> statement-breakpoint
ALTER TABLE "event_booking" ADD COLUMN "event_date" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "event_booking" ADD COLUMN "min_guest_count" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "event_booking" ADD COLUMN "max_guest_count" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "event_booking" ADD COLUMN "latitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "event_booking" ADD COLUMN "longitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "event_booking" ADD COLUMN "payment_status" "payment_status" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "featured_event" ADD COLUMN "event_type_id" integer;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "rating" integer DEFAULT 4 NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "banner_image" varchar(255);--> statement-breakpoint
ALTER TABLE "cart_booking" ADD CONSTRAINT "cart_booking_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item_booking" ADD CONSTRAINT "cart_item_booking_cart_booking_id_cart_booking_cart_booking_id_fk" FOREIGN KEY ("cart_booking_id") REFERENCES "public"."cart_booking"("cart_booking_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item_booking" ADD CONSTRAINT "cart_item_booking_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transaction" ADD CONSTRAINT "payment_transaction_payment_id_payment_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("payment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_cart_booking_id_cart_booking_cart_booking_id_fk" FOREIGN KEY ("cart_booking_id") REFERENCES "public"."cart_booking"("cart_booking_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_booking_id_event_booking_id_fk" FOREIGN KEY ("order_booking_id") REFERENCES "public"."event_booking"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_booking" ADD CONSTRAINT "event_booking_event_type_id_event_type_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_product_order" ADD CONSTRAINT "event_product_order_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_event" ADD CONSTRAINT "featured_event_event_type_id_event_type_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_item" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "cart_item" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "event_booking" DROP COLUMN "event_id";--> statement-breakpoint
ALTER TABLE "event_product_order" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "event_product_order" DROP COLUMN "vendor_id";--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN "booking_status";--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN "payment_status";--> statement-breakpoint
ALTER TABLE "featured_event" DROP COLUMN "event_id";


-- Manual changes
-- ------------------------------------

ALTER TABLE "cart_item_booking"
ADD COLUMN "location" GEOGRAPHY(Point, 4326);

ALTER TABLE "cart_item"
ADD COLUMN "location" GEOGRAPHY(Point, 4326);

ALTER TABLE "event_booking"
ADD COLUMN "location" GEOGRAPHY(Point, 4326);


-- Add spatial indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendor_location
ON "cart_item_booking"
USING GIST ("location");

CREATE INDEX IF NOT EXISTS idx_user_location
ON "cart_item"
USING GIST ("location");

CREATE INDEX IF NOT EXISTS idx_event_location
ON "event_booking"
USING GIST ("location");
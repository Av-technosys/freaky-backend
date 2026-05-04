CREATE TYPE "public"."application_contract_reference_type" AS ENUM('VENDOR', 'PRODUCT_TYPE');--> statement-breakpoint
ALTER TYPE "public"."payment_status" ADD VALUE 'CREATED';--> statement-breakpoint
ALTER TYPE "public"."payment_status" ADD VALUE 'AUTHORIZED';--> statement-breakpoint
ALTER TYPE "public"."payment_status" ADD VALUE 'CAPTURED';--> statement-breakpoint
CREATE TABLE "application_contract" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "application_contract_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"reference" "application_contract_reference_type" NOT NULL,
	"product_type_id" integer,
	"vendor_id" integer,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp DEFAULT now(),
	"admin_commission_percentage" numeric(10, 2),
	"platform_fees" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_vendor" (
	"payment_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payment_vendor_payment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"booking_item_id" integer NOT NULL,
	"vendor_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_status" "payment_status" DEFAULT 'PENDING',
	"currency" varchar(10) DEFAULT 'INR',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "contract_product_type" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_pending_tracker" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tax_zone" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "vendor_contract" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "contract_product_type" CASCADE;--> statement-breakpoint
DROP TABLE "payment_pending_tracker" CASCADE;--> statement-breakpoint
DROP TABLE "tax_zone" CASCADE;--> statement-breakpoint
DROP TABLE "vendor_contract" CASCADE;--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "currency" SET DEFAULT 'INR';--> statement-breakpoint
ALTER TABLE "application_contract" ADD CONSTRAINT "application_contract_product_type_id_product_types_id_fk" FOREIGN KEY ("product_type_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_contract" ADD CONSTRAINT "application_contract_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_vendor" ADD CONSTRAINT "payment_vendor_booking_item_id_booking_item_id_fk" FOREIGN KEY ("booking_item_id") REFERENCES "public"."booking_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_vendor" ADD CONSTRAINT "payment_vendor_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;
CREATE TYPE "public"."media_type_enum" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TABLE "featured_category_product" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "featured_category_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"description" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "featured_products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "featured_products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer,
	"featured_category_id" integer,
	"priority" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"vendor_id" integer,
	"title" varchar(255),
	"message" varchar(255),
	"status" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendor_document" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendor_document_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendor_id" integer,
	"document_type" varchar(255),
	"document_url" varchar(255),
	"description" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendor_employee_request" (
	"vendor_employee_request_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendor_employee_request_vendor_employee_request_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendor_id" integer,
	"user_id" integer,
	"status" boolean DEFAULT false NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendor_invite" (
	"vendor_invite_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendor_invite_vendor_invite_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendor_id" integer,
	"email" varchar(255),
	"token" varchar(255),
	"invite_code" varchar(255),
	"status" varchar(255),
	"permissions" text[],
	"employee_code" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendor_media" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendor_media_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendor_id" integer,
	"media_type" "media_type_enum" NOT NULL,
	"media_url" varchar(255),
	"alt_text" varchar(255),
	"sort_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendor_ownership" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendor_ownership_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendor_id" integer,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"ssn_number" integer,
	"street_address_line1" varchar(255),
	"street_address_line2" varchar(255),
	"zipcode" varchar(20),
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100),
	"is_authorized_signatory" boolean DEFAULT false,
	"ownership_percentage" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_event_product_order_id_event_product_orders_order_id_fk";
--> statement-breakpoint
ALTER TABLE "product_media" ALTER COLUMN "media_type" SET DATA TYPE "public"."media_type_enum" USING "media_type"::text::"public"."media_type_enum";--> statement-breakpoint
ALTER TABLE "review_media" ALTER COLUMN "media_type" SET DATA TYPE "public"."media_type_enum" USING "media_type"::text::"public"."media_type_enum";--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_contacts" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_contacts" ALTER COLUMN "is_active" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_addresses" ADD COLUMN "reciver_name" varchar(255);--> statement-breakpoint
ALTER TABLE "user_addresses" ADD COLUMN "reciver_number" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cognito_sub" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_image" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "number" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "total_expiration_time" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_address_id" integer;--> statement-breakpoint
ALTER TABLE "vendor_contacts" ADD COLUMN "vendor_contact_id" integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY (sequence name "vendor_contacts_vendor_contact_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "vendor_contacts" ADD COLUMN "permissions" text[];--> statement-breakpoint
ALTER TABLE "vendor_contacts" ADD COLUMN "bio" varchar;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "website_url" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "dba_name" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "legal_entity_name" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "ein_number" integer;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "business_type" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "incorporation_date" timestamp;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "street_address_line1" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "street_address_line2" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "zipcode" varchar(20);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "created_by" integer;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "primary_contact_name" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "primary_contact_email" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "primary_phone_number" varchar(50);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "youtube_url" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "facebook_url" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "linkedin_url" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "instagram_url" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "bank_name" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "bank_account_number" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "payee_name" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "bank_type" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "routing_number" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "authorized_signatory_name" varchar(255);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "status" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "is_admin_approved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "featured_products" ADD CONSTRAINT "featured_products_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_products" ADD CONSTRAINT "featured_products_featured_category_id_featured_category_product_id_fk" FOREIGN KEY ("featured_category_id") REFERENCES "public"."featured_category_product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_document" ADD CONSTRAINT "vendor_document_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_employee_request" ADD CONSTRAINT "vendor_employee_request_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_employee_request" ADD CONSTRAINT "vendor_employee_request_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_invite" ADD CONSTRAINT "vendor_invite_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_media" ADD CONSTRAINT "vendor_media_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_ownership" ADD CONSTRAINT "vendor_ownership_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_event_product_order_id_event_product_orders_order_id_fk" FOREIGN KEY ("event_product_order_id") REFERENCES "public"."event_product_orders"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_current_address_id_user_addresses_id_fk" FOREIGN KEY ("current_address_id") REFERENCES "public"."user_addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_contacts" DROP COLUMN "employee_id";--> statement-breakpoint
ALTER TABLE "vendor_contacts" DROP COLUMN "portal_role";--> statement-breakpoint
ALTER TABLE "vendor_contacts" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN "contact_number";--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN "website";--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN "address_line1";--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN "address_line2";--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN "postal_code";--> statement-breakpoint
ALTER TABLE "vendor_contacts" ADD CONSTRAINT "vendor_contacts_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
DROP TYPE "public"."product_media_type_enum";--> statement-breakpoint
DROP TYPE "public"."review_media_type";
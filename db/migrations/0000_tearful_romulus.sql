CREATE TYPE "public"."source" AS ENUM('CART', 'EVENT', 'EXTERNAL');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('HOLD', 'EXPIRED', 'CANCLED', 'CONFIRMED', 'COMPLETED', 'IN_PROGRESS', 'BOOKED');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('BOOKED', 'WILL_START', 'ONGOING', 'COMPLETED', 'CANCLED');--> statement-breakpoint
CREATE TYPE "public"."media_type_enum" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."tracker_status" AS ENUM('ACTIVE', 'PAID', 'STOPPED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('FULL', 'PARTIAL', 'REFUND');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('ANDROID', 'IOS', 'WEB');--> statement-breakpoint
CREATE TYPE "public"."pricing_type_enum" AS ENUM('FLAT', 'PERCENTAGE', 'TIRE', 'MODULAR');--> statement-breakpoint
CREATE TYPE "public"."product_type_enum" AS ENUM('PRODUCT', 'ADDON');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('ACTIVE', 'EXPIRED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."vendor_status" AS ENUM('SCRAPED', 'PENDING_VENDOR', 'PENDING_ADMIN', 'APPROVED', 'REJECTED', 'SUSPENDED');--> statement-breakpoint
CREATE TABLE "booking" (
	"booking_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "booking_booking_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"event_type_id" integer,
	"source" "source" NOT NULL,
	"contact_name" varchar(255),
	"contact_number" integer,
	"description" varchar,
	"start_time" timestamp DEFAULT now(),
	"end_time" timestamp DEFAULT now(),
	"min_guest_count" integer DEFAULT 1,
	"max_guest_count" integer DEFAULT 1,
	"latitude" varchar(255),
	"longitude" varchar(255),
	"booking_status" "status" DEFAULT 'HOLD',
	"payment_status" "payment_status" DEFAULT 'PENDING',
	"total_amount" numeric(10, 2),
	"admin_commission_percentage" numeric(10, 2),
	"platform_fees" numeric(10, 2),
	"booked_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "booking_draft" (
	"booking_draft_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "booking_draft_booking_draft_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"source" "source" NOT NULL,
	"source_id" integer,
	"product_id" integer,
	"status" "status" NOT NULL,
	"expired_at" timestamp DEFAULT now(),
	"contact_name" varchar(255),
	"contact_number" integer,
	"start_time" timestamp DEFAULT now(),
	"end_time" timestamp DEFAULT now(),
	"min_guest_count" integer DEFAULT 1,
	"max_guest_count" integer DEFAULT 1,
	"latitude" varchar(255),
	"longitude" varchar(255),
	"booking_status" "status" DEFAULT 'HOLD',
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "booking_item" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "booking_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"booking_id" integer,
	"product_id" integer NOT NULL,
	"contact_name" varchar(255),
	"contact_number" integer,
	"start_time" timestamp DEFAULT now(),
	"end_time" timestamp DEFAULT now(),
	"min_guest_count" integer DEFAULT 1,
	"max_guest_count" integer DEFAULT 1,
	"latitude" varchar(255),
	"longitude" varchar(255),
	"booking_status" "status" DEFAULT 'HOLD',
	"payment_status" "payment_status" DEFAULT 'PENDING',
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"cart_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cart_cart_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contract_product_type" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contract_product_type_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
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
CREATE TABLE "event_product_type" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_product_type_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_type_id" integer,
	"product_type_id" integer
);
--> statement-breakpoint
CREATE TABLE "event_type" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_type_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"image" varchar,
	"description" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event" (
	"event_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"event_type_id" integer,
	"contact_name" varchar(255),
	"contact_number" varchar(255),
	"description" varchar,
	"start_time" timestamp DEFAULT now(),
	"end_time" timestamp DEFAULT now(),
	"min_guest_count" integer DEFAULT 1,
	"max_guest_count" integer DEFAULT 1,
	"latitude" varchar(255),
	"longitude" varchar(255),
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
CREATE TABLE "featured_category" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "featured_category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"description" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "featured_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "featured_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"description" varchar,
	"media_url" varchar(255),
	"alt_text" varchar(255),
	"priority" integer DEFAULT 0,
	"event_type_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "featured_product" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "featured_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer,
	"featured_category_id" integer,
	"priority" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"payment_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payment_payment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"booking_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"provider" varchar(50),
	"provider_payment_id" varchar(255),
	"provider_order_id" varchar(255),
	"payment_type" "payment_type" NOT NULL,
	"payment_meta" jsonb,
	"remarks" varchar(255),
	"payment_status" "payment_status" DEFAULT 'PENDING',
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'USD',
	"initiated_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"metadata" jsonb,
	"error_code" varchar(100),
	"failure_reason" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_pending_tracker" (
	"tracker_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payment_pending_tracker_tracker_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"booking_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"pending_amount" numeric(10, 2) NOT NULL,
	"tracker_status" "tracker_status" DEFAULT 'ACTIVE',
	"next_reminder_at" timestamp,
	"last_reminder_at" timestamp,
	"reminder_count" integer DEFAULT 0,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_book" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "price_book_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendor_id" integer,
	"is_standard" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"name" varchar(255),
	"description" varchar,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_book_entry" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "price_book_entry_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer,
	"price_booking_id" integer,
	"currency" varchar(255),
	"lower_slab" integer,
	"upper_slab" integer,
	"list_price" numeric(10, 2),
	"discount_percentage" numeric(10, 2),
	"sale_price" numeric(10, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pricing_setting" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pricing_setting_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"fee_percentage" numeric(10, 2),
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"effective_from" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_addon" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_addon_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"main_product_id" integer,
	"addon_product_id" integer
);
--> statement-breakpoint
CREATE TABLE "product_media" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_media_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer,
	"media_type" "media_type_enum" NOT NULL,
	"media_url" varchar(255),
	"alt_text" varchar(255),
	"sort_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
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
CREATE TABLE "product_types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_parent_id" integer,
	"name" varchar(255),
	"description" varchar(255),
	"media_url" varchar(255),
	"alt_text" varchar(255),
	"is_new_product_approval" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product" (
	"product_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" "product_type_enum" DEFAULT 'PRODUCT' NOT NULL,
	"vendor_id" integer,
	"product_type_id" integer,
	"title" varchar(255),
	"description" varchar,
	"latitude" varchar(255),
	"longitude" varchar(255),
	"delivery_radius" integer DEFAULT 10,
	"is_available" boolean DEFAULT true,
	"current_price_book" integer,
	"pricing_type" "pricing_type_enum" NOT NULL,
	"min_quantity" integer DEFAULT 1 NOT NULL,
	"max_quantity" integer,
	"status" boolean DEFAULT true NOT NULL,
	"rating" integer DEFAULT 4 NOT NULL,
	"banner_image" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "review_media" (
	"review_media_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "review_media_review_media_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"review_id" integer,
	"media_url" varchar(255),
	"media_type" "media_type_enum" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "review" (
	"review_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "review_review_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer,
	"user_id" integer NOT NULL,
	"event_id" integer,
	"vendor_id" integer,
	"rating" integer NOT NULL,
	"title" varchar(255),
	"description" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subscription_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"plan_name" varchar(255) NOT NULL,
	"discount_percentage" numeric(5, 2),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" "subscription_status" DEFAULT 'ACTIVE' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tax_zone" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tax_zone_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"postal_code" varchar(255),
	"tax_percentage" numeric(10, 2),
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_address" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_address_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"title" varchar(255),
	"address_line_one" varchar(255),
	"address_line_two" varchar(255),
	"reciver_name" varchar(255),
	"reciver_number" varchar(255),
	"city" varchar(255),
	"state" varchar(255),
	"postal_code" varchar(255),
	"country" varchar(255),
	"latitude" varchar(255),
	"longitude" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_notification" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_notification_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"vendor_id" integer,
	"title" varchar(255),
	"message" varchar(255),
	"status" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_type" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_type_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "user" (
	"user_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_type_id" integer,
	"parse_id" varchar(255),
	"cognito_sub" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"profile_image" varchar(255),
	"number" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"logged_in" boolean,
	"firebase_token" varchar(255),
	"platform" "platform",
	"token_facebook" varchar(255),
	"token_twitter" varchar(255),
	"user_token" varchar(255),
	"status" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"total_expiration_time" timestamp DEFAULT now(),
	"current_address_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendor_contract" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendor_contract_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendor_id" integer,
	"contract_type" varchar(255),
	"admin_commission_percentage" numeric(5, 2),
	"platform_fees" numeric(10, 2),
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp DEFAULT now(),
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
CREATE TABLE "vendor_employee" (
	"vendor_employee_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendor_employee_vendor_employee_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"vendor_id" integer,
	"permissions" text[],
	"department" varchar(100),
	"employee_code" varchar(100),
	"is_active" boolean DEFAULT false NOT NULL,
	"bio" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "vendor_employee_user_id_unique" UNIQUE("user_id")
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
CREATE TABLE "vendor_notification" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendor_notification_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendor_id" integer,
	"user_id" integer,
	"title" varchar(255),
	"message" varchar(255),
	"status" boolean DEFAULT false NOT NULL,
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
	"is_authorized_signature" boolean DEFAULT false,
	"ownership_percentage" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendor" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendor_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"business_name" varchar(255),
	"website_url" varchar(255),
	"logo_url" varchar(500),
	"description" varchar,
	"dba_name" varchar(255),
	"legal_entity_name" varchar(255),
	"ein_number" integer,
	"business_type" varchar(255),
	"incorporation_date" timestamp,
	"street_address_line1" varchar(255),
	"street_address_line2" varchar(255),
	"zipcode" varchar(20),
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100),
	"latitude" varchar(255),
	"longitude" varchar(255),
	"created_by" integer,
	"primary_contact_name" varchar(255),
	"primary_contact_email" varchar(255),
	"primary_phone_number" varchar(50),
	"youtube_url" varchar(255),
	"facebook_url" varchar(255),
	"linkedin_url" varchar(255),
	"instagram_url" varchar(255),
	"bank_name" varchar(255),
	"bank_account_number" varchar(255),
	"payee_name" varchar(255),
	"bank_type" varchar(255),
	"routing_number" varchar(255),
	"authorized_signatory" integer,
	"status" "vendor_status" DEFAULT 'PENDING_ADMIN' NOT NULL,
	"is_admin_approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_event_type_id_event_type_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_draft" ADD CONSTRAINT "booking_draft_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_item" ADD CONSTRAINT "booking_item_booking_id_booking_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("booking_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_item" ADD CONSTRAINT "booking_item_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_product_type" ADD CONSTRAINT "contract_product_type_product_type_id_product_types_id_fk" FOREIGN KEY ("product_type_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_product_type" ADD CONSTRAINT "contract_product_type_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_product_type" ADD CONSTRAINT "event_product_type_event_type_id_event_type_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_product_type" ADD CONSTRAINT "event_product_type_product_type_id_product_types_id_fk" FOREIGN KEY ("product_type_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_event_type_id_event_type_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_event" ADD CONSTRAINT "featured_event_event_type_id_event_type_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_product" ADD CONSTRAINT "featured_product_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_product" ADD CONSTRAINT "featured_product_featured_category_id_featured_category_id_fk" FOREIGN KEY ("featured_category_id") REFERENCES "public"."featured_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_booking_id_booking_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("booking_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_pending_tracker" ADD CONSTRAINT "payment_pending_tracker_booking_id_booking_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("booking_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_pending_tracker" ADD CONSTRAINT "payment_pending_tracker_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_book" ADD CONSTRAINT "price_book_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_book_entry" ADD CONSTRAINT "price_book_entry_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_book_entry" ADD CONSTRAINT "price_book_entry_price_booking_id_price_book_id_fk" FOREIGN KEY ("price_booking_id") REFERENCES "public"."price_book"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_addon" ADD CONSTRAINT "product_addon_main_product_id_product_product_id_fk" FOREIGN KEY ("main_product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_addon" ADD CONSTRAINT "product_addon_addon_product_id_product_product_id_fk" FOREIGN KEY ("addon_product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_review_summary" ADD CONSTRAINT "product_review_summary_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_types" ADD CONSTRAINT "product_types_product_parent_id_product_types_id_fk" FOREIGN KEY ("product_parent_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_product_type_id_product_types_id_fk" FOREIGN KEY ("product_type_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_current_price_book_price_book_id_fk" FOREIGN KEY ("current_price_book") REFERENCES "public"."price_book"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_media" ADD CONSTRAINT "review_media_review_id_review_review_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."review"("review_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_event_id_event_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_user_type_id_user_type_id_fk" FOREIGN KEY ("user_type_id") REFERENCES "public"."user_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_current_address_id_user_address_id_fk" FOREIGN KEY ("current_address_id") REFERENCES "public"."user_address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_contract" ADD CONSTRAINT "vendor_contract_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_document" ADD CONSTRAINT "vendor_document_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_employee_request" ADD CONSTRAINT "vendor_employee_request_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_employee_request" ADD CONSTRAINT "vendor_employee_request_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_employee" ADD CONSTRAINT "vendor_employee_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_employee" ADD CONSTRAINT "vendor_employee_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_invite" ADD CONSTRAINT "vendor_invite_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_media" ADD CONSTRAINT "vendor_media_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_notification" ADD CONSTRAINT "vendor_notification_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_notification" ADD CONSTRAINT "vendor_notification_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_ownership" ADD CONSTRAINT "vendor_ownership_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_created_by_user_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_authorized_signatory_vendor_ownership_id_fk" FOREIGN KEY ("authorized_signatory") REFERENCES "public"."vendor_ownership"("id") ON DELETE no action ON UPDATE no action;
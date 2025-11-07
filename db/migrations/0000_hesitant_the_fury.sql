CREATE TABLE "cart" (
	"cart_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cart_cart_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"cart_item_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cart_items_cart_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cart_id" integer,
	"product_id" integer,
	"quantity" integer NOT NULL,
	"discount_applied" boolean DEFAULT false,
	"added_at" timestamp DEFAULT now(),
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
CREATE TABLE "discount_scheduled" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "discount_scheduled_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer,
	"name" varchar(255),
	"lower_bound" numeric(10, 2),
	"upper_bound" numeric(10, 2),
	"currency" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_booking" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_booking_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer,
	"user_id" integer,
	"total_amount" numeric(10, 2),
	"booking_status" varchar(255),
	"booked_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_order_transactions" (
	"transaction_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_order_transactions_transaction_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_id" integer,
	"transaction_status" varchar(255),
	"payment_method" varchar(255),
	"amount" numeric(10, 2),
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"reference_number" varchar(255),
	"remarks" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_product_orders" (
	"order_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_product_orders_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"booking_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"event_type_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"vendor_id" integer,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price" numeric(10, 2),
	"paid" numeric(10, 2),
	"due" numeric(10, 2),
	"admin_commission_percentage" numeric(10, 2),
	"order_status" varchar(50),
	"ordered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "event_type_product" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_type_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_type_id" integer,
	"product_id" integer
);
--> statement-breakpoint
CREATE TABLE "events" (
	"event_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"event_type_id" integer,
	"title" varchar(255) NOT NULL,
	"description" varchar,
	"event_date" timestamp DEFAULT now(),
	"location" varchar(255),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_booking" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "price_booking_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendor_id" integer,
	"name" varchar(255),
	"status" boolean DEFAULT true NOT NULL,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_booking_entry" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "price_booking_entry_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer,
	"price_booking_id" integer,
	"currency" varchar(255),
	"amount" numeric(10, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pricing_settings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pricing_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"platform_service_fee_percentage" numeric(10, 2),
	"effective_from" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_addons" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_addons_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"main_product_id" integer,
	"addon_product_id" integer
);
--> statement-breakpoint
CREATE TABLE "product_available_area" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_available_area_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer,
	"postal_code" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_media" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_media_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer,
	"media_type" "product_media_type_enum" NOT NULL,
	"media_url" varchar(255),
	"alt_text" varchar(255),
	"sort_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_parent_id" integer,
	"name" varchar(255),
	"description" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "products" (
	"product_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" "product_type_enum" NOT NULL,
	"vendor_id" integer,
	"product_type_id" integer,
	"title" varchar(255),
	"description" varchar,
	"latitude" varchar(255),
	"longitude" varchar(255),
	"is_available" boolean DEFAULT true,
	"current_price_book" integer,
	"is_discount_scheduled" boolean DEFAULT false,
	"pricing_type" "pricing_type_enum" NOT NULL,
	"percentage" numeric(5, 2),
	"min_quantity" integer DEFAULT 1 NOT NULL,
	"max_quantity" integer,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "review_media" (
	"review_media_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "review_media_review_media_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"review_id" integer,
	"media_url" varchar(255),
	"media_type" "review_media_type" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reviews_review_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_product_order_id" integer,
	"user_id" integer,
	"event_id" integer,
	"product_id" integer NOT NULL,
	"vendor_id" integer,
	"rating" integer NOT NULL,
	"title" varchar(255),
	"description" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subscriptions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"plan_name" varchar(255) NOT NULL,
	"discount_percentage" numeric(5, 2),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tax_zones" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tax_zones_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"postal_code" varchar(255),
	"tax_percentage" numeric(10, 2),
	"description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_addresses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_addresses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"title" varchar(255),
	"address_line_one" varchar(255),
	"address_line_two" varchar(255),
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
CREATE TABLE "user_types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_type_id" integer,
	"parse_id" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"logged_in" boolean,
	"token_facebook" varchar(255),
	"token_twitter" varchar(255),
	"user_token" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendor_contacts" (
	"employee_id" varchar(100) PRIMARY KEY NOT NULL,
	"user_id" integer,
	"vendor_id" integer,
	"portal_role" varchar(100),
	"role" varchar(100),
	"department" varchar(100),
	"employee_code" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"business_name" varchar(255) NOT NULL,
	"contact_number" varchar(50),
	"email" varchar(255),
	"website" varchar(255),
	"address_line1" varchar(255),
	"address_line2" varchar(255),
	"city" varchar(100),
	"state" varchar(100),
	"postal_code" varchar(20),
	"country" varchar(100),
	"logo_url" varchar(500),
	"description" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_cart_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("cart_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_product_type" ADD CONSTRAINT "contract_product_type_product_type_id_product_types_id_fk" FOREIGN KEY ("product_type_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_product_type" ADD CONSTRAINT "contract_product_type_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_scheduled" ADD CONSTRAINT "discount_scheduled_product_id_product_types_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_booking" ADD CONSTRAINT "event_booking_event_id_events_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_booking" ADD CONSTRAINT "event_booking_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_order_transactions" ADD CONSTRAINT "event_order_transactions_order_id_event_product_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."event_product_orders"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_product_orders" ADD CONSTRAINT "event_product_orders_booking_id_event_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."event_booking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_product_orders" ADD CONSTRAINT "event_product_orders_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_product_orders" ADD CONSTRAINT "event_product_orders_event_type_id_event_types_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_product_orders" ADD CONSTRAINT "event_product_orders_product_id_product_types_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_product_orders" ADD CONSTRAINT "event_product_orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_type_product" ADD CONSTRAINT "event_type_product_event_type_id_event_types_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_type_product" ADD CONSTRAINT "event_type_product_product_id_product_types_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_event_type_id_event_types_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_booking" ADD CONSTRAINT "price_booking_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_booking_entry" ADD CONSTRAINT "price_booking_entry_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_booking_entry" ADD CONSTRAINT "price_booking_entry_price_booking_id_price_booking_id_fk" FOREIGN KEY ("price_booking_id") REFERENCES "public"."price_booking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_addons" ADD CONSTRAINT "product_addons_main_product_id_products_product_id_fk" FOREIGN KEY ("main_product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_addons" ADD CONSTRAINT "product_addons_addon_product_id_products_product_id_fk" FOREIGN KEY ("addon_product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_available_area" ADD CONSTRAINT "product_available_area_product_id_product_types_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_types" ADD CONSTRAINT "product_types_product_parent_id_product_types_id_fk" FOREIGN KEY ("product_parent_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_product_type_id_product_types_id_fk" FOREIGN KEY ("product_type_id") REFERENCES "public"."product_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_current_price_book_price_booking_id_fk" FOREIGN KEY ("current_price_book") REFERENCES "public"."price_booking"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_media" ADD CONSTRAINT "review_media_review_id_reviews_review_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("review_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_event_product_order_id_event_product_orders_order_id_fk" FOREIGN KEY ("event_product_order_id") REFERENCES "public"."event_product_orders"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_event_id_events_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_type_id_user_types_id_fk" FOREIGN KEY ("user_type_id") REFERENCES "public"."user_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_contacts" ADD CONSTRAINT "vendor_contacts_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_contacts" ADD CONSTRAINT "vendor_contacts_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
CREATE TABLE "vendor_availability" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendor_availability_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendor_id" integer,
	"day_of_week" integer NOT NULL,
	"is_open" boolean DEFAULT true,
	"open_time" varchar NOT NULL,
	"close_time" varchar NOT NULL,
	"timezone" varchar(100) DEFAULT 'Asia/Kolkata' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor_holidays" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendor_holidays_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendor_id" integer,
	"holiday_start_time" timestamp NOT NULL,
	"holiday_end_time" timestamp NOT NULL,
	"reason" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "vendor_availability" ADD CONSTRAINT "vendor_availability_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_holidays" ADD CONSTRAINT "vendor_holidays_vendor_id_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendor"("id") ON DELETE no action ON UPDATE no action;
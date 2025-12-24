-- CREATE TYPE "public"."vendor_status" AS ENUM('scraped', 'pending_vendor', 'pending_admin', 'approved', 'rejected', 'suspended');--> statement-breakpoint
-- ALTER TABLE "vendor" ALTER COLUMN "status" SET DEFAULT 'pending_admin'::"public"."vendor_status";--> statement-breakpoint
-- ALTER TABLE "vendor" ALTER COLUMN "status" SET DATA TYPE "public"."vendor_status" USING "status"::"public"."vendor_status";


DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vendor_status') THEN
    CREATE TYPE "public"."vendor_status" AS ENUM (
      'scraped',
      'pending_vendor',
      'pending_admin',
      'approved',
      'rejected',
      'suspended'
    );
  END IF;
END $$;

ALTER TABLE "vendor"
DROP COLUMN "status";

ALTER TABLE "vendor"
ADD COLUMN "status" "public"."vendor_status"
NOT NULL
DEFAULT 'pending_admin';

CREATE INDEX idx_vendor_status ON vendor(status);

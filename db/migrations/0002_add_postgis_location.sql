-- Add PostGIS Geography columns
ALTER TABLE "event"
ADD COLUMN "location" GEOGRAPHY(Point, 4326);

ALTER TABLE "product"
ADD COLUMN "location" GEOGRAPHY(Point, 4326);

ALTER TABLE "user_address"
ADD COLUMN "location" GEOGRAPHY(Point, 4326);

ALTER TABLE "vendor"
ADD COLUMN "location" GEOGRAPHY(Point, 4326);

-- -- Optional but useful: lat/lng debug columns
-- ALTER TABLE "user_address"
-- ADD COLUMN "lat" double precision,
-- ADD COLUMN "lng" double precision;

-- ALTER TABLE "vendor"
-- ADD COLUMN "lat" double precision,
-- ADD COLUMN "lng" double precision;

-- ALTER TABLE "event"
-- ADD COLUMN "lat" double precision,
-- ADD COLUMN "lng" double precision;

-- ALTER TABLE "product"
-- ADD COLUMN "lat" double precision,
-- ADD COLUMN "lng" double precision;

-- Add spatial indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendor_location
ON "vendor"
USING GIST ("location");

CREATE INDEX IF NOT EXISTS idx_user_location
ON "user_address"
USING GIST ("location");

CREATE INDEX IF NOT EXISTS idx_event_location
ON "event"
USING GIST ("location");

CREATE INDEX IF NOT EXISTS idx_product_location
ON "product"
USING GIST ("location");

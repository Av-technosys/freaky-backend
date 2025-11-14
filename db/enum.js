import { pgEnum } from "drizzle-orm/pg-core";

export const mediaTypeEnum = pgEnum("media_type_enum", ["image", "video"]);

export const productTypeEnum = pgEnum("product_type_enum", [
  "product",
  "addon",
]);

export const productPricingTypeEnum = pgEnum("pricing_type_enum", [
  "flat",
  "percentage",
  "tier",
  "modular",
]);

export const userSubscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "expired",
  "cancelled",
]);
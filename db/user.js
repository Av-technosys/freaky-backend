import {
  pgTable,
  varchar,
  integer,
  boolean,
  timestamp,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { eventProductOrders, events } from "./event.js";
import { products, vendors } from "./vendor.js";

export const userTypes = pgTable("user_types", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  name: varchar("name", { length: 255 }),
});

export const users = pgTable("users", {
  userId: integer("user_id").generatedAlwaysAsIdentity().primaryKey(),
  userTypeId: integer("user_type_id").references(() => userTypes.id), // foreign key
  parseId: varchar("parse_id", { length: 255 }),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImage: varchar("profile_image", { length: 255 }),
  number: varchar("number", { length: 255 }),
  currentAddressId: integer("current_address_id").references(
    () => userAddresses.id
  ),
  // user_socials: varchar("user_socials", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  loggedIn: boolean("logged_in"),
  tokenFacebook: varchar("token_facebook", { length: 255 }),
  tokenTwitter: varchar("token_twitter", { length: 255 }),
  userToken: varchar("user_token", { length: 255 }),
  // otp
  status: boolean("status").default(false).notNull(),
  tokenExpiration: timestamp("total_expiration_time").defaultNow(), // will change when the token expires
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer("user_id").references(() => users.userId),
  vendorId: integer("vendor_id").references(() => vendors.vendorId),
  title: varchar("title", { length: 255 }),
  message: varchar("message", { length: 255 }),
  status: boolean("status").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userAddresses = pgTable("user_addresses", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer("user_id").references(() => users.userId),
  title: varchar("title", { length: 255 }),
  addressLineOne: varchar("address_line_one", { length: 255 }),
  addressLineTwo: varchar("address_line_two", { length: 255 }),
  reciverName: varchar("reciver_name", { length: 255 }),
  reciverNumber: varchar("reciver_number", { length: 255 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  postalCode: varchar("postal_code", { length: 255 }),
  country: varchar("country", { length: 255 }),
  latitude: varchar("latitude", { length: 255 }),
  longitude: varchar("longitude", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "expired",
  "cancelled",
]);

export const subscriptions = pgTable("subscriptions", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer("user_id").references(() => users.userId),

  planName: varchar("plan_name", { length: 255 }).notNull(),
  discountPercentage: decimal("discount_percentage", {
    precision: 5,
    scale: 2,
  }),
  startDate: timestamp("start_date", { withTimezone: false }).notNull(),
  endDate: timestamp("end_date", { withTimezone: false }).notNull(),
  status: subscriptionStatusEnum("status").default("active").notNull(),
});

export const cart = pgTable("cart", {
  cartId: integer("cart_id").generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer("user_id").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  cartItemId: integer("cart_item_id").generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  cartId: integer("cart_id").references(() => cart.cartId),
  productId: integer("product_id").references(() => products.productId),
  quantity: integer("quantity").notNull(),
  discountApplied: boolean("discount_applied").default(false),
  addedAt: timestamp("added_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  reviewId: integer("review_id").generatedAlwaysAsIdentity().primaryKey(),

  eventProductOrderId: integer("event_product_order_id").references(
    () => eventProductOrders.orderId,
    { onDelete: "cascade" }
  ),

  userId: integer("user_id")
    .references(() => users.userId)
    .notNull(),
  eventId: integer("event_id").references(() => events.eventId),

  productId: integer("product_id")
    .references(() => products.productId, { onDelete: "cascade" })
    .notNull(),

  vendorId: integer("vendor_id").references(() => vendors.vendorId),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  description: varchar("description"),

  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const reviewMediaTypeEnum = pgEnum("review_media_type", [
  "image",
  "video",
]);

export const reviewMedia = pgTable("review_media", {
  reviewMediaId: integer("review_media_id")
    .generatedAlwaysAsIdentity()
    .primaryKey(), // auto-increment
  reviewId: integer("review_id").references(() => reviews.reviewId),
  mediaUrl: varchar("media_url", { length: 255 }),
  mediaType: reviewMediaTypeEnum("media_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pricingSettings = pgTable("pricing_settings", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  platformServiceFeePercentage: decimal("platform_service_fee_percentage", {
    precision: 10,
    scale: 2,
  }),
  effectiveFrom: timestamp("effective_from").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const taxZones = pgTable("tax_zones", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  name: varchar("name", { length: 255 }),
  postalCode: varchar("postal_code", { length: 255 }),
  taxPercentage: decimal("tax_percentage", { precision: 10, scale: 2 }),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

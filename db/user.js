// user.js

import {
  pgTable,
  varchar,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
} from 'drizzle-orm/pg-core';
import { event, eventType } from './event.js';
import { product, vendor } from './vendor.js';
import {
  bookingSourceEnum,
  bookingStatusEnum,
  mediaTypeEnum,
  paymentPendingTrackerStatusEnum,
  paymentStatusEnum,
  paymentTypeEnum,
  platformEnum,
  userSubscriptionStatusEnum,
} from './enum.js';

export const userType = pgTable('user_type', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  name: varchar('name', { length: 255 }),
});

export const user = pgTable('user', {
  userId: integer('user_id').generatedAlwaysAsIdentity().primaryKey(),
  userTypeId: integer('user_type_id').references(() => userType.id), // foreign key
  parseId: varchar('parse_id', { length: 255 }),
  cognitoSub: varchar('cognito_sub', { length: 255 }),

  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  profileImage: varchar('profile_image', { length: 255 }),
  number: varchar('number', { length: 32 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),

  loggedIn: boolean('logged_in'),
  firebaseToken: varchar('firebase_token', { length: 255 }),
  platform: platformEnum('platform'),
  tokenFacebook: varchar('token_facebook', { length: 255 }),
  tokenTwitter: varchar('token_twitter', { length: 255 }),
  userToken: varchar('user_token', { length: 255 }),

  status: boolean('status').default(false).notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  tokenExpiration: timestamp('total_expiration_time').defaultNow(),
  currentAddressId: integer('current_address_id').references(
    () => userAddress.id
  ),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userNotification = pgTable('user_notification', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer('user_id').references(() => user.userId, {
    onDelete: 'cascade',
  }),
  vendorId: integer('vendor_id').references(() => vendor.vendorId),
  title: varchar('title', { length: 255 }),
  message: varchar('message', { length: 255 }),
  status: boolean('status').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userAddress = pgTable('user_address', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer('user_id').references(() => user.userId, {
    onDelete: 'cascade',
  }),
  title: varchar('title', { length: 255 }),
  addressLineOne: varchar('address_line_one', { length: 255 }),
  addressLineTwo: varchar('address_line_two', { length: 255 }),
  reciverName: varchar('reciver_name', { length: 255 }),
  reciverNumber: varchar('reciver_number', { length: 32 }),
  city: varchar('city', { length: 255 }),
  state: varchar('state', { length: 255 }),
  postalCode: varchar('postal_code', { length: 255 }),
  country: varchar('country', { length: 255 }),
  isDefault: boolean('is_default').default(true),
  latitude: varchar('latitude', { length: 255 }),
  longitude: varchar('longitude', { length: 255 }),
  // location: varchar('location', { length: 255 }),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const subscription = pgTable('subscription', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer('user_id').references(() => user.userId),

  planName: varchar('plan_name', { length: 255 }).notNull(),
  discountPercentage: decimal('discount_percentage', {
    precision: 5,
    scale: 2,
  }),
  startDate: timestamp('start_date', { withTimezone: false }).notNull(),
  endDate: timestamp('end_date', { withTimezone: false }).notNull(),
  status: userSubscriptionStatusEnum('status').default('ACTIVE').notNull(),
});

export const cart = pgTable('cart', {
  cartId: integer('cart_id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer('user_id').references(() => user.userId),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// items
export const bookingDraft = pgTable('booking_draft', {
  bookingDraftId: integer('booking_draft_id')
    .generatedAlwaysAsIdentity()
    .primaryKey(), // auto-increment
  source: bookingSourceEnum('source').notNull(),

  sourceId: integer('source_id'),
  productId: integer('product_id').references(() => product.productId),
  status: bookingStatusEnum('status').notNull(),
  expiredAt: timestamp('expired_at').defaultNow(),

  // more specific to CART
  contactName: varchar('contact_name', { length: 255 }),
  contactNumber: varchar('contact_number', { length: 32 }),
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time').defaultNow(),
  minGuestCount: integer('min_guest_count').default(1),
  maxGuestCount: integer('max_guest_count').default(1),

  // location: varchar('location', { length: 255 }),
  latitude: varchar('latitude', { length: 255 }),
  longitude: varchar('longitude', { length: 255 }),

  bookingStatus: bookingStatusEnum('booking_status').default('HOLD'),

  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// booking
export const booking = pgTable('booking', {
  bookingId: integer('booking_id').generatedAlwaysAsIdentity().primaryKey(),
  userId: integer('user_id').references(() => user.userId),
  eventTypeId: integer('event_type_id').references(() => eventType.id),
  source: bookingSourceEnum('source').notNull(),

  contactName: varchar('contact_name', { length: 255 }),
  contactNumber: varchar('contact_number', { length: 32 }),
  description: varchar('description'),

  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time').defaultNow(),
  minGuestCount: integer('min_guest_count').default(1),
  maxGuestCount: integer('max_guest_count').default(1),

  // location: varchar('location', { length: 255 }),
  latitude: varchar('latitude', { length: 255 }),
  longitude: varchar('longitude', { length: 255 }),

  bookingStatus: bookingStatusEnum('booking_status').default('HOLD'),
  paymentStatus: paymentStatusEnum('payment_status').default('PENDING'),
  vendorId: integer('vendor_id'),

  // amount amoint paid and all
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }), // tootal of all product + service amount + admin commission
  adminCommissionPercentage: decimal('admin_commission_percentage', {
    precision: 10,
    scale: 2,
  }),

  platformFees: decimal('platform_fees', {
    precision: 10,
    scale: 2,
  }),
  bookedAt: timestamp('booked_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// booking Item
export const bookingItem = pgTable('booking_item', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  bookingId: integer('booking_id').references(() => booking.bookingId),
  productId: integer('product_id').notNull(),

  // more specific to CART
  contactName: varchar('contact_name', { length: 255 }),
  contactNumber: varchar('contact_number', { length: 32 }),
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time').defaultNow(),
  minGuestCount: integer('min_guest_count').default(1),
  maxGuestCount: integer('max_guest_count').default(1),
  // product details
  productName: varchar('product_name', { length: 255 }),
  productImage: varchar('product_image', { length: 255 }),
  productPrice: decimal('product_price', { precision: 10, scale: 2 }),
  // location: varchar('location', { length: 255 }),
  latitude: varchar('latitude', { length: 255 }),
  longitude: varchar('longitude', { length: 255 }),
  vendorId: integer('vendor_id'),
  bookingStatus: bookingStatusEnum('booking_status').default('HOLD'),
  paymentStatus: paymentStatusEnum('payment_status').default('PENDING'),

  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// payment table.
export const payment = pgTable('payment', {
  paymentId: integer('payment_id').generatedAlwaysAsIdentity().primaryKey(),

  bookingId: integer('booking_id')
    .references(() => booking.bookingId)
    .notNull(),

  userId: integer('user_id')
    .references(() => user.userId)
    .notNull(),

  provider: varchar('provider', { length: 50 }),
  // razorpay | stripe | cash | external

  providerPaymentId: varchar('provider_payment_id', { length: 255 }),
  providerOrderId: varchar('provider_order_id', { length: 255 }),

  paymentType: paymentTypeEnum('payment_type').notNull(),
  paymentMeta: jsonb('payment_meta'),
  remarks: varchar('remarks', { length: 255 }),
  paymentStatus: paymentStatusEnum('payment_status').default('PENDING'),

  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),

  initiatedAt: timestamp('initiated_at').defaultNow(),
  completedAt: timestamp('completed_at'),

  metadata: jsonb('metadata'),

  errorCode: varchar('error_code', { length: 100 }),
  failureReason: varchar('failure_reason', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// partial reminder table for payment pending with expire time.
export const paymentPendingTracker = pgTable('payment_pending_tracker', {
  trackerId: integer('tracker_id').generatedAlwaysAsIdentity().primaryKey(),

  bookingId: integer('booking_id')
    .references(() => booking.bookingId)
    .notNull(),

  userId: integer('user_id')
    .references(() => user.userId)
    .notNull(),

  pendingAmount: decimal('pending_amount', {
    precision: 10,
    scale: 2,
  }).notNull(),

  status: paymentPendingTrackerStatusEnum('tracker_status').default('ACTIVE'),

  nextReminderAt: timestamp('next_reminder_at'),
  lastReminderAt: timestamp('last_reminder_at'),
  reminderCount: integer('reminder_count').default(0),

  expiresAt: timestamp('expires_at'), // optional cutoff (eg: booking date)

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const review = pgTable('review', {
  reviewId: integer('review_id').generatedAlwaysAsIdentity().primaryKey(),

  productId: integer('product_id').references(() => product.productId, {
    onDelete: 'cascade',
  }),

  userId: integer('user_id')
    .references(() => user.userId)
    .notNull(),

  eventId: integer('event_id').references(() => event.eventId),
  vendorId: integer('vendor_id').references(() => vendor.vendorId),

  rating: integer('rating').notNull(),
  title: varchar('title', { length: 255 }),
  description: varchar('description'),

  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const reviewMedia = pgTable('review_media', {
  reviewMediaId: integer('review_media_id')
    .generatedAlwaysAsIdentity()
    .primaryKey(), // auto-increment
  reviewId: integer('review_id').references(() => review.reviewId, {
    onDelete: 'cascade',
  }),
  mediaUrl: varchar('media_url', { length: 255 }),
  mediaType: mediaTypeEnum('media_type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const pricingSetting = pgTable('pricing_setting', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  feePercentage: decimal('fee_percentage', {
    precision: 10,
    scale: 2,
  }),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),

  effectiveFrom: timestamp('effective_from').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const taxZone = pgTable('tax_zone', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  name: varchar('name', { length: 255 }),
  postalCode: varchar('postal_code', { length: 255 }),
  taxPercentage: decimal('tax_percentage', { precision: 10, scale: 2 }),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
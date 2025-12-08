import {
  pgTable,
  varchar,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
} from 'drizzle-orm/pg-core';
import { event, eventBooking } from './event.js';
import { product, vendor } from './vendor.js';
import {
  bookingStatusEnum,
  mediaTypeEnum,
  paymentStatusEnum,
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
  number: varchar('number', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),

  loggedIn: boolean('logged_in'),
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
  userId: integer('user_id').references(() => user.userId),
  vendorId: integer('vendor_id').references(() => vendor.vendorId),
  title: varchar('title', { length: 255 }),
  message: varchar('message', { length: 255 }),
  status: boolean('status').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userAddress = pgTable('user_address', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer('user_id').references(() => user.userId),
  title: varchar('title', { length: 255 }),
  addressLineOne: varchar('address_line_one', { length: 255 }),
  addressLineTwo: varchar('address_line_two', { length: 255 }),
  reciverName: varchar('reciver_name', { length: 255 }),
  reciverNumber: varchar('reciver_number', { length: 255 }),
  city: varchar('city', { length: 255 }),
  state: varchar('state', { length: 255 }),
  postalCode: varchar('postal_code', { length: 255 }),
  country: varchar('country', { length: 255 }),

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
  status: userSubscriptionStatusEnum('status').default('active').notNull(),
});

export const cart = pgTable('cart', {
  cartId: integer('cart_id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer('user_id').references(() => user.userId),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const cartItem = pgTable('cart_item', {
  cartItemId: integer('cart_item_id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  cartId: integer('cart_id').references(() => cart.cartId),
  productId: integer('product_id').references(() => product.productId),

  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description'),
  contactNumber: varchar('contact_number', { length: 255 }),

  date: timestamp('date').defaultNow(),
  minGuestCount: integer('min_guest_count').default(1),
  maxGuestCount: integer('max_guest_count').default(1),

  // location: varchar('location', { length: 255 }),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),

  // bookingStatus: bookingStatusEnum('booking_status').default('created'),
  // paymentStatus: paymentStatusEnum('payment_status').default('pending'),

  quantity: integer('quantity').notNull(),
  addedAt: timestamp('added_at').defaultNow(),
});

export const cartBooking = pgTable('cart_booking', {
  cartBookingId: integer('cart_booking_id')
    .generatedAlwaysAsIdentity()
    .primaryKey(), // auto-increment
  userId: integer('user_id').references(() => user.userId),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const cartItemBooking = pgTable('cart_item_booking', {
  cartItemId: integer('cart_item_id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  cartBookingId: integer('cart_booking_id').references(
    () => cartBooking.cartBookingId
  ),
  productId: integer('product_id').references(() => product.productId),

  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description'),
  contactNumber: varchar('contact_number', { length: 255 }),

  date: timestamp('date').defaultNow(),
  minGuestCount: integer('min_guest_count').default(1),
  maxGuestCount: integer('max_guest_count').default(1),

  // location: varchar('location', { length: 255 }),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),

  bookingStatus: bookingStatusEnum('booking_status').default('created'),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),

  quantity: integer('quantity').notNull(),
  addedAt: timestamp('added_at').defaultNow(),
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
  reviewId: integer('review_id').references(() => review.reviewId),
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

export const payment = pgTable('payment', {
  paymentId: integer('payment_id').generatedAlwaysAsIdentity().primaryKey(),

  userId: integer('user_id').references(() => user.userId),
  cartBookingId: integer('cart_booking_id').references(
    () => cartBooking.cartBookingId
  ),
  eventBookingId: integer('order_booking_id').references(() => eventBooking.id),

  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  paidAmout: decimal('paid_amount', { precision: 10, scale: 2 }),
  remainingAmount: decimal('remaining_amount', { precision: 10, scale: 2 }),

  paymentStatus: paymentStatusEnum('payment_status').default('pending'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const paymentTransaction = pgTable('payment_transaction', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  transactionId: varchar('transaction_id', { length: 255 }),
  paymentId: integer('payment_id').references(() => payment.paymentId),

  paymentMethod: varchar('payment_method', { length: 255 }),
  transactionStatus: varchar('transaction_status', { length: 255 }),

  paymentStatus: varchar('payment_status', { length: 50 }).notNull(),
  paymentType: varchar('payment_type', { length: 50 }),
  paymentMeta: jsonb('payment_meta'),

  remarks: varchar('remarks', { length: 255 }),

  referenceNumber: varchar('reference_number', { length: 255 }),

  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('USD').notNull(),

  transactionTime: timestamp('transaction_time').defaultNow().notNull(),

  errorCode: varchar('error_code', { length: 100 }),
  failureReason: varchar('failure_reason', { length: 255 }),
});

import {
  decimal,
  integer,
  jsonb,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { product, productType } from './vendor.js';
import { user } from './user.js';
import {
  bookingStatusEnum,
  eventProductOrderSourceEnum,
  eventStatusEnum,
  paymentStatusEnum,
} from './enum.js';

export const eventType = pgTable('event_type', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  name: varchar('name', { length: 255 }),
  image: varchar('image'),
  description: varchar('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const eventProductType = pgTable('event_product_type', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  eventTypeId: integer('event_type_id').references(() => eventType.id),
  productTypeId: integer('product_type_id').references(() => productType.id),
});

export const event = pgTable('event', {
  eventId: integer('event_id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer('user_id').references(() => user.userId),
  eventTypeId: integer('event_type_id').references(() => eventType.id),

  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description'),
  contactNumber: varchar('contact_number', { length: 255 }),

  eventDate: timestamp('event_date').defaultNow(),
  minGuestCount: integer('min_guest_count').default(1),
  maxGuestCount: integer('max_guest_count').default(1),

  // location: varchar('location', { length: 255 }),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const eventItem = pgTable('event_item', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  eventId: integer('event_id').references(() => event.eventId, {
    onDelete: 'cascade',
  }),
  productId: integer('product_id').references(() => product.productId, {
    onDelete: 'cascade',
  }),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const eventBooking = pgTable('event_booking', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  userId: integer('user_id').references(() => user.userId),
  eventTypeId: integer('event_type_id').references(() => eventType.id),

  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }), // tootal of all product + service amount + admin commission

  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description'),
  contactNumber: varchar('contact_number', { length: 255 }),

  eventDate: timestamp('event_date').defaultNow(),
  minGuestCount: integer('min_guest_count').default(1),
  maxGuestCount: integer('max_guest_count').default(1),

  // location: varchar('location', { length: 255 }),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),

  bookingStatus: bookingStatusEnum('booking_status').default('created'),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),

  // amount amoint paid and all

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

export const eventProductOrder = pgTable('event_product_order', {
  orderId: integer('order_id').generatedAlwaysAsIdentity().primaryKey(),

  eventBookingId: integer('event_booking_id')
    .references(() => eventBooking.id, { onDelete: 'cascade' })
    .notNull(),

  productId: integer('product_id')
    .references(() => product.productId, { onDelete: 'cascade' })
    .notNull(),

  productName: varchar('product_name', { length: 255 }),
  productImage: varchar('product_image', { length: 255 }),
  source: eventProductOrderSourceEnum('source').default('application'),
  vnedorName: varchar('vnedor_name', { length: 255 }),

  quantity: integer('quantity').default(1).notNull(),
  lowerSlab: integer('lower_slab'),
  upperSlab: integer('upper_slab'),

  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date').defaultNow(),
  color: varchar('color', { length: 52 }).default('orange'),

  productPrice: decimal('product_price', { precision: 10, scale: 2 }),
  serviceBookingPrice: decimal('service_booking_price', {
    precision: 10,
    scale: 2,
  }),

  status: eventStatusEnum('status').default('booked'),

  createdAt: timestamp('created_at').defaultNow(),
});

// export const eventOrderTransaction = pgTable('event_order_transaction', {
//   transactionId: integer('transaction_id')
//     .generatedAlwaysAsIdentity()
//     .primaryKey(),

//   eventBookingId: integer('order_id').references(() => eventBooking.id),
//   transactionStatus: varchar('transaction_status', { length: 255 }),

//   paymentStatus: varchar('payment_status', { length: 50 }).notNull(),
//   paymentMethod: varchar('payment_method', { length: 50 }),
//   paymentType: varchar('payment_type', { length: 50 }),
//   paymentMeta: jsonb('payment_meta'),

//   remarks: varchar('remarks', { length: 255 }),

//   referenceNumber: varchar('reference_number', { length: 255 }),

//   amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
//   currency: varchar('currency', { length: 10 }).default('USD').notNull(),

//   transactionTime: timestamp('transaction_time').defaultNow().notNull(),

//   failureReason: varchar('failure_reason', { length: 255 }),
//   errorCode: varchar('error_code', { length: 100 }),

//   createdAt: timestamp('created_at').defaultNow(),
// });

export const featuredEvent = pgTable('featured_event', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  name: varchar('name', { length: 255 }),
  description: varchar('description'),

  mediaURL: varchar('media_url', { length: 255 }),
  altText: varchar('alt_text', { length: 255 }),
  priority: integer('priority').default(0),
  eventTypeId: integer('event_type_id').references(() => eventType.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const featuredBanners = pgTable('featured_banner', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  name: varchar('name', { length: 255 }),

  mediaURL: varchar('media_url', { length: 255 }),
  altText: varchar('alt_text', { length: 255 }),
  priority: integer('priority').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

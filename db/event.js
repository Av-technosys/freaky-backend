import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { productType } from './vendor.js';
import { user } from './user.js';

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

  contactName: varchar('contact_name', { length: 255 }),
  contactNumber: varchar('contact_number', { length: 255 }),
  description: varchar('description'),

  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time').defaultNow(),
  minGuestCount: integer('min_guest_count').default(1),
  maxGuestCount: integer('max_guest_count').default(1),

  // location: varchar('location', { length: 255 }),
  latitude: varchar('latitude', { length: 255 }),
  longitude: varchar('longitude', { length: 255 }),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
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

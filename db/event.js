import {
  decimal,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { productType, vendors } from './vendor.js';
import { users } from './user.js';

export const eventTypes = pgTable('event_types', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  name: varchar('name', { length: 255 }),
});

export const eventTypeProduct = pgTable('event_type_product', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  eventTypeId: integer('event_type_id').references(() => eventTypes.id),
  productId: integer('product_id').references(() => productType.id),
});

export const events = pgTable('events', {
  eventId: integer('event_id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  userId: integer('user_id').references(() => users.userId),
  eventTypeId: integer('event_type_id').references(() => eventTypes.id),

  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description'),

  eventDate: timestamp('event_date').defaultNow(),
  location: varchar('location', { length: 255 }),

  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const eventBooking = pgTable('event_booking', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  eventId: integer('event_id').references(() => events.eventId),
  userId: integer('user_id').references(() => users.userId),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  bookingStatus: varchar('booking_status', { length: 255 }),
  bookedAt: timestamp('booked_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const featuredCategoryEvent = pgTable('featured_category_event', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  name: varchar('name', { length: 255 }), // -- e.g. 'featured', 'most_popular', 'trending'
  description: varchar('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const eventProductOrders = pgTable('event_product_orders', {
  orderId: integer('order_id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment

  bookingId: integer('booking_id')
    .references(() => eventBooking.id, { onDelete: 'cascade' })
    .notNull(),

  userId: integer('user_id')
    .references(() => users.userId, { onDelete: 'cascade' })
    .notNull(),

  eventTypeId: integer('event_type_id')
    .references(() => eventTypes.id, { onDelete: 'cascade' })
    .notNull(),

  productId: integer('product_id')
    .references(() => productType.id, { onDelete: 'cascade' })
    .notNull(),

  vendorId: integer('vendor_id').references(() => vendors.vendorId),

  quantity: integer('quantity').default(1).notNull(),

  price: decimal('price', { precision: 10, scale: 2 }),
  paid: decimal('paid', { precision: 10, scale: 2 }),
  due: decimal('due', { precision: 10, scale: 2 }),

  adminCommissionPercentage: decimal('admin_commission_percentage', {
    precision: 10,
    scale: 2,
  }),

  orderStatus: varchar('order_status', { length: 50 }),

  orderedAt: timestamp('ordered_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const eventOrderTransactions = pgTable('event_order_transactions', {
  transactionId: integer('transaction_id')
    .generatedAlwaysAsIdentity()
    .primaryKey(), // auto-increment
  orderId: integer('order_id').references(() => eventProductOrders.orderId),
  transactionStatus: varchar('transaction_status', { length: 255 }),
  paymentMethod: varchar('payment_method', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  transactionDate: timestamp('transaction_date', { withTimezone: false })
    .defaultNow()
    .notNull(),
  referenceNumber: varchar('reference_number', { length: 255 }),
  remarks: varchar('remarks', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

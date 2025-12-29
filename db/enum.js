import { pgEnum } from 'drizzle-orm/pg-core';

export const mediaTypeEnum = pgEnum('media_type_enum', ['image', 'video']);

export const productTypeEnum = pgEnum('product_type_enum', [
  'product',
  'addon',
]);

export const productPricingTypeEnum = pgEnum('pricing_type_enum', [
  'flat',
  'percentage',
  'tier',
  'modular',
]);

export const userSubscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'expired',
  'cancelled',
]);

export const bookingStatusEnum = pgEnum('booking_status', [
  'created', // user created event (cart/draft)
  'booked', // user submitted booking
  'confirmed', // admin/vendor confirmed
  'in_progress', // event happening / work started
  'completed', // event is done
  'cancelled', // event cancelled
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', // no payment yet
  'partial', // half/advance received
  'paid', // full payment done
  'refunded', // refunded
]);

export const eventStatusEnum = pgEnum('event_status', [
  'booked', // booking confirmed
  'will_start', // upcoming / scheduled but not started
  'ongoing', // event is happening now
  'completed', // event finished
  'cancelled', // event cancelled anytime
]);

export const vendorStatusEnum = pgEnum('vendor_status', [
  'scraped',
  'pending_vendor',
  'pending_admin',
  'approved',
  'rejected',
  'suspended',
]);

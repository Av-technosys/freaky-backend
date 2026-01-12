import { pgEnum } from 'drizzle-orm/pg-core';

export const mediaTypeEnum = pgEnum('media_type_enum', ['image', 'video']);

export const productTypeEnum = pgEnum('product_type_enum', [
  'PRODUCT',
  'ADDON',
]);

export const productPricingTypeEnum = pgEnum('pricing_type_enum', [
  'FLAT',
  'PERCENTAGE',
  'TIRE',
  'MODULAR',
]);

export const platformEnum = pgEnum('platform', ['ANDROID', 'IOS', 'WEB']);
export const paymentPendingTrackerStatusEnum = pgEnum('tracker_status', [
  'ACTIVE',
  'PAID',
  'STOPPED',
  'EXPIRED',
]);
export const paymentStatusEnum = pgEnum('payment_status', [
  'PENDING',
  'SUCCESS',
  'FAILED',
  'REFUNDED',
  'PARTIAL',
]);
export const paymentTypeEnum = pgEnum('payment_type', [
  'FULL',
  'PARTIAL',
  'REFUND',
]);
export const bookingStatusEnum = pgEnum('status', [
  'HOLD',
  'EXPIRED',
  'CANCLED',
  'CONFIRMED',
  'COMPLETED',
  'IN_PROGRESS',
  'BOOKED',
]);
export const bookingSourceEnum = pgEnum('source', [
  'CART',
  'EVENT',
  'EXTERNAL',
]);
export const userSubscriptionStatusEnum = pgEnum('subscription_status', [
  'ACTIVE',
  'EXPIRED',
  'CANCELLED',
]);
export const eventStatusEnum = pgEnum('event_status', [
  'BOOKED', // booking confirmed
  'WILL_START', // upcoming / scheduled but not started
  'ONGOING', // event is happening now
  'COMPLETED', // event finished
  'CANCLED', // event cancelled anytime
]);

export const vendorStatusEnum = pgEnum('vendor_status', [
  'SCRAPED',
  'PENDING_VENDOR',
  'PENDING_ADMIN',
  'APPROVED',
  'REJECTED',
  'SUSPENDED',
]);

import { bookingDraft } from '../../db/schema.js';
import { getBookingExpiryTime } from './getBookingExpiry.js';
import { db } from '../../db/db.js';

export async function createBookingDraft({
  source,
  sourceId,
  productId,
  status,
  quantity,

  // optional
  contactName,
  contactNumber,
  startTime,
  endTime,
  minGuestCount,
  maxGuestCount,
  latitude,
  longitude,
}) {
  if (!source || !sourceId || !productId) {
    throw new Error('source, sourceId and productId are required');
  }

  if (!status) {
    throw new Error('status is required');
  }

  if (quantity === undefined || quantity === null) {
    throw new Error('quantity is required');
  }

  const expiredAt = getBookingExpiryTime(source);

  const result = await db
    .insert(bookingDraft)
    .values({
      source,
      sourceId,
      productId,
      status,
      quantity,
      expiredAt,

      // optional fields
      contactName,
      contactNumber,
      startTime,
      endTime,
      minGuestCount,
      maxGuestCount,
      latitude,
      longitude,
    })
    .returning();

  return result[0];
}

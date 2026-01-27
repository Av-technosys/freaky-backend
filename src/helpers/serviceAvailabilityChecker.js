import { and, eq, gt, lt, sql } from 'drizzle-orm';
import { db } from '../../db/db.js';
import { bookingDraft, bookingItem, products } from '../../db/schema.js';

export async function getCountFromBookingDraft(startTime, endTime, productId) {
  try {
    const now = new Date();
    const result = await db
      .select({ count: sql`count(*)` })
      .from(bookingDraft)
      .where(
        and(
          eq(bookingDraft.productId, productId),
          lt(bookingDraft.startTime, endTime),
          gt(bookingDraft.endTime, startTime),
          gt(bookingDraft.expiredAt, now)
        )
      );

    return Number(result[0].count);
  } catch (error) {
    console.log('Error ', error);
  }
}

export async function getCountFromBookingItem(startTime, endTime, productId) {
  const result = await db
    .select({
      count: sql`count(*)`,
    })
    .from(bookingItem)
    .where(
      and(
        eq(bookingItem.productId, productId),
        lt(bookingItem.startTime, endTime),
        gt(bookingItem.endTime, startTime)
      )
    );

  const count = Number(result[0].count);
  return count;
}

export async function getProductMaximumCount(productId) {
  const maximumCount = await db
    .select({ maximumCount: products.maxQuantity })
    .from(products)
    .where(eq(products.productId, productId));

  return Number(maximumCount[0].maximumCount);
}

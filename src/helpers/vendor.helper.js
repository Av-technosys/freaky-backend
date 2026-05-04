import { and, eq } from 'drizzle-orm';
import { db } from '../../db/db.js';
import {
  priceBook,
  priceBookEntry,
  vendorNotifications,
} from '../../db/schema.js';

export const setCurrentPricebook = async (vendorId, pricebookId) => {
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(priceBook)
        .set({ isActive: false })
        .where(eq(priceBook.vendorId, vendorId));
      await tx
        .update(priceBook)
        .set({ isActive: true })
        .where(
          and(eq(priceBook.vendorId, vendorId), eq(priceBook.id, pricebookId))
        );
    });
  } catch (error) {
    console.error('Error setting current pricebook:', error);
  }
};

export const getPriceProdcutPriceDefaultPricebook = async (vendorId) => {
  try {
    const [defaultPricebook] = await db
      .select({ id: priceBook.id })
      .from(priceBook)
      .where(
        and(eq(priceBook.vendorId, vendorId), eq(priceBook.isDefault, true))
      );

    if (!defaultPricebook) {
      throw new Error('Default pricebook not found');
    }

    const productPrices = await db
      .select()
      .from(priceBookEntry)
      .where(eq(priceBookEntry.priceBookingId, defaultPricebook.id));

    return productPrices;
  } catch (error) {
    console.error('Error fetching default pricebook:', error);
    throw error;
  }
};

export const createVendorNotification = async ({
  vendorId,
  title,
  message,
}) => {
  try {
    if (!vendorId) return;

    await db.insert(vendorNotifications).values({
      vendorId,
      title,
      message,
      status: false,
    });
  } catch (error) {
    console.error('Notification error:', error);
  }
};

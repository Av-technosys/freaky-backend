import { and, eq } from "drizzle-orm";
import { db } from "../../db/db.js";
import { priceBook, priceBookEntry } from "../../db/schema.js";

export const setCurrentPricebook = async (vendorId, pricebookId) => {
    try {
        await db.transaction(async (tx) => {
  await tx.update(priceBook).set({  isActive: false }).where(eq(priceBook.vendorId, vendorId));
   await tx.update(priceBook).set({  isActive: true  }).where(and(eq(priceBook.vendorId, vendorId), eq(priceBook.id, pricebookId)))
 });
 
    } catch (error) {
        console.error('Error setting current pricebook:', error);
    }
};


export const getPriceProdcutPriceStandardPricebook = async (vendorId) => {
    try {
        const [standardPricebookId] = await db.select({id: priceBook.id}).from(priceBook).where(and(eq(priceBook.vendorId, vendorId), eq(priceBook.isStandard, true)));

        if(!standardPricebookId){
            throw new Error('Standard pricebook not found')
        };

        const productPrices = await db.select().from(priceBookEntry).where(and(eq(priceBookEntry.priceBookingId, standardPricebookId.id)))
        return productPrices;
    } catch (error) {
        console.error('Error setting current pricebook:', error);
    }
};
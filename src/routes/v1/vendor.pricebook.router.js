import { Router } from 'express';
import { db } from '../../../db/db.js';
//import { eventProductOrders, products } from '../../../db/schema.js'; 

import { and, eq } from 'drizzle-orm'; 
import { checkVendor } from '../../middleware/vendor.middleware.js';
import { priceBook, priceBookEntry, products } from '../../../db/schema.js';
const pricebookRouter = Router();

pricebookRouter.get('/', checkVendor, async (req, res) => {
  try { 
    const vendorId = req.vendor.vendorId;
    const vendorAllPriceBooks = await db.select().from(priceBook).where(eq(priceBook.vendorId, vendorId));
    

    return res.send({ msg: 'Pricebooks fetched successfully', data: vendorAllPriceBooks });
  } catch (error) {
    console.error('Error: ', error);
    return res.send({ message: 'Internal server error' });
  }
});

pricebookRouter.get('/products/:priceBookId', checkVendor, async (req, res) => {
  try { 
    const vendorId = req.vendor.vendorId;
    const priceBookId = req.params.priceBookId;
    const vendorAllPriceBooks = await db.select({
      id: priceBookEntry.id,
      productId: products.productId,
      title: products.title,
      priceBookingId: priceBookEntry.priceBookingId,
      currency: priceBookEntry.currency,
      lowerSlab: priceBookEntry.lowerSlab,
      upperSlab: priceBookEntry.upperSlab,
      listPrice: priceBookEntry.listPrice,
      discountPercentage: priceBookEntry.discountPercentage,
      salePrice: priceBookEntry.salePrice,
    }).from(products).innerJoin(priceBookEntry,  eq(products.productId, priceBookEntry.productId)).where(and(eq(products.vendorId, vendorId), eq(priceBookEntry.priceBookingId, priceBookId)))
    

    return res.send({ msg: 'Pricebooks fetched successfully', data: vendorAllPriceBooks });
  } catch (error) {
    console.error('Error: ', error);
    return res.send({ message: 'Internal server error' });
  }
});


pricebookRouter.put('/update', checkVendor, async (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).send({ message: 'Invalid payload, expected an array of updates' });
    }

    const updatePromises = updates.map(async (item) => {
      if (!item.id) return;

      await db
        .update(priceBookEntry)
        .set({
          lowerSlab: item.lowerSlab,
          upperSlab: item.upperSlab,
          listPrice: item.listPrice,
          discountPercentage: item.discountPercentage,
          salePrice: item.salePrice,
        })
        .where(eq(priceBookEntry.id, item.id));
    });

    await Promise.all(updatePromises);

    return res.send({ msg: 'Pricebooks updated successfully' });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
});

export default pricebookRouter;

import { Router } from 'express';
import { db } from '../../../db/db.js';
//import { eventProductOrders, products } from '../../../db/schema.js'; 

import { and, eq } from 'drizzle-orm'; 
import { checkVendor } from '../../middleware/vendor.middleware.js';
import { priceBook, priceBookEntry, products } from '../../../db/schema.js';
import { getPriceProdcutPriceStandardPricebook, setCurrentPricebook } from '../../helpers/vendor.helper.js';
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

pricebookRouter.post('/create', checkVendor, async (req, res) => {
  const vendorId = req.vendor.vendorId;
  try {
    const { name, description, isActive } = req.body;

    if (!name || !description) {
      return res.status(400).send({ message: 'Missing name or description' });
    }

    const [newPriceBook] = await db.insert(priceBook).values({
      name,
      description,
      vendorId,
    }).returning();

 
    if(isActive){
      await setCurrentPricebook(vendorId, newPriceBook.id);
    }

    let pricebookEntryData = await getPriceProdcutPriceStandardPricebook(vendorId);
     pricebookEntryData = pricebookEntryData.map((item) => {
      return {
        priceBookingId: newPriceBook.id,
        productId: item.productId,
        lowerSlab: item.lowerSlab,
        upperSlab: item.upperSlab,
        listPrice: item.listPrice,
        discountPercentage: item.discountPercentage,
        salePrice: item.salePrice,
      };
    });

 

    await db.insert(priceBookEntry).values(pricebookEntryData);
 
    return res.send({ msg: 'Pricebook created successfully', data: newPriceBook });
  } catch (error) {
    console.error('Error: ', error);
    return res.send({ message: 'Internal server error' });
  }
});

pricebookRouter.delete('/:pricebookId', checkVendor, async (req, res) => {
  const vendorId = req.vendor.vendorId;
  try {
    const pricebookId = req.params.pricebookId;
    // check if itss of the loged in vendor
    const [deletePricebookData] = await db.select().from(priceBook).where(and(eq(priceBook.vendorId, vendorId), eq(priceBook.id, pricebookId)));
    if (!deletePricebookData) {
      return res.status(404).send({ message: 'Pricebook not found' });
    }
    if(deletePricebookData.isActive || deletePricebookData.isStandard){
      return res.status(400).send({ message: 'Pricebook is active or standard' });
    }
    await db.delete(priceBookEntry).where(eq(priceBookEntry.priceBookingId, pricebookId));
    await db.delete(priceBook).where(and(eq(priceBook.vendorId, vendorId), eq(priceBook.id, pricebookId)));
    return res.send({ msg: 'Pricebook deleted successfully' });
  } catch (error) {
    console.error('Error: ', error);
    return res.send({ message: 'Internal server error' });
  }
});

export default pricebookRouter;

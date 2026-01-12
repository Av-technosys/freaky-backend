import { Router } from 'express';
import { db } from '../../../db/db.js';
import { bookingItem, products, vendors } from '../../../db/schema.js';
import { and, eq, gt, gte, lte } from 'drizzle-orm';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import { checkVendor } from '../../middleware/vendor.middleware.js';
const calendarRouter = Router();

calendarRouter.get('/get_events', checkVendor, async (req, res) => {
  try { 
    const vendorId = req.vendor.vendorId;
    console.log(vendorId)
    const now = new Date();
    const startTime = req.query.date
      ? new Date(req.query.date)
      : new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endTime = new Date(
      startTime.getFullYear(),
      startTime.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
const bookingItems = await db
  .select({
    id: bookingItem.id,
    bookingId: bookingItem.bookingId,
    productId: bookingItem.productId,
    contactName: bookingItem.contactName,
    contactNumber: bookingItem.contactNumber,
    startTime: bookingItem.startTime,
    endTime: bookingItem.endTime,
    minGuestCount: bookingItem.minGuestCount,
    maxGuestCount: bookingItem.maxGuestCount,
    latitude: bookingItem.latitude,
    longitude: bookingItem.longitude,
    bookingStatus: bookingItem.bookingStatus,
    paymentStatus: bookingItem.paymentStatus,
    quantity: bookingItem.quantity,
    createdAt: bookingItem.createdAt,
  })
  .from(bookingItem)
  .innerJoin(
    products,
    eq(bookingItem.productId, products.productId)
  )
  .where(eq(products.vendorId, vendorId));


    const updatedArr = bookingItems.map((item) => ({
      ...item,
      description: 'test',
      user: {
        name: 'Rohit',
      },
    }));

    return res.send({ msg: 'Event fetched successfully', data: updatedArr });
  } catch (error) {
    console.error('Error: ', error);
    return res.send({ message: 'Internal server error' });
  }
});

export default calendarRouter;

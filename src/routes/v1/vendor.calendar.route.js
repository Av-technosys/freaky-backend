import { Router } from 'express';
import { db } from '../../../db/db.js';
//import { eventProductOrders, products } from '../../../db/schema.js';
import { products } from '../../../db/schema.js';

import { and, eq, gt, gte, lte } from 'drizzle-orm';
import { confirmUserToken } from '../../middleware/user.middleware.js';
const calendarRouter = Router();

calendarRouter.get('/get_events', confirmUserToken, async (req, res) => {
  try {
    const parsed = JSON.parse(req.user['custom:vendor_ids']);
    const vendorId = parsed.vendorId;
    console.log(req.query.date);
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
    // const eventList = await db
    //   .select({
    //     id: eventProductOrders.orderId,
    //     // eventBookingId: eventProductOrders.eventBookingId,
    //     productId: eventProductOrders.productId,
    //     title: eventProductOrders.productName,
    //     vnedorName: eventProductOrders.vnedorName,
    //     startDate: eventProductOrders.startDate,
    //     endDate: eventProductOrders.endDate,
    //     color: eventProductOrders.color,
    //   })
    //   .from(products)
    //   .where(
    //     and(
    //       eq(products.vendorId, vendorId),
    //       gte(eventProductOrders.startDate, startTime),
    //       lte(eventProductOrders.endDate, endTime)
    //     )
    //   )
    //   .innerJoin(
    //     eventProductOrders,
    //     eq(eventProductOrders.productId, products.productId)
    //   );

    // const updatedArr = eventList.map((item) => ({
    //   ...item,
    //   description: 'test',
    //   user: {
    //     name: 'Rohit',
    //   },
    // }));

    // return res.send({ msg: 'Event fetched successfully', data: updatedArr });
    return res.send({ msg: 'Event fetched successfully' });
  } catch (error) {
    console.error('Error: ', error);
    return res.send({ message: 'Internal server error' });
  }
});

export default calendarRouter;

import { AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito, USER_POOL_ID } from '../../lib/cognitoClient.js';
import { booking, bookingItem, products } from '../../db/schema.js';
import { db } from '../../db/db.js';
import { inArray } from 'drizzle-orm';

export const createExternalBooking = async (req, res) => {
  try {
    const { contactName, contactNumber, services } = req.body;

    const [newBooking] = await db
      .insert(booking)
      .values({ contactName, contactNumber, source: 'EXTERNAL' })
      .returning();

    const bookingId = newBooking.bookingId;

    if (services && services.length > 0) {
      const serviceIds = [...new Set(services.map((s) => s.serviceId))];
      const productsData = await db
        .select({
          productId: products.productId,
          title: products.title,
          bannerImage: products.bannerImage,
        })
        .from(products)
        .where(inArray(products.productId, serviceIds));

      const productMap = new Map(
        productsData.map((p) => [p.productId, p])
      );

    //   console.log(productMap)

      const bookingItems = services.map((service) => {
        const product = productMap.get(Number(service.serviceId));
        console.log(service.serviceId, "-->" ,product)    
        return {
          bookingId,
          contactName,
          contactNumber,
          productId: service.serviceId,
          productName: product ? product.title : null,
          productImage: product ? product.bannerImage : null,
          startTime: new Date(service.startTime),
          endTime: new Date(service.endTime),
          minGuestCount: service.minPerson,
          maxGuestCount: service.maxPerson,
          quantity: 1, // Default quantity as it is required by schema but not provided in input
        };
      });

      console.log(bookingItems) 

      await db.insert(bookingItem).values(bookingItems);
    }

    return res.json({
      message: 'External booking created successfully',
      data: { bookingId },
    });
  } catch (error) {
    console.error('Error creating external booking:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

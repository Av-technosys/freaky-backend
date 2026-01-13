import { booking, bookingItem, products } from '../../db/schema.js';
import { db } from '../../db/db.js';
import { inArray } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

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

      const productMap = new Map(productsData.map((p) => [p.productId, p]));

      const bookingItems = services.map((service) => {
        const product = productMap.get(Number(service.serviceId));

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

      await db.insert(bookingItem).values(bookingItems);
    }

    return res.json({
      message: 'External booking created successfully',
      data: { bookingId },
    });
  } catch (error) {
    console.error('Error creating external booking:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];

    const {
      eventTypeId,
      source,
      contactName,
      contactNumber,
      description,
      startTime,
      endTime,
      minGuestCount,
      maxGuestCount,
      latitude,
      longitude,
    } = req.body;

    if (!eventTypeId || !source) {
      return res.status(400).json({
        message: 'eventTypeId and source are required',
      });
    }

    const [createdBooking] = await db
      .insert(booking)
      .values({
        userId,
        eventTypeId,
        source,

        contactName,
        contactNumber,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        minGuestCount,
        maxGuestCount,

        latitude,
        longitude,

        bookingStatus: 'HOLD',
        paymentStatus: 'PENDING',
      })
      .returning({
        bookingId: booking.bookingId,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,
      });

    return res.status(201).json({
      message: 'Booking created successfully',
      data: createdBooking,
    });
  } catch (error) {
    console.error('Create booking failed', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const createBookingItem = async (req, res) => {
  try {
    const {
      bookingId,
      productId,
      contactName,
      contactNumber,
      startTime,
      endTime,
      minGuestCount,
      maxGuestCount,
      quantity,
      latitude,
      longitude,
    } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: 'productId and quantity are required',
      });
    }

    const [productData] = await db
      .select({
        productId: products.productId,
        name: products.title,
        image: products.bannerImage,
        price: products.currentPriceBook,
      })
      .from(products)
      .where(eq(products.productId, productId));

    if (!productData) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const [createdItem] = await db
      .insert(bookingItem)
      .values({
        bookingId,
        productId: productData.productId,

        contactName,
        contactNumber,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        minGuestCount,
        maxGuestCount,

        productName: productData.name,
        productImage: productData.image,
        productPrice: productData.price,

        latitude,
        longitude,

        quantity,
      })
      .returning();

    return res.status(201).json({
      message: 'Booking item created',
      data: createdItem,
    });
  } catch (error) {
    console.error('Create booking item failed', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

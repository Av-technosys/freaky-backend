import { booking, vendors, bookingDraft, bookingItem, products } from '../../db/schema.js';
import { db } from '../../db/db.js';
import { and, ilike, inArray } from 'drizzle-orm';
import { eq, sql } from 'drizzle-orm';
import { paginate } from '../helpers/paginate.js';
import { getCountFromBookingDraft, getCountFromBookingItem, getProductMaximumCount } from '../helpers/serviceAvailabilityChecker.js';
import { createVendorNotification } from '../helpers/vendor.helper.js';
import { ne, desc } from 'drizzle-orm';

export const createExternalBooking = async (req, res) => {
  try {
    const raw = req.user['custom:vendor_ids'];

    let vendorId;

    try {
      const parsed = JSON.parse(raw);
      vendorId = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      vendorId = raw;
    }

    vendorId = Number(vendorId);

    if (!vendorId) {
      return res.status(400).json({
        message: 'vendorId missing',
      });
    }
    const { contactName, contactNumber, services } = req.body;

    const [newBooking] = await db.insert(booking).values({ contactName, contactNumber, source: 'EXTERNAL' }).returning();

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

      const bookingItems = await Promise.all(
        services.map(async (service) => {
          const product = productMap.get(Number(service.serviceId));

          await createVendorNotification({
            vendorId,
            title: 'New External Booking',
            message: `New booking from ${contactName}`,
          });

          return {
            bookingId,
            contactName,
            contactNumber,
            productId: service.serviceId,
            productName: product ? product.title : null,
            productImage: product ? product.bannerImage : null,
            startTime: new Date(service.startTime + 'Z'),
            endTime: new Date(service.endTime + 'Z'),
            minGuestCount: service.minPerson,
            maxGuestCount: service.maxPerson,
            vendorId,
            quantity: 1,
          };
        })
      );

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

export const createBooking = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];

    const { eventTypeId, source, contactName, contactNumber, description, startTime, endTime, minGuestCount, maxGuestCount, latitude, longitude } = req.body;

    if (!eventTypeId || !source) {
      return res.status(400).json({
        message: 'eventTypeId and source are required',
      });
    }

    const result = await db.transaction(async (tx) => {
      const [createdBooking] = await tx
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
        });

      const bookingId = createdBooking.bookingId;

      // 🔥 CONDITION BASED ON SOURCE
      const draftFilter = source === 'CART' ? and(eq(bookingDraft.source, 'CART'), eq(bookingDraft.sourceId, req.body.sourceId)) : eq(bookingDraft.userId, userId);

      // 2️⃣ Move only relevant drafts
      await tx.insert(bookingItem).select(
        tx
          .select({
            bookingId: sql`${bookingId}`,
            productId: bookingDraft.productId,

            contactName: bookingDraft.contactName,
            contactNumber: bookingDraft.contactNumber,

            startTime: bookingDraft.startTime,
            endTime: bookingDraft.endTime,

            minGuestCount: bookingDraft.minGuestCount,
            maxGuestCount: bookingDraft.maxGuestCount,

            productName: sql`''`, // optional fill later
            productImage: sql`''`,
            productPrice: sql`0`,

            vendorId: sql`0`,

            latitude: bookingDraft.latitude,
            longitude: bookingDraft.longitude,

            quantity: bookingDraft.quantity,
          })
          .from(bookingDraft)
          .where(draftFilter)
      );

      //       const userEmail = req.user.email;

      // await createVendorNotification({
      //   vendorId: null,
      //   title: 'New Booking',
      //   message: `Booking created by ${contactName}`,
      // });

      // await sendMail({
      //   to: userEmail,
      //   subject: 'Booking Created',
      //   body: bookingConfirmation({ name: contactName }),
      // });
      // 3️⃣ Delete only those drafts
      await tx.delete(bookingDraft).where(draftFilter);

      return createdBooking;
    });

    return res.status(201).json({
      message: 'Booking created with items successfully',
      data: result,
    });
  } catch (error) {
    console.error('Create booking failed', error);

    return res.status(500).json({
      message: error.message || 'Internal server error',
    });
  }
};

export const createBookingItem = async (req, res) => {
  try {
    const { bookingId, items } = req.body;

    if (!bookingId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'bookingId and items[] are required',
      });
    }

    const productIds = items.map((i) => i.productId);

    const productsData = await db
      .select({
        productId: products.productId,
        name: products.title,
        image: products.bannerImage,
        price: products.currentPriceBook,
        vendorId: products.vendorId,
      })
      .from(products)
      .where(inArray(products.productId, productIds));

    const productMap = new Map(productsData.map((p) => [p.productId, p]));

    const bookingItems = items.map((item) => {
      const product = productMap.get(item.productId);

      return {
        bookingId,
        productId: item.productId,

        contactName: item.contactName,
        contactNumber: item.contactNumber,

        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),

        minGuestCount: item.minGuestCount,
        maxGuestCount: item.maxGuestCount,

        productName: product?.name,
        productImage: product?.image,
        productPrice: product?.price,
        vendorId: product?.vendorId,

        latitude: item.latitude,
        longitude: item.longitude,

        quantity: item.quantity ?? 1,
      };
    });

    await db.insert(bookingItem).values(bookingItems);

    return res.status(201).json({
      message: 'Booking items created successfully',
      count: bookingItems.length,
    });
  } catch (error) {
    console.error('Create booking item failed', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
export const getBooking = async (req, res) => {
  try {
    const { text = '', page = 1, page_size = 12 } = req.query;

    const raw = req.user['custom:vendor_ids'];

    let vendorId;

    try {
      const parsed = JSON.parse(raw);
      vendorId = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      vendorId = raw;
    }

    vendorId = Number(vendorId);

    if (!vendorId) {
      return res.status(400).json({
        message: 'vendorId missing',
      });
    }
    const filters = [eq(bookingItem.vendorId, vendorId)];

    if (text.trim()) {
      filters.push(ilike(bookingItem.productName, `%${text}%`));
    }

    console.log(vendorId);

    const whereClause = and(...filters);

    const result = await paginate({
      table: bookingItem,
      select: {
        id: bookingItem.id,
        contactName: bookingItem.contactName,
        productName: bookingItem.productName,
        productPrice: bookingItem.productPrice,
        bookingStatus: bookingItem.bookingStatus,
        createdAt: bookingItem.createdAt,
      },
      where: whereClause,
      orderBy: bookingItem.createdAt,
      page,
      page_size,
    });

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      ...result,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVendorMonthlyBooking = async (req, res) => {
  try {
    const { text = '', page = 1, page_size = 12 } = req.query;

    const raw = req.user['custom:vendor_ids'];

    let vendorId;

    try {
      const parsed = JSON.parse(raw);
      vendorId = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      vendorId = raw;
    }

    vendorId = Number(vendorId);

    if (!vendorId) {
      return res.status(400).json({
        message: 'vendorId missing',
      });
    }
    const filters = [eq(bookingItem.vendorId, vendorId)];

    if (text.trim()) {
      filters.push(ilike(bookingItem.productName, `%${text}%`));
    }

    console.log(vendorId);

    const whereClause = and(...filters);

    const result = await paginate({
      table: bookingItem,
      select: {
        id: bookingItem.id,
        contactName: bookingItem.contactName,
        productName: bookingItem.productName,
        productPrice: bookingItem.productPrice,
        bookingStatus: bookingItem.bookingStatus,
        createdAt: bookingItem.createdAt,
      },
      where: whereClause,
      orderBy: bookingItem.createdAt,
      page,
      page_size,
    });

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      ...result,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingItemDetailsById = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);

    if (!bookingId) {
      return res.status(400).json({ message: 'Invalid bookingId' });
    }

    // ✅ 1. FETCH BOOKING + VENDOR (JOIN)
    const bookingResult = await db
      .select({
        // booking fields
        bookingId: booking.bookingId,
        userId: booking.userId,
        eventTypeId: booking.eventTypeId,
        source: booking.source,

        contactName: booking.contactName,
        contactNumber: booking.contactNumber,
        description: booking.description,

        startTime: booking.startTime,
        endTime: booking.endTime,

        minGuestCount: booking.minGuestCount,
        maxGuestCount: booking.maxGuestCount,

        latitude: booking.latitude,
        longitude: booking.longitude,

        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,

        totalAmount: booking.totalAmount,
        createdAt: booking.createdAt,
        bookedAt: booking.bookedAt,

        // ✅ vendor fields
        vendorId: booking.vendorId,
        vendorName: vendors.businessName,
        vendorLogo: vendors.logoUrl,
        vendorCity: vendors.city,
        vendorState: vendors.state,
      })
      .from(booking)
      .leftJoin(vendors, eq(booking.vendorId, vendors.vendorId))
      .where(eq(booking.bookingId, bookingId));

    if (!bookingResult.length) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const bookingData = bookingResult[0];

    // ✅ 2. FETCH BOOKING ITEMS
    const items = await db
      .select({
        id: bookingItem.id,
        bookingId: bookingItem.bookingId,

        productId: bookingItem.productId,
        productName: bookingItem.productName,
        productImage: bookingItem.productImage,
        productPrice: bookingItem.productPrice,

        quantity: bookingItem.quantity,

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

        createdAt: bookingItem.createdAt,

        // optional vendor per item
        vendorId: bookingItem.vendorId,
      })
      .from(bookingItem)
      .where(eq(bookingItem.bookingId, bookingId));

    console.log('Fetched booking items:', {
      booking: bookingData,
      items: items || [],
    });
    // ✅ 3. FINAL RESPONSE
    return res.json({
      success: true,
      data: {
        booking: bookingData,
        items: items || [],
      },
    });
  } catch (err) {
    console.log('Error fetching booking:', err);
    return res.status(500).json({
      success: false,
      message: 'Error fetching booking',
    });
  }
};
export const checkServiceAvailability = async (req, res) => {
  try {
    const { productId, startTime, endTime } = req.body;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const [bookingDraftCount, bookingItemCount, productMaximumCount] = await Promise.all([getCountFromBookingDraft(startDate, endDate, productId), getCountFromBookingItem(startDate, endDate, productId), getProductMaximumCount(productId)]);

    const totalUsedServices = bookingDraftCount + bookingItemCount;

    const availableSlots = productMaximumCount - totalUsedServices;

    if (bookingDraftCount + bookingItemCount < productMaximumCount) {
      return res.status(200).json({
        success: true,
        message: 'Service is available at that time..',
        availableServices: availableSlots,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'No service is available at that time..',
        availableServices: 0,
      });
    }
  } catch (error) {
    console.error('Error fetching service availability:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];
    const { completed } = req.query;

    const whereCondition = completed === 'true' ? and(eq(booking.userId, userId), eq(booking.bookingStatus, 'COMPLETED')) : and(eq(booking.userId, userId), ne(booking.bookingStatus, 'COMPLETED'));

    const bookings = await db
      .select({
        bookingId: booking.bookingId,
        userId: booking.userId,
        eventTypeId: booking.eventTypeId,
        source: booking.source,
        contactName: booking.contactName,
        contactNumber: booking.contactNumber,
        description: booking.description,
        startTime: booking.startTime,
        endTime: booking.endTime,
        minGuestCount: booking.minGuestCount,
        maxGuestCount: booking.maxGuestCount,
        latitude: booking.latitude,
        longitude: booking.longitude,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        vendorId: booking.vendorId,
        totalAmount: booking.totalAmount,
        adminCommissionPercentage: booking.adminCommissionPercentage,
        platformFees: booking.platformFees,
        bookedAt: booking.bookedAt,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        vendorName: vendors.businessName,
        vendorLogo: vendors.logoUrl,
      })
      .from(booking)
      .leftJoin(vendors, eq(booking.vendorId, vendors.vendorId))
      .where(whereCondition)
      .orderBy(desc(booking.createdAt));

    console.log('Fetched bookings:', bookings);
    return res.json({
      success: true,
      data: bookings,
    });
  } catch (err) {
    console.error('fetch booking error', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
    });
  }
};

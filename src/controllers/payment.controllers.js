import { razorpayInstance } from '../../lib/razorpay.js';
import crypto from 'crypto';
import { db } from '../../db/db.js';
import { payment, booking, bookingItem, bookingDraft, products, vendors, priceBook, priceBookEntry, paymentVendor, users } from '../../db/schema.js';
import { desc, and, eq, inArray } from 'drizzle-orm';
import { createVendorNotification } from '../helpers/vendor.helper.js';
import { sendMail } from '../utils/email/sendMail.js';
import { bookingConfirmed } from '../utils/email/bookingConfirmation.js';
import { paymentConfirmation } from '../utils/email/paymentConfirmation.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user['custom:user_id'];

    const { source, sourceId } = req.body;

    // Source CART || EVENT
    // BOOKING_DRAFT -> PRODCUT_ID
    // PRODUCT_ID --> VENDOR_ID
    // VENDORID --> VENDOR_ACTIVE_PRICEBOOK
    // VENDOR_ACTIVE_PRICEBOOK --> SERVICE_PRICING

    const condition = source === 'CART' ? and(eq(bookingDraft.sourceId, sourceId), eq(bookingDraft.source, source)) : and(eq(bookingDraft.sourceId, sourceId), eq(bookingDraft.source, source));

    const bookingResult = await db
      .select({
        bookingDraftId: bookingDraft.bookingDraftId,
        bookingMinGuest: bookingDraft.minGuestCount,
        bookingMaxGuest: bookingDraft.maxGuestCount,
        productId: bookingDraft.productId,
        contactName: bookingDraft.contactName,
        contactNumber: bookingDraft.contactNumber,
        startTime: bookingDraft.startTime,
        endTime: bookingDraft.endTime,
        vendorId: products.vendorId,
        productName: products.title,
        productImage: products.bannerImage,
        pricebookId: priceBook.id,
        lowerSlab: priceBookEntry.lowerSlab,
        upperSlab: priceBookEntry.upperSlab,
        price: priceBookEntry.salePrice,
      })
      .from(bookingDraft)
      .where(condition)
      .leftJoin(products, eq(products.productId, bookingDraft.productId))
      .leftJoin(priceBook, and(eq(priceBook.vendorId, products.vendorId), eq(priceBook.isDefault, true)))
      .leftJoin(priceBookEntry, and(eq(priceBookEntry.priceBookingId, priceBook.id), eq(priceBookEntry.productId, products.productId)));

    function getSelectedPricing(data) {
      const grouped = data.reduce((acc, item) => {
        if (!acc[item.bookingDraftId]) {
          acc[item.bookingDraftId] = [];
        }
        acc[item.bookingDraftId].push(item);
        return acc;
      }, {});

      const result = [];

      for (const bookingId in grouped) {
        const items = grouped[bookingId];
        const { bookingMinGuest, bookingMaxGuest } = items[0];

        // 1️⃣ exact match
        let matched = items.filter((i) => bookingMinGuest >= i.lowerSlab && bookingMaxGuest <= i.upperSlab);

        let selected;

        if (matched.length > 0) {
          matched.sort((a, b) => a.upperSlab - b.upperSlab);
          selected = matched[0];
        } else {
          // 2️⃣ closest fallback
          selected = items
            .map((i) => {
              let distance = 0;

              if (bookingMaxGuest < i.lowerSlab) {
                distance = i.lowerSlab - bookingMaxGuest;
              } else if (bookingMinGuest > i.upperSlab) {
                distance = bookingMinGuest - i.upperSlab;
              }

              return { ...i, distance };
            })
            .sort((a, b) => a.distance - b.distance)[0];
        }

        if (selected) {
          result.push(selected);
        } else {
          console.warn(`No slab found for booking ${bookingId}`);
        }
      }

      return result;
    }

    const selectedQuery = getSelectedPricing(bookingResult);
    const total = selectedQuery.reduce((acc, item) => {
      return Number(acc) + Number(item.price);
    }, 0);

    const [newBooking] = await db
      .insert(booking)
      .values({
        contactName: selectedQuery[0].contactName,
        contactNumber: selectedQuery[0].contactNumber,
        startTime: selectedQuery[0].startTime,
        endTime: selectedQuery[0].endTime,
        minGuestCount: selectedQuery[0].bookingMinGuest,
        maxGuestCount: selectedQuery[0].bookingMaxGuest,
        userId: req.user['custom:user_id'],
        source,
        totalAmount: total,
      })
      .returning({
        id: booking.bookingId,
      });

    const newBookingItems = selectedQuery.map((item) => {
      return {
        bookingId: newBooking.id,
        productId: item.productId,
        price: item.price,
        contactName: item.contactName,
        contactNumber: item.contactNumber,
        startTime: item.startTime,
        endTime: item.endTime,
        minGuestCount: item.bookingMinGuest,
        maxGuestCount: item.bookingMaxGuest,
        productName: item.productName,
        productImage: item.productImage,
        productPrice: item.price,
        vendorId: item.vendorId,
        quantity: 1,
      };
    });

    await db.insert(bookingItem).values(newBookingItems);

    const order = await razorpayInstance.orders.create({
      amount: total * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    const orderId = order.id;

    await db.insert(payment).values({
      userId: userId,
      bookingId: newBooking.id,
      amount: total,
      paymentType: 'FULL',
      source: 'web',
      sourceId: 'test',
      provider: 'razorpay',
      providerPaymentId: null,
      providerOrderId: orderId,
      paymentStatus: 'PENDING',
      paymentType: 'FULL',
    });

    return res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order creation failed' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id } = req.body;

    const razorpayPayment = await razorpayInstance.payments.fetch(razorpay_payment_id);
    console.log(razorpayPayment);

    if (razorpayPayment.status === 'captured') {
      // payment done

      //update payment
      const [paymentDetials] = await db.update(payment).set({ paymentStatus: 'CAPTURED' }).where(eq(payment.providerOrderId, razorpayPayment.order_id)).returning({ bookingId: payment.bookingId });

      console.log(paymentDetials);
      // update booking status
      const [bookingDetails] = await db.update(booking).set({ bookingStatus: 'CONFIRMED' }).where(eq(booking.bookingId, paymentDetials.bookingId)).returning();
      console.log('bookingDetails', bookingDetails);
      const bookingItems = await db.select().from(bookingItem).where(eq(bookingItem.bookingId, bookingDetails.bookingId));

      console.log(JSON.stringify(bookingItems));

      const vendorPaymentValues = bookingItems.map((item) => {
        return {
          bookingItemId: item.id,
          vendorId: item.vendorId,
          amount: item.productPrice,
          paymentStatus: 'PENDING', // for vendor the payment is not initiated by admin
          currency: razorpayPayment.currency,
        };
      });

      console.log(JSON.stringify(vendorPaymentValues));

      // create vendor payment
      await db.insert(paymentVendor).values(vendorPaymentValues);
      console.log('Vendor payment inserted');
      // send mail

      const name = bookingDetails.contactName;
      const [bookingUser] = await db.select().from(users).where(eq(users.userId, bookingDetails.userId));

      if (!bookingUser || !bookingUser.email) return res.json({ status: false, message: 'User email id not found!!' });

      const formattedDate = new Date(bookingDetails.startTime).toLocaleDateString('en-IN');
      const formattedTime = new Date(bookingDetails.startTime).toLocaleTimeString('en-IN');

      const services = bookingItems.map((i) => i.productName).join(', ');

      const location = `${bookingDetails.latitude || ''}, ${bookingDetails.longitude || ''}`;

      try {
        await sendMail({
          to: bookingUser.email,
          subject: 'Booking Confirmed 🎉',
          body: bookingConfirmed({
            bookingId: bookingDetails.bookingId,
            name,
            services,
            date: formattedDate,
            time: formattedTime,
            location,
          }),
        });

        await sendMail({
          to: bookingUser.email,
          subject: 'Payment Successful 💰',
          body: paymentConfirmation({
            bookingId: bookingDetails.bookingId,
            name,
            services,
            date: formattedDate,
            time: formattedTime,
            location,
            paymentMethod: 'Razorpay',
          }),
        });

        // if (vendorEmail) {
        //   await sendMail({
        //     to: vendorEmail,
        //     subject: 'New Payment Received',
        //     body: paymentReceived({
        //       bookingId: bookingDetails.bookingId,
        //       name,
        //       services,
        //       date: formattedDate,
        //       time: formattedTime,
        //       location,
        //       paymentMethod: 'Razorpay',
        //     }),
        //   });
        // }
      } catch (e) {
        console.error('Mail error', e);
      }

      try {
        // if (vendorId) {
        //   // console.error('Creating vendor notification for vendor', vendorId);
        //   await createVendorNotification({
        //     vendorId,
        //     title: 'Payment Received 💰',
        //     message: `₹${totalAmount} received for booking #FC-${bookingId}`,
        //   });
        //   // console.log('Vendor notification created');
        // }
      } catch (e) {
        console.error('Notification error', e);
      }
    } else {
      // payment procedding
    }

    // verify payment -> change payment status
    // create vendor payment
    // send email to both user and vendor.

    // const result = await db.transaction(async (tx) => {
    //   const bookingRes = await createBookingFromDraft({
    //     tx,
    //     userId,
    //     source,
    //     sourceId,
    //     amount,
    //     bookingDetails,
    //   });

    //   const bookingId = bookingRes.bookingId;

    //   const [paymentRow] = await tx
    //     .insert(payment)
    //     .values({
    //       bookingId,
    //       userId,
    //       provider: 'razorpay',
    //       providerPaymentId: razorpay_payment_id,
    //       providerOrderId: razorpay_order_id,
    //       amount: amount / 100,
    //       paymentStatus: 'SUCCESS',
    //       paymentType: 'FULL',
    //     })
    //     .returning();

    //   return {
    //     payment: paymentRow,
    //     booking: bookingRes,
    //   };
    // });

    // const bookingId = result.booking.bookingId;

    // const bookingData = await db.query.booking.findFirst({
    //   where: (t, { eq }) => eq(t.bookingId, bookingId),
    // });
    // const vendorId = bookingData?.vendorId;
    // let vendorEmail = null;

    // if (vendorId) {
    //   const [vendorData] = await db
    //     .select()
    //     .from(vendors)
    //     .where(eq(vendors.vendorId, vendorId));

    //   vendorEmail = vendorData?.email || null;
    // }
    // const totalAmount = bookingData?.totalAmount || 0;

    // const items = await db
    //   .select()
    //   .from(bookingItem)
    //   .where(eq(bookingItem.bookingId, bookingId));

    return res.json({
      success: true,
      bookingId: result.booking.bookingId,
    });
  } catch (err) {
    console.error('verify error', err);
    return res.status(500).json({ success: false });
  }
};

export const createBookingFromDraft = async ({ tx, userId, source, sourceId, amount, bookingDetails }) => {
  // console.log(
  //   'Creating booking from draft with source',
  //   source,
  //   'and sourceId',
  //   sourceId
  // );
  const drafts = await tx.query.bookingDraft.findMany({
    where: (t, { eq, and }) => and(eq(t.source, source), eq(t.sourceId, sourceId)),
  });

  if (!drafts.length) {
    throw new Error('No booking drafts found');
  }

  const baseData = bookingDetails || drafts[0];

  const productIds = drafts.map((d) => d.productId);

  const productsData = await tx
    .select({
      productId: products.productId,
      title: products.title,
      bannerImage: products.bannerImage,
      vendorId: products.vendorId,
    })
    .from(products)
    .where(inArray(products.productId, productIds));

  const productMap = new Map(productsData.map((p) => [p.productId, p]));

  const totalAmount = drafts.reduce((sum, d) => {
    return sum + Number(d.price || 0) * (d.quantity || 1);
  }, 0);
  const firstProduct = productMap.get(baseData.productId);

  const vendorIds = new Set(productsData.map((p) => p.vendorId));

  if (vendorIds.size > 1) {
    throw new Error('Multiple vendors not supported in one booking');
  }

  const vendorId = [...vendorIds][0];

  const [createdBooking] = await tx
    .insert(booking)
    .values({
      userId,
      source,

      contactName: baseData.contactName,
      contactNumber: baseData.contactNumber,

      startTime: new Date(baseData.startTime),
      endTime: new Date(baseData.endTime),

      minGuestCount: baseData.minGuestCount,
      maxGuestCount: baseData.maxGuestCount,

      latitude: baseData.latitude,
      longitude: baseData.longitude,

      vendorId: vendorId || null,

      totalAmount,
    })
    .returning({
      bookingId: booking.bookingId,
    });

  const bookingId = createdBooking.bookingId;

  const perItemPrice = totalAmount / drafts.length;

  const bookingItems = drafts.map((draft) => {
    const product = productMap.get(draft.productId);
    const ProductPrice = Number(draft.price ?? 0);

    return {
      bookingId,
      productId: draft.productId,

      productName: product?.title || null,
      productImage: product?.bannerImage || null,
      vendorId: product?.vendorId || null,

      contactName: baseData.contactName,
      contactNumber: baseData.contactNumber,

      startTime: new Date(baseData.startTime),
      endTime: new Date(baseData.endTime),

      minGuestCount: baseData.minGuestCount,
      maxGuestCount: baseData.maxGuestCount,

      productPrice: ProductPrice,

      quantity: draft.quantity || 1,

      bookingStatus: 'CONFIRMED',
      paymentStatus: 'SUCCESS',
    };
  });

  await tx.insert(bookingItem).values(bookingItems);

  await tx.delete(bookingDraft).where(and(eq(bookingDraft.source, source), eq(bookingDraft.sourceId, sourceId)));

  return { bookingId };
};

export const fetchVendorPayments = async (req, res) => {
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

    const payments = await db.select().from(payment).innerJoin(booking, eq(payment.bookingId, booking.bookingId)).where(eq(booking.vendorId, vendorId)).orderBy(desc(payment.createdAt));

    // console.log('payments', payments);
    res.json({
      success: true,
      message: 'Payments fetched successfully',
      payments,
    });
  } catch (err) {
    console.error('fetch payments error', err);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
};

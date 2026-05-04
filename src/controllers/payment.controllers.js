import { razorpayInstance } from '../../lib/razorpay.js';
import crypto from 'crypto';
import { db } from '../../db/db.js';
import {
  payment,
  booking,
  bookingItem,
  bookingDraft,
  products,
  vendors,
} from '../../db/schema.js';
import { desc, and, eq, inArray } from 'drizzle-orm';
import { createVendorNotification } from '../helpers/vendor.helper.js';
import { sendMail } from '../utils/email/sendMail.js';
import { bookingConfirmed } from '../utils/email/bookingConfirmation.js';
import { paymentConfirmation } from '../utils/email/paymentConfirmation.js';

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Order creation failed' });
  }
};

export const verifyAndSavePayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      source,
      sourceId,
      bookingDetails,
    } = req.body;
    console.log('Verifying payment with details', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      source,
      sourceId,
      bookingDetails,
    });
    const userId = req.user['custom:user_id'];

    const isValid = true;

    if (!isValid) {
      return res.status(400).json({ success: false });
    }

    const result = await db.transaction(async (tx) => {
      const bookingRes = await createBookingFromDraft({
        tx,
        userId,
        source,
        sourceId,
        amount,
        bookingDetails,
      });

      const bookingId = bookingRes.bookingId;

      const [paymentRow] = await tx
        .insert(payment)
        .values({
          bookingId,
          userId,
          provider: 'razorpay',
          providerPaymentId: razorpay_payment_id,
          providerOrderId: razorpay_order_id,
          amount: amount / 100,
          paymentStatus: 'SUCCESS',
          paymentType: 'FULL',
        })
        .returning();

      return {
        payment: paymentRow,
        booking: bookingRes,
      };
    });

    const bookingId = result.booking.bookingId;

    const bookingData = await db.query.booking.findFirst({
      where: (t, { eq }) => eq(t.bookingId, bookingId),
    });
    const vendorId = bookingData?.vendorId;
    let vendorEmail = null;

    if (vendorId) {
      const [vendorData] = await db
        .select()
        .from(vendors)
        .where(eq(vendors.vendorId, vendorId));

      vendorEmail = vendorData?.email || null;
    }
    const totalAmount = bookingData?.totalAmount || 0;

    const items = await db
      .select()
      .from(bookingItem)
      .where(eq(bookingItem.bookingId, bookingId));

    const name = bookingData.contactName;
    const userEmail = req.user.email;

    const formattedDate = new Date(bookingData.startTime).toLocaleDateString(
      'en-IN'
    );
    const formattedTime = new Date(bookingData.startTime).toLocaleTimeString(
      'en-IN'
    );

    const services = items.map((i) => i.productName).join(', ');

    const location = `${bookingData.latitude || ''}, ${bookingData.longitude || ''}`;

    try {
      await sendMail({
        to: userEmail,
        subject: 'Booking Confirmed 🎉',
        body: bookingConfirmed({
          bookingId,
          name,
          services,
          date: formattedDate,
          time: formattedTime,
          location,
        }),
      });

      await sendMail({
        to: userEmail,
        subject: 'Payment Successful 💰',
        body: paymentConfirmation({
          bookingId,
          name,
          services,
          date: formattedDate,
          time: formattedTime,
          location,
          paymentMethod: 'Razorpay',
        }),
      });

      if (vendorEmail) {
        await sendMail({
          to: vendorEmail,
          subject: 'New Payment Received',
          body: paymentReceived({
            bookingId,
            name,
            services,
            date: formattedDate,
            time: formattedTime,
            location,
            paymentMethod: 'Razorpay',
          }),
        });
      }
    } catch (e) {
      console.log('Mail error', e);
    }

    try {
      if (vendorId) {
        console.log('Creating vendor notification for vendor', vendorId);
        await createVendorNotification({
          vendorId,
          title: 'Payment Received 💰',
          message: `₹${totalAmount} received for booking #FC-${bookingId}`,
        });
        console.log('Vendor notification created');
      }
    } catch (e) {
      console.log('Notification error', e);
    }
    return res.json({
      success: true,
      bookingId: result.booking.bookingId,
    });
  } catch (err) {
    console.log('verify error', err);
    return res.status(500).json({ success: false });
  }
};

export const createBookingFromDraft = async ({
  tx,
  userId,
  source,
  sourceId,
  amount,
  bookingDetails,
}) => {
  console.log(
    'Creating booking from draft with source',
    source,
    'and sourceId',
    sourceId
  );
  const drafts = await tx.query.bookingDraft.findMany({
    where: (t, { eq, and }) =>
      and(eq(t.source, source), eq(t.sourceId, sourceId)),
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

  await tx
    .delete(bookingDraft)
    .where(
      and(eq(bookingDraft.source, source), eq(bookingDraft.sourceId, sourceId))
    );

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

    const payments = await db
      .select()
      .from(payment)
      .innerJoin(booking, eq(payment.bookingId, booking.bookingId))
      .where(eq(booking.vendorId, vendorId))
      .orderBy(desc(payment.createdAt));

    console.log('payments', payments);
    res.json({
      success: true,
      message: 'Payments fetched successfully',
      payments,
    });
  } catch (err) {
    console.log('fetch payments error', err);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch payments' });
  }
};

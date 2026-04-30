// // this is for creating order where we will fetch price from backend only

// // export const createOrder = async (req, res) => {
// //   try {
// //     const { source, sourceId } = req.body;

// //     if (!source || !sourceId) {
// //       return res.status(400).json({ error: 'Missing source or sourceId' });
// //     }

// //     // 1️⃣ Fetch booking drafts
// //     const drafts = await db.query.bookingDraft.findMany({
// //       where: (t, { eq, and }) =>
// //         and(eq(t.source, source), eq(t.sourceId, sourceId)),
// //     });

// //     if (!drafts.length) {
// //       return res.status(400).json({ error: 'No draft items found' });
// //     }

// //     let totalAmount = 0;

// //     // 2️⃣ Process each draft
// //     for (const draft of drafts) {
// //       const product = await db.query.products.findFirst({
// //         where: (t, { eq }) => eq(t.productId, draft.productId),
// //       });

// //       if (!product) continue;

// //       // 3️⃣ Get default pricebook for vendor
// //       const defaultPB = await db.query.priceBook.findFirst({
// //         where: (t, { eq, and }) =>
// //           and(eq(t.vendorId, product.vendorId), eq(t.isDefault, true)),
// //       });

// //       if (!defaultPB) continue;

// //       // 4️⃣ Get price entries
// //       const priceEntries = await db.query.priceBookEntry.findMany({
// //         where: (t, { eq, and }) =>
// //           and(
// //             eq(t.productId, product.productId),
// //             eq(t.priceBookingId, defaultPB.id)
// //           ),
// //         orderBy: (t, { asc }) => asc(t.lowerSlab),
// //       });

// //       if (!priceEntries.length) continue;

// //       let finalPrice = 0;

// //       // 5️⃣ Pricing logic
// //       if (product.pricingType === 'FLAT') {
// //         const entry = priceEntries[0];
// //         finalPrice = Number(entry.salePrice || entry.listPrice);
// //       }

// //       if (product.pricingType === 'TIER') {
// //         const qty = draft.quantity;

// //         const matched = priceEntries.find(
// //           (p) =>
// //             qty >= p.lowerSlab &&
// //             qty <= (p.upperSlab ?? Infinity)
// //         );

// //         if (!matched) {
// //           throw new Error(
// //             `No pricing slab found for product ${product.productId}`
// //           );
// //         }

// //         finalPrice = Number(matched.salePrice || matched.listPrice);
// //       }

// //       totalAmount += finalPrice * draft.quantity;
// //     }

// //     if (totalAmount <= 0) {
// //       return res.status(400).json({ error: 'Invalid total amount' });
// //     }

// //     // 6️⃣ Create Razorpay order
// //     const order = await razorpayInstance.orders.create({
// //       amount: Math.round(totalAmount * 100),
// //       currency: 'INR',
// //       receipt: `rcpt_${Date.now()}`,
// //     });

// //     return res.json({
// //       success: true,
// //       order,
// //       totalAmount,
// //     });
// //   } catch (err) {
// //     console.error('Create order error:', err);
// //     return res.status(500).json({
// //       error: 'Order creation failed',
// //     });
// //   }
// // };

import { razorpayInstance } from '../../lib/razorpay.js';
import crypto from 'crypto';
import { db } from '../../db/db.js';
import {
  payment,
  booking,
  bookingItem,
  bookingDraft,
  products,
} from '../../db/schema.js';
import { and, eq, inArray } from 'drizzle-orm';

// =========================
// CREATE ORDER
// =========================
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

// =========================
// VERIFY + SAVE PAYMENT
// =========================
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

    const userId = req.user['custom:user_id'];

    // 🔐 (skip signature for now)
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

  const totalAmount = amount / 100;

  const firstProduct = productMap.get(baseData.productId);

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

      vendorId: firstProduct?.vendorId || null,

      totalAmount,
    })
    .returning({
      bookingId: booking.bookingId,
    });

  const bookingId = createdBooking.bookingId;

  const perItemPrice = totalAmount / drafts.length;

  const bookingItems = drafts.map((draft) => {
    const product = productMap.get(draft.productId);

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

      productPrice: Number(draft.price || 0),

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

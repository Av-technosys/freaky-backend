import { faker } from '@faker-js/faker';
import { db } from '../db.js';
import {
  // eventBooking,
  eventOrderTransactions,
  eventProductOrders,
  events,
  eventType,
  eventTypeProduct,
  featuredEvents,
} from '../schema.js';

export async function seedEventTypes() {
  const data = Array.from({ length: 25 }).map(() => ({
    name: faker.commerce.department(),
    image: faker.image.url(),
    description: faker.commerce.productDescription(),
  }));

  await db.insert(eventType).values(data);
}

export async function seedEventTypeProduct() {
  const data = Array.from({ length: 25 }).map(() => ({
    // eventTypeId:faker.number.int({ min: 1, max: 25 }),
    // productId:faker.number.int({ min: 1, max: 25 })
  }));

  await db.insert(eventTypeProduct).values(data);
}

export async function seedEvent() {
  const bookingStatus = Object.freeze({
    CREATED: 'created',
    PENDING: 'pending',
  });
  const paymentStatus = Object.freeze({
    CREATED: 'created',
    PENDING: 'pending',
  });
  const data = Array.from({ length: 25 }).map(() => ({
    // eventId: faker.number.int({ min: 1, max: 25 }),
    // userId: faker.number.int({ min: 1, max: 25 }),
    // eventTypeId: faker.number.int({ min: 1, max: 25 }),
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    contactNumber: faker.phone.number(),
    eventDate: faker.date.anytime(),
    minGuestCount: faker.number.int(),
    maxGuestCount: faker.number.int(),
    // location: faker.location.city(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    bookingStatus: faker.helpers.enumValue(bookingStatus),
    paymentStatus: faker.helpers.enumValue(paymentStatus),
  }));

  await db.insert(events).values(data);
}

export async function seedEventBooking() {
  const data = Array.from({ length: 25 }).map(() => ({
    // eventId: faker.number.int({ min: 1, max: 25 }),
    // userId: faker.number.int({ min: 1, max: 25 }),
    totalAmount: faker.finance.amount(),
    adminCommissionPercentage: faker.commerce.price(),
    platformFees: faker.commerce.price(),
    bookingStatus: true,
    bookedAt: faker.date.anytime(),
  }));

  // await db.insert(eventBooking).values(data);
}

// export async function seedFeaturedEventTypes() {
//   const data = Array.from({ length: 12 }).map((_, idx) => ({
//     name: faker.lorem.word(),
//     description: faker.lorem.text(),
//     eventTypeId: idx + 1,
//   }));

//   await db.insert(featuredEventType).values(data);
// }

export async function seedEventProductOrders() {
  const data = Array.from({ length: 25 }).map(() => ({
    // orderId:faker.number.int({ min: 1, max: 25 }),
    // eventBookingId:faker.number.int({ min: 1, max: 25 }),
    // userId:faker.number.int({ min: 1, max: 25 }),
    // productId:faker.number.int({ min: 1, max: 25 }),
    // vendorId:faker.number.int({ min: 1, max: 25 }),
    productName: faker.company.name(),
    productImage: faker.image.url(),
    vnedorName: faker.company.name(),
    quantity: faker.number.int(),
    lowerSlab: faker.number.int(),
    upperSlab: faker.number.int(),
    productPrice: faker.commerce.price(),
    serviceBookingPrice: faker.commerce.price(),
    status: 'booked',
  }));

  await db.insert(eventProductOrders).values(data);
}

export async function seedEventOrderTransactions() {
  const transactionStatus = Object.freeze({
    PENDING: 'pending',
    SUCCESSFUL: 'successful',
    REJECT: 'reject',
  });
  const paymentStatus = Object.freeze({
    PENDING: 'pending',
    SUCCESSFUL: 'successful',
    REJECT: 'reject',
  });

  const currency = Object.freeze({
    USD: 'usd',
    RUPEES: 'rupees',
  });

  const paymentMethod = Object.freeze({
    UPI: 'upi',
    NETBANKING: 'netbanking',
    NEFT: 'neft',
    WALLET: 'wallet',
  });

  const data = Array.from({ length: 25 }).map(() => ({
    // transactionId:faker.number.int({ min: 1, max: 25 }),
    // eventBookingId:faker.number.int({ min: 1, max: 25 }),
    transactionStatus: faker.helpers.enumValue(transactionStatus),
    paymentStatus: faker.helpers.enumValue(paymentStatus),
    paymentMethod: faker.helpers.enumValue(paymentMethod),
    paymentType: faker.helpers.enumValue(paymentMethod),
    paymentMeta: faker.lorem.sentence(),
    remarks: faker.lorem.sentence(),
    referenceNumber: faker.number.int(),
    currency: faker.helpers.enumValue(currency),
    amount: faker.commerce.price(),
    transactionTime: faker.date.anytime(),
    failureReason: faker.lorem.sentence(),
    errorCode: faker.lorem.sentence(),
  }));

  await db.insert(eventOrderTransactions).values(data);
}

export async function seedFeaturedEvent() {
  const data = Array.from({ length: 25 }).map(() => ({
    // eventId:faker.number.int({ min: 1, max: 25 }),
    name: faker.commerce.name(),
    description: faker.lorem.sentence(),
    mediaURL: faker.lorem.sentence(),
    altText: faker.lorem.sentence(),
    priority: faker.number.int(),
  }));

  await db.insert(featuredEvents).values(data);
}

import { faker } from '@faker-js/faker';
import { db } from '../db';
import {
  eventBooking,
  eventOrderTransactions,
  eventProductOrders,
  events,
  eventType,
  eventTypeProduct,
  featuredCategoryEvents,
} from '../schema.js';

export async function seedEventTypes() {
  const data = Array.from({ length: 25 }).map(() => ({
    name: faker.commerce.catchPhrase(),
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
  const data = Array.from({ length: 25 }).map(() => ({
    // eventId: faker.number.int({ min: 1, max: 25 }),
    // userId: faker.number.int({ min: 1, max: 25 }),
    // eventTypeId: faker.number.int({ min: 1, max: 25 }),
    title: faker.company.catchPhrase(),
    description: faker.lorem.sentence(),
    eventDate: faker.date.anytime(),
    location: faker.location.city(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  }));

  await db.insert(events).values(data);
}

export async function seedEventBooking() {
  const data = Array.from({ length: 25 }).map(() => ({
    // eventId: faker.number.int({ min: 1, max: 25 }),
    // userId: faker.number.int({ min: 1, max: 25 }),
    totalAmount: faker.finance.amount(),
    bookingStatus: true,
    bookedAt: faker.date.anytime(),
  }));

  await db.insert(eventBooking).values(data);
}

export async function seedFeaturedCategoryEvent() {
  const EventCategory = Object.freeze({
    CORPORATE: 'corporate',
    CASUAL: 'casual',
    BIRTHDAY: 'birthday',
    PROFESSIONAL: 'professional',
    PARTY: 'party',
  });

  const data = Array.from({ length: 25 }).map(() => ({
    name: faker.helpers.enumValue(EventCategory),
    description: faker.lorem.sentence(),
  }));

  await db.insert(featuredCategoryEvents).values(data);
}

export async function seedEventProductOrders() {
  const data = Array.from({ length: 25 }).map(() => ({
    // orderId:faker.number.int({ min: 1, max: 25 }),
    // bookingId:faker.number.int({ min: 1, max: 25 }),
    // userId:faker.number.int({ min: 1, max: 25 }),
    // eventTypeId:faker.number.int({ min: 1, max: 25 }),
    // productId:faker.number.int({ min: 1, max: 25 }),
    // vendorId:faker.number.int({ min: 1, max: 25 }),
    quantity: faker.number.int(),
    price: faker.commerce.price(),
    paid: faker.commerce.price(),
    due: faker.commerce.price(),
    adminCommissionPercentage: faker.commerce.price(),
    orderStatus: 'confirmed',
    orderedAt: faker.date.anytime(),
  }));

  await db.insert(eventProductOrders).values(data);
}

export async function seedEventOrderTransactions() {
  const transactionStatus = Object.freeze({
    PENDING: 'pending',
    SUCCESSFUL: 'successful',
    REJECT: 'reject',
  });

  const paymentMethod = Object.freeze({
    UPI: 'upi',
    NETBANKING: 'netbanking',
    NEFT: 'neft',
    WALLET: 'wallet',
  });

  const data = Array.from({ length: 25 }).map(() => ({
    // transactionId:faker.number.int({ min: 1, max: 25 }),
    // orderId:faker.number.int({ min: 1, max: 25 }),
    transactionStatus: faker.helpers.enumValue(transactionStatus),
    paymentMethod: faker.helpers.enumValue(paymentMethod),
    amount: faker.commerce.price(),
    transactionDate: faker.date.anytime(),
    referenceNumber: faker.number.int({ min: 100000, max: 9999999 }),
    remarks: faker.lorem.sentence(),
  }));

  await db.insert(eventOrderTransactions).values(data);
}

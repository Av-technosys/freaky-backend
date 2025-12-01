import { db } from '../db.js';
import {
  cart,
  pricingSettings,
  reviewMedia,
  reviews,
  subscriptions,
  taxZones,
  userAddresses,
  userNotifications,
  users,
} from '../schema.js';
import data from './users_rows.json' assert { type: 'json' };
import { faker } from '@faker-js/faker';

export async function seedUserType() {
  const data = Array.from({ length: 25 }).map(() => ({
    name: faker.person.fullName(),
  }));

  await db.insert(userTypes).values(data);
}

export async function seedUsers() {
  const data = Array.from({ length: 25 }).map(() => ({
    //  userTypeId:faker.number().int({min:1,max:25}),
    //  parseId:faker.number().int({min:1,max:25}),
    // currentAddressId:faker.number().int({min:1,max:25}),
    cognitoSub: faker.lorem.sentence(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    profileImage: faker.image.url(),
    number: faker.phone.number(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    loggedIn: true,
    tokenFacebook: faker.lorem.sentence(),
    tokenTwitter: faker.lorem.sentence(),
    userToken: faker.lorem.sentence(),
    status: false,
    isActive: false,
    tokenExpiration: faker.date.anytime(),
  }));

  await db.insert(users).values(data);
}

export async function seedNotifications() {
  const data = Array.from({ length: 25 }).map(() => ({
    // userId: faker.datatype.number({ min: 1, max: 25 }),
    // vendorId: faker.datatype.number({ min: 1, max: 25 }),
    title: faker.lorem.text(),
    message: faker.lorem.sentence(),
    status: false,
  }));
  await db.insert(userNotifications).values(data);
}

export async function seedUsersAddress() {
  const data = Array.from({ length: 25 }).map(() => ({
    // userId: faker.datatype.number({ min: 1, max: 25 }),
    title: faker.lorem.text(),
    addressLineOne: faker.location.streetAddress(),
    addressLineTwo: faker.location.secondaryAddress(),
    reciverName: faker.person.fullName(),
    reciverNumber: faker.phone.number(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: 'usa',
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    location: faker.location.country(),
  }));
  await db.insert(userAddresses).values(data);
}

export async function seedUserSubscription() {
  const data = Array.from({ length: 25 }).map(() => ({
    // userId:faker.datatype.number({ min: 1, max: 25 }),
    planName: faker.internet.displayName(),
    discountPercentage: faker.number.float(),
    startDate: faker.date.anytime(),
    endDate: faker.date.anytime(),
    status: 'active',
  }));

  await db.insert(subscriptions).values(data);
}

export async function seedUserCart() {
  const data = Array.from({ length: 25 }).map(() => ({
    // userId: faker.datatype.number({ min: 1, max: 25 }),
  }));

  await db.insert(cart).values(data);
}

export async function seedUserCartItem() {
  const data = Array.from({ length: 25 }).map(() => ({
    // cartId: faker.datatype.number({ min: 1, max: 25 }),
    // productId: faker.datatype.number({ min: 1, max: 25 }),
    quantity: faker.number.int(),
    addedAt: faker.date.anytime(),
  }));

  await db.insert(cart).values(data);
}

export async function seedUserReview() {
  const data = Array.from({ length: 25 }).map(() => ({
    // productId: faker.number.int({ min: 1, max: 25 }),
    // userId: faker.number.int({ min: 1, max: 25 }),
    // eventId: faker.number.int({ min: 1, max: 25 }),
    // vendorId: faker.number.int({ min: 1, max: 25 }),
    rating: faker.number.int({ min: 1, max: 5 }),
    title: faker.lorem.text(),
    description: faker.lorem.paragraph(),
  }));

  await db.insert(reviews).values(data);
}

export async function seedUserReviewMedia() {
  const data = Array.from({ length: 25 }).map(() => ({
    // reviewId: faker.number.int({ min: 1, max: 25 }),
    mediaUrl: faker.image.url(),
    mediaType: faker.helpers.enumValue(MediaTypeEnum),
  }));
  await db.insert(reviewMedia).values(data);
}

// export async function seedNotifications(params) {
//     const data = Array.from({ length: 25 }).map(() => ({
//         userId: faker.datatype.number({ min: 1, max: 100 }),
//         vendorId: faker.datatype.number({ min: 5, max: 29 }),
//         title: faker.lorem.text(),
//         message: faker.lorem.sentence(),
//         status: false,
//     }))
//     await db.insert(notifications).values(data)
// }

// export async function seedUsersAddress(params) {
//     const data = Array.from({ length: 25 }).map(() => ({
//         userId: faker.datatype.number({ min: 1, max: 100 }),
//         title: faker.lorem.text(),
//         addressLineOne: faker.location.streetAddress(),
//         addressLineTwo: faker.location.secondaryAddress(),
//         reciverName: faker.person.fullName(),
//         reciverNumber: faker.phone.number(),
//         city: faker.location.city(),
//         state: faker.location.state(),
//         postalCode: faker.location.zipCode(),
//         country: "usa",
//         latitude: faker.location.latitude(),
//         longitude: faker.location.longitude()
//     }))
//     await db.insert(userAddress).values(data)
// }

// export async function seedUserReview() {
//     const data = Array.from({ length: 25 }).map(() => ({

//         // eventProductOrderId: faker.number.int({ min: 1, max: 29 }),
//         // userId: faker.number.int({ min: 1, max: 100 }),
//         // eventId: faker.number.int({ min: 1, max: 29 }),
//         // productId: faker.number.int({ min: 1, max: 29 }),
//         // vendorId: faker.number.int({ min: 5, max: 29 }),
//         rating: faker.number.int({ min: 1, max: 5 }),
//         title: faker.lorem.text(),
//         description: faker.lorem.paragraph(),
//     }));

//     await db.insert(reviews).values(data)
// }

// export async function seedUserReviewMedia() {
//     const data = Array.from({ length: 25 }).map(() => ({
//         // reviewId: faker.number.int({ min: 1, max: 29 }),
//         mediaUrl: faker.image.url(),
//         mediaType: faker.helpers.enumValue(MediaTypeEnum),
//     }))
//     await db.insert(reviewMedia).values(data)
// }
export async function seedUserPricingSetting() {
  const data = Array.from({ length: 25 }).map(() => ({
    feePercentage: faker.number.float(),
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    effectiveFrom: faker.date.anytime(),
  }));
  await db.insert(pricingSettings).values(data);
}

export async function seedtaxZone() {
  const data = Array.from({ length: 25 }).map(() => ({
    name: faker.company.name(),
    postalCode: faker.location.zipCode(),
    taxPercentage: faker.number.float(),
    description: faker.lorem.sentence(),
  }));
  await db.insert(taxZones).values(data);
}

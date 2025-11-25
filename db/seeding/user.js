import { faker } from "@faker-js/faker"
import { db } from "../db.js"
import { users, notifications, userTypes, userSubscriptionStatus, mediaType, userSubscriptionStatus, userAddresses, reviews, reviewMedia } from "../schema.js"


export const MediaTypeEnum = Object.freeze({
    IMAGE: 'image',
    VIDEO: 'video'
});

export async function seedNotifications(params) {
    const data = Array.from({ length: 25 }).map(() => ({
        userId: faker.datatype.number({ min: 1, max: 100 }),
        vendorId: faker.datatype.number({ min: 5, max: 29 }),
        title: faker.lorem.text(),
        message: faker.lorem.sentence(),
        status: false,
    }))
    await db.insert(notifications).values(data)
}

export async function seedUsersAddress(params) {
    const data = Array.from({ length: 25 }).map(() => ({
        userId: faker.datatype.number({ min: 1, max: 100 }),
        title: faker.lorem.text(),
        addressLineOne: faker.location.streetAddress(),
        addressLineTwo: faker.location.secondaryAddress(),
        reciverName: faker.person.fullName(),
        reciverNumber: faker.phone.number(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: "usa",
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude()
    }))
    await db.insert(userAddresses).values(data)
}

export async function seedUserReview() {
    const data = Array.from({ length: 25 }).map(() => ({

        // eventProductOrderId: faker.number.int({ min: 1, max: 29 }),
        // userId: faker.number.int({ min: 1, max: 100 }),
        // eventId: faker.number.int({ min: 1, max: 29 }),
        // productId: faker.number.int({ min: 1, max: 29 }),
        // vendorId: faker.number.int({ min: 5, max: 29 }),
        rating: faker.number.int({ min: 1, max: 5 }),
        title: faker.lorem.text(),
        description: faker.lorem.paragraph(),
    }));

    await db.insert(reviews).values(data)
}

export async function seedUserReviewMedia() {
    const data = Array.from({ length: 25 }).map(() => ({
        // reviewId: faker.number.int({ min: 1, max: 29 }),
        mediaUrl: faker.image.url(),
        mediaType: faker.helpers.enumValue(MediaTypeEnum),
    }))
    await db.insert(reviewMedia).values(data)
}

export async function seedUsers() {
    const data = Array.from({ length: 25 }).map(() => ({

    }))
    await db.insert(users).values(data)
}
import { faker } from '@faker-js/faker';
import { vendors } from '../schema.js';
import { db } from '../db.js';

export async function seedVendor() {
    const createdBy = Object.freeze({
        N32: 32,
        N33: 33,
        N35: 35,
        N36: 36,
        N52: 52,
        N54: 54,
        N55: 55,
        N56: 56,
        N57: 57,
        N60: 60,
        N61: 61,
        N62: 62
    });
    const BusinessType = Object.freeze({
        SOLO: 'solo',
        PROPRIETORSHIP: 'proprietorship',
        LLC: 'llc',
        CORPORATION: 'corporation'
    });
    const BankType = Object.freeze({
        CHECKING: 'checking',
        SAVINGS: 'savings'
    });


    const data = Array.from({ length: 25 }).map(() => ({
        websiteURL: faker.internet.url(),
        logoUrl: faker.image.avatar(),
        description: faker.lorem.sentence(),
        DBAname: faker.company.name(),
        legalEntityName: faker.company.name(),
        einNumber: faker.number.int({ min: 100000000, max: 999999999 }),

        businessType: faker.helpers.enumValue(BusinessType),
        incorporationDate: faker.date.past(),

        // Address
        streetAddressLine1: faker.location.streetAddress(),
        streetAddressLine2: faker.location.secondaryAddress(),
        zipcode: faker.location.zipCode(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: 'usa',
        createdBy: faker.helpers.enumValue(createdBy),
        // Admin of company
        primaryContactName: faker.person.fullName(),
        primaryContactEmail: faker.internet.email(),
        primaryPhoneNumber: faker.phone.number(),

        // socials
        youtubeURL: faker.internet.url(),
        facebookURL: faker.internet.url(),
        linkedinURL: faker.internet.url(),
        instagramURL: faker.internet.url(),

        // Account information
        bankName: faker.company.name(),
        bankAccountNumber: faker.finance.accountNumber(),
        payeeName: faker.person.fullName(),
        bankType: faker.helpers.enumValue(BankType),
        routingNumber: faker.finance.routingNumber(),

        // authorizedSignatory: faker.datatype.number({ min: 32, max: 62 }),

        // status
        status: true,
        isAdminApproved: true,
    }));

    await db.insert(vendors).values(data);
}       
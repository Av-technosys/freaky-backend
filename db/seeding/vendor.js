import { faker } from '@faker-js/faker';
import { priceBooking, priceBookingEntry, productMedia, products, vendorEmployees, vendorDocuments, vendorMedias, vendorOwnerships, vendors } from '../schema.js';
import { db } from '../db.js';

const mediaTypeEnum = Object.freeze({
    IMAGE: 'image',
    VIDEO: 'video'
});

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

export async function seedVendorOwnership() {
    const vendor_ownership = Array.from({ length: 300 }).map(() => ({
        vendorId: faker.number.int({ min: 5, max: 103 }),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        ssnNumber: faker.number.bigInt({ min: 100000000, max: 999999999 }),

        // Address
        streetAddressLine1: faker.location.streetAddress(),
        streetAddressLine2: faker.location.secondaryAddress(),
        zipcode: faker.location.zipCode(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: 'usa',

        isAuthorizedSignature: false,
        ownershipPercentage: faker.number.int({ min: 25, max: 50 })
    }))
    await db.insert(vendorOwnerships).values(vendor_ownership);
}


export async function seedVendorDocument() {
    const documentTypes = [
        { label: 'Business License', value: 'business_license' },
        { label: 'Tax Identification Number (TIN)', value: 'tax_identification_number_tin' },
        { label: 'Certificate of Incorporation', value: 'certificate_of_incorporation' },
        { label: 'Vendor Profile / Application Form', value: 'vendor_profile_application_form' },
        { label: 'Insurance Certificate', value: 'insurance_certificate' },
        { label: 'Bank Reference Letter', value: 'bank_reference_letter' },
        { label: 'Financial Statements or Audited Reports', value: 'financial_statements_or_audited_reports' }
    ];

    const vendor_document = Array.from({ length: 300 }).map(() => ({
        vendorId: faker.number.int({ min: 5, max: 103 }),
        documentType: documentTypes[faker.number.int({ min: 0, max: documentTypes.length - 1 })].value,
        documentUrl: faker.internet.url(),
        description: faker.lorem.sentence(),
    }))
    await db.insert(vendorDocuments).values(vendor_document);
}


export async function seedvendorInvite() {

    const allPermissions = [
        "isAdmin",
        "viewDashboard",
        "viewManageServices",
        "viewBooking",
        "viewCalendar",
        "viewUserReview",
        "viewCompanyProfile",
        "viewPayment",
        "viewManageUser"
    ];
    const vendorInvite = Array.from({ length: 30 }).map(() => ({
        email: faker.internet.email,
        token: faker.string.alphanumeric(32),
        inviteCode: faker.string.uuid(),
        status: true,
        permissions: faker.helpers.arrayElements(allPermissions),
        employeeCode: faker.string.alphanumeric(8).toUpperCase(),
    }))

    await db.insert(vendorInvite).values(vendorInvite);

}


export async function seedvendorEmployeeRequest() {

    const vendorEmployeeRequest = Array.from({ length: 30 }).map(() => ({
        status: true,
        note: faker.lorem.paragraph()
    }))

    await db.insert(vendorEmployeeRequest).values(vendorEmployeeRequest);

}


export async function seedvendorMedia() {
    const vendorMedia = Array.from({ length: 300 }).map(() => ({
        vendorId: faker.number.int({ min: 5, max: 103 }),

        mediaType: faker.helpers.enumValue(mediaTypeEnum),
        mediaUrl: faker.internet.url(),
        altText: faker.lorem.words(5),
        sortOrder: faker.number.int({ min: 1, max: 5 }),
    }))

    await db.insert(vendorMedias).values(vendorMedia);
}

export const PermissionsEnum = Object.freeze({
    IS_ADMIN: 'isAdmin',
    VIEW_DASHBOARD: 'viewDashboard',
    VIEW_MANAGE_SERVICES: 'viewManageServices',
    VIEW_BOOKING: 'viewBooking',
    VIEW_CALENDAR: 'viewCalendar',
    VIEW_USER_REVIEW: 'viewUserReview',
    VIEW_COMPANY_PROFILE: 'viewCompanyProfile',
    VIEW_PAYMENT: 'viewPayment',
    VIEW_MANAGE_USER: 'viewManageUser'
});

export async function seedvendorContacts() {

    const vendorContactsData = Array.from({ length: 99 }).map((_, idx) => ({
        userId: (idx + 70),
        vendorId: faker.number.int({ min: 5, max: 103 }),
        permissions: [faker.helpers.enumValue(PermissionsEnum)],
        department: faker.lorem.word(),
        employeeCode: faker.string.alphanumeric(8).toUpperCase(),
        isActive: true,
        bio: faker.lorem.sentence(),
    }))

    await db.insert(vendorEmployees).values(vendorContactsData);
}

export async function seedPriceBooking() {

    const priceBookingData = Array.from({ length: 300 }).map(() => ({
        vendorId: faker.number.int({ min: 5, max: 103 }),
        isStandard: false,
        isActive: false,
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
    }))

    await db.insert(priceBooking).values(priceBookingData);
}

export async function seedpriceBookingEntry() {

    const priceBookingEntryData = Array.from({ length: 300 }).map(() => {
        const isTire = faker.datatype.boolean();
        const listPriceData = faker.commerce.price();
        const discountPercentageData = faker.number.float({ min: 0, max: 50, precision: 0.01 });
        return ({
            productId: faker.number.int({ min: 1, max: 299 }),
            // priceBookingId: faker.number.int({ min: 1, max: 299 }),
            currency: 'USD',
            lowerSlab: isTire ? faker.number.int({ min: 1, max: 100 }) : null,
            upperSlab: isTire ? faker.number.int({ min: 150, max: 300 }) : null,
            listPrice: listPriceData,
            discountPercentage: discountPercentageData,
            salePrice: listPriceData * (1 - discountPercentageData / 100),
        })
    })

    await db.insert(priceBookingEntry).values(priceBookingEntryData);

}


export async function seedproductType() {

    const productType = Array.from({ length: 30 }).map(() => ({
        name: faker.commerce.department(),
        description: faker.lorem.sentence(),
    }))

    await db.insert(productType).values(productType);

}

const ProductTypeEnum = Object.freeze({
    PRODUCT: "product",
    ADDON: "addon",
});
const ProductPriceTypeEnum = Object.freeze({
    FALT: "flat",
    TIREPRICING: "tier",
});


export async function seedProducts() {

    const productsData = Array.from({ length: 300 }).map(() => ({
        // type: faker.helpers.enumValue(ProductTypeEnum),
        vendorId: faker.number.int({ min: 5, max: 103 }),
        // productTypeId: faker.number.int({ min: 1, max: 29 }),

        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),

        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
        isAvailable: true,

        // currentPriceBook
        // isDiscountScheduled: true,
        pricingType: faker.helpers.enumValue(ProductPriceTypeEnum),
        // percentage: faker.number.float({ min: 0, max: 50, precision: 0.01 }),
        // minQuantity: integer('min_quantity').default(1).notNull(),
        // maxQuantity: integer('max_quantity'),
        // status: boolean('status').default(true).notNull(),
    }))

    await db.insert(products).values(productsData);
}

export async function seedfeaturedCategoryProduct() {

    const featuredCategoryProduct = Array.from({ length: 30 }).map(() => ({
        name: faker.lorem.word(),
        description: faker.lorem.paragraph(),
    }))

    await db.insert(featuredCategoryProduct).values(featuredCategoryProduct);

}


export async function seedfeaturedProdcuts() {

    const featuredProdcuts = Array.from({ length: 30 }).map(() => ({
        // all ids value
    }))

    await db.insert(featuredProdcuts).values(featuredProdcuts);

}


export async function seedproductAvailableArea() {

    const productAvailableArea = Array.from({ length: 30 }).map(() => ({
        postalCode: faker.location.zipCode(),
    }))

    await db.insert(productAvailableArea).values(productAvailableArea);
}


export async function seedproductMedia() {
    const vendor = [
        149, 30, 11, 83, 27, 117, 247, 198, 29, 161
    ]
    const productMediaData = Array.from({ length: 55 }).map(() => ({
        productId: vendor[faker.number.int({ min: 0, max: vendor.length - 1 })],
        mediaType: faker.helpers.enumValue(mediaTypeEnum),
        mediaUrl: faker.image.url(),
        altText: faker.lorem.word(),
        sortOrder: faker.number.int({ min: 1, max: 10 }),
    }))
    await db.insert(productMedia).values(productMediaData);
}



export async function seedproductAddons() {

    const productAddons = Array.from({ length: 30 }).map(() => ({
        //all ids here
    }))

    await db.insert(productAddons).values(productAddons);

}


export async function seeddiscountScheduled() {

    const discountScheduled = Array.from({ length: 30 }).map(() => ({
        name: varchar('name', { length: 255 }),
        lowerBound: decimal('lower_bound', { precision: 10, scale: 2 }),
        upperBound: decimal('upper_bound', { precision: 10, scale: 2 }),
        currency: varchar('currency', { length: 255 }),
    }))

    await db.insert(discountScheduled).values(discountScheduled);

}


export async function seedcontractProductType() {
    const start = faker.date.past

    const contractProductType = Array.from({ length: 30 }).map(() => ({
        startDate: start,
        endDate: faker.date.between({ from: start, to: new Date() }),
        adminCommissionPercentage: faker.number.float({ min: 0, max: 30, precision: 0.01 }),
        platformFees: faker.number.float({ min: 1, max: 200, precision: 0.01 }),

    }))

    await db.insert(contractProductType).values(contractProductType);

}


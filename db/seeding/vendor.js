import { faker } from '@faker-js/faker';
import { vendors } from '../schema.js';
import { db } from '../db.js';
import mediaTypeEnum from "../enum.js"
import productPricingTypeEnum  from "../enum.js"
import productTypeEnum from "../enum.js"

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



export async function seedvendor_ownership() {

 const vendor_ownership = Array.from({ length: 25 }).map(() => ({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      ssnNumber: faker.number.bigInt(),
      // need to check then i will put       einNumber: faker.number.int({ min: 100000000, max: 999999999 }),

      // Address
      streetAddressLine1: faker.location.streetAddress(),
      streetAddressLine2: facker.location.secondaryAddress(),
      zipcode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: 'usa',

      isAuthorizedSignature: faker.datatype.number({ min: 32, max: 62 }),
      ownershipPercentage: faker.number.int({ min: 1, max: 100 })

   }))

     await db.insert(vendor_ownership).values(vendorOwnership);

} 


export async function seedvendor_document() {


    const documentTypes = [
  { label: 'Business License', value: 'business_license' },
  { label: 'Tax Identification Number (TIN)', value: 'tax_identification_number_tin' },
  { label: 'Certificate of Incorporation', value: 'certificate_of_incorporation' },
  { label: 'Vendor Profile / Application Form', value: 'vendor_profile_application_form' },
  { label: 'Insurance Certificate', value: 'insurance_certificate' },
  { label: 'Bank Reference Letter', value: 'bank_reference_letter' },
  { label: 'Financial Statements or Audited Reports', value: 'financial_statements_or_audited_reports' }
];

 
  const vendor_document = Array.from({ length: 30 }).map(() => ({

    documentType: faker.helpers.arrayElement(documentTypes).value,
    documentUrl: facker.internet.url,
    description: faker.lorem.sentence(),

  }))     
    await db.insert(vendor_document).values(vendor_document);


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
   status : true,
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

   const vendorMedia = Array.from({ length: 30 }).map(() => ({
    mediaType : faker.helpers.arrayElement(mediaTypeEnum.enumValues),
    mediaUrl: faker.internet.url,
    altText:faker.lorem.words(5),
    sortOrder: faker.number.int({ min: 1, max: 100 }),


   }))
 
    await db.insert(vendorMedia).values(vendorMedia);


}

export async function seedvendorContacts() {
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
   const vendorContacts = Array.from({ length: 30 }).map(() => ({
    permissions: faker.helpers.arrayElements(allPermissions),
    department: faker.lorem.word(),
    employeeCode: faker.string.alphanumeric(8).toUpperCase(),
    isActive: true,
    bio: faker.lorem.sentence(),


   }))
 
    await db.insert(vendorContacts).values(vendorContacts);


}


export async function seedvendorMedia() {

   const vendorMedia = Array.from({ length: 30 }).map(() => ({
    mediaType : faker.helpers.arrayElement(mediaTypeEnum.enumValues),
    mediaUrl: faker.internet.url,
    altText:faker.lorem.words(5),
    sortOrder: faker.number.int({ min: 1, max: 100 }),


   }))
 
    await db.insert(vendorMedia).values(vendorMedia);

}

export async function seedpriceBooking() {
    const start = faker.date.past();

   const priceBooking = Array.from({ length: 30 }).map(() => ({
    isStandard: true,
    isActive: true,
    name: faker.commerce.productName(), 
    description: faker.lorem.words(3),
    startDate: start,
    endDate: faker.date.between({ from: start, to: new Date() })
   }))
 
    await db.insert(priceBooking).values(priceBooking);

}

export async function seedpriceBookingEntry() {

   const priceBookingEntry = Array.from({ length: 30 }).map(() => ({
    currency: faker.finance.currencyCode(),
    lowerSlab: faker.number.int({ min: 1, max: 50 }),
    upperSlab: faker.number.int({ min: lowerSlab, max: lowerSlab + 50 }),
    listPrice: faker.number.float({min: 50, max: 10000, precision: 0.01,}),
    discountPercentage: faker.number.float({ min: 0, max: 50, precision: 0.01 }),
    salePrice: faker.commerce.price() ,
   }))
 
    await db.insert(priceBookingEntry).values(priceBookingEntry);

}


export async function seedproductType() {

   const productType = Array.from({ length: 30 }).map(() => ({
    name: faker.commerce.department(),
    description: faker.lorem.sentence(),
   }))
 
    await db.insert(productType).values(productType);

}

export async function seedproducts() {

   const products = Array.from({ length: 30 }).map(() => ({
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    latitude: faker.location.latitude().toString(),
    longitude: faker.location.longitude().toString(),
    isAvailable: true,
    isDiscountScheduled: true,
    pricingType: faker.helpers.arrayElement(productTypeEnum.enumValues),
    percentage: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    minQuantity: faker.number.int({ min: 1, max: 30 }),
    maxQuantity: faker.number.int({ min: 31, max: 50 }),
    status: true,


   }))
 
    await db.insert(products).values(products);

}



export async function seedfeaturedCategoryProduct() {

   const featuredCategoryProduct = Array.from({ length: 30 }).map(() => ({
    name: faker.lorem.word(),
    description:faker.lorem.paragraph(),
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
     postalCode : faker.location.zipCode(),
   }))
 
    await db.insert(productAvailableArea).values(productAvailableArea);

}


export async function seedproductMedia() {

   const productMedia = Array.from({ length: 30 }).map(() => ({
    mediaType : faker.helpers.arrayElement(mediaTypeEnum.enumValues),
    mediaUrl: faker.image.url(),
    altText: faker.lorem.words(4),
    sortOrder: faker.number.int({ min: 1, max: 100 }),

   }))
 
    await db.insert(productMedia).values(productMedia);

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
     platformFees : faker.number.float({ min: 1,max: 200,precision: 0.01 }),

}))
 
    await db.insert(contractProductType).values(contractProductType);

}


import * as vendor from './vendor.js';
import * as user from './user.js';
import * as event from './event.js';
import * as enums from './enum.js';
// import { geographyPoint } from './drizzle.customType.js';
// import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const mediaTypeEnum = enums.mediaTypeEnum;
export const productTypeEnum = enums.productTypeEnum;
export const productPricingTypeEnum = enums.productPricingTypeEnum;
export const userSubscriptionStatusEnum = enums.userSubscriptionStatusEnum;
export const bookingStatusEnum = enums.bookingStatusEnum;
export const paymentStatusEnum = enums.paymentStatusEnum;
export const eventStatusEnum = enums.eventStatusEnum;
export const vendorStatusEnum = enums.vendorStatusEnum;

export const userTypes = user.userType;
export const users = user.user;
export const userNotifications = user.userNotification;
export const userAddresses = user.userAddress;
export const subscriptions = user.subscription;
export const cart = user.cart;
export const cartItems = user.cartItem;
export const cartBookings = user.cartBooking;
export const cartItemBookings = user.cartItemBooking;
export const reviews = user.review;
export const reviewMedia = user.reviewMedia;
export const pricingSettings = user.pricingSetting;
export const taxZones = user.taxZone;
export const payments = user.payment;
export const paymentTransactions = user.paymentTransaction;

export const eventType = event.eventType;
export const eventProductType = event.eventProductType;
export const events = event.event;
export const eventItems = event.eventItem;
export const eventBooking = event.eventBooking;
export const eventProductOrders = event.eventProductOrder;
export const featuredEvents = event.featuredEvent;
export const featuredBanners = event.featuredBanners;

export const vendors = vendor.vendor;
export const vendorNotifications = vendor.vendorNotification;
export const vendorOwnerships = vendor.vendorOwnership;
export const vendorDocuments = vendor.vendorDocument;
export const vendorInvites = vendor.vendorInvite;
export const vendorEmployeeRequests = vendor.vendorEmployeeRequest;
export const vendorMedias = vendor.vendorMedia;
export const vendorEmployees = vendor.vendorEmployee;
export const vendorContracts = vendor.vendorContract;
export const priceBook = vendor.priceBook;
export const priceBookEntry = vendor.priceBookEntry;
export const productTypes = vendor.productType;
export const products = vendor.product;
export const featuredCategorys = vendor.featuredCategory;
export const featuredProdcuts = vendor.featuredProdcut;
export const productMedia = vendor.productMedia;
export const productAddons = vendor.productAddon;
export const contractProductTypes = vendor.contractProductType;
// export const contractProductType = vendor.contractProductType;
// export const featuredCategoryProducts = vendor.featuredCategoryProduct;

// export const testAddressVendor = pgTable(
//     "test_address_vendor",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),
//         radiusMiles: integer("radius_miles").notNull().default(10),

//         // PostGIS point (geography)

//         // remove location from Drizzle schema completely
//         // location: varchar("location", { length: 255 }),

//         createdAt: timestamp("created_at").defaultNow(),
//     }
// );

// export const testAddressUser = pgTable(
//     "test_address_user",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),

//         street: varchar("street", { length: 255 }),
//         city: varchar("city", { length: 100 }),
//         state: varchar("state", { length: 50 }),
//         postalCode: varchar("postal_code", { length: 10 }),

//         // PostGIS point
//         // remove location from Drizzle schema completely

//         // location: varchar("location", { length: 255 }),
//     }
// );

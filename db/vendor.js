import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './user.js';
import {
  mediaTypeEnum,
  productPricingTypeEnum,
  productTypeEnum,
} from './enum.js';

export const vendors = pgTable('vendors', {
  vendorId: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  // userId: uuid("user_id").references(() => users.userId, { onDelete: "cascade" }), // optional
  businessName: varchar('business_name', { length: 255 }).notNull(),
  websiteURL: varchar('website_url', { length: 255 }),
  DBAname: varchar('dba_name', { length: 255 }),
  serviceLine: varchar('service_line', { length: 255 }),

  createdBy: integer('created_by').references(() => users.userId),

  incorporationYear: integer('incorporation_year'),
  workingTime: varchar('working_time', { length: 255 }),

  contactName: varchar('contact_name', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactNumber: varchar('contact_number', { length: 50 }),

  // pictures
  linkedinURL: varchar('linkedin_url', { length: 255 }),
  youtubeURL: varchar('youtube_url', { length: 255 }),
  facebookURL: varchar('facebook_url', { length: 255 }),
  email: varchar('email', { length: 255 }),

  // address
  addressLine1: varchar('address_line1', { length: 255 }),
  addressLine2: varchar('address_line2', { length: 255 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),

  // ownership Information
  ownerName: varchar('owner_name', { length: 255 }).array(),
  SSN: varchar('ssn', { length: 255 }),
  authorizedSignatoryName: varchar('authorized_signatory_name', {
    length: 255,
  }),
  ETINnumber: varchar('etin_number', { length: 255 }),

  // Bank Account Information
  bankName: varchar('bank_name', { length: 255 }),
  accountHolderName: varchar('account_holder_name', { length: 255 }),
  accountNumber: varchar('account_number', { length: 255 }),
  routingNumber: varchar('routing_number', { length: 255 }),

  // logo
  logoUrl: varchar('logo_url', { length: 500 }),
  description: varchar('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const vendorInvite = pgTable('vendor_invite', {
  vendorInviteId: integer('vendor_invite_id')
    .generatedAlwaysAsIdentity()
    .primaryKey(),
  vendorId: integer('vendor_id').references(() => vendors.vendorId),
  email: varchar('email', { length: 255 }),
  token: varchar('token', { length: 255 }),
  inviteCode: varchar('invite_code', { length: 255 }),
  status: varchar('status', { length: 255 }),
  permissions: text('permissions').array(),
  employeeCode: varchar('employee_code', { length: 100 }),

  createdAt: timestamp('created_at').defaultNow(),
});

export const vendorEmployeeRequest = pgTable('vendor_employee_request', {
  vendorEmployeeRequestId: integer('vendor_employee_request_id')
    .generatedAlwaysAsIdentity()
    .primaryKey(),
  vendorId: integer('vendor_id').references(() => vendors.vendorId),
  userId: integer('user_id').references(() => users.userId),
  status: boolean('status').default(false).notNull(),
  note: text('note'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const vendorMedia = pgTable('vendor_media', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  vendorId: integer('vendor_id').references(() => vendors.vendorId),

  mediaType: mediaTypeEnum('media_type').notNull(),
  mediaUrl: varchar('media_url', { length: 255 }),
  altText: varchar('alt_text', { length: 255 }),
  sortOrder: integer('sort_order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const vendorContacts = pgTable('vendor_contacts', {
  vendorContactId: integer('vendor_contact_id')
    .generatedAlwaysAsIdentity()
    .primaryKey(),
  userId: integer('user_id')
    .references(() => users.userId)
    .notNull()
    .unique(),

  vendorId: integer('vendor_id').references(() => vendors.vendorId),

  // portalRole: varchar('portal_role', { length: 100 }), // e.g., "isAdmin"
  permissions: text('permissions').array(),
  department: varchar('department', { length: 100 }),
  employeeCode: varchar('employee_code', { length: 100 }),
  isActive: boolean('is_active').default(false).notNull(),
  bio: varchar('bio'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const priceBooking = pgTable('price_booking', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  vendorId: integer('vendor_id').references(() => vendors.vendorId),
  name: varchar('name', { length: 255 }),
  status: boolean('status').default(true).notNull(),
  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date').defaultNow(),
});

export const priceBookingEntry = pgTable('price_booking_entry', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  productId: integer('product_id').references(() => products.productId),
  priceBookingId: integer('price_booking_id').references(
    () => priceBooking.id,
    { onDelete: 'cascade' }
  ),
  currency: varchar('currency', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productType = pgTable('product_types', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  productParentId: integer('product_parent_id').references(
    () => productType.id
  ),
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),
});

export const products = pgTable('products', {
  productId: integer('product_id').generatedAlwaysAsIdentity().primaryKey(),

  type: productTypeEnum('type').notNull(),

  vendorId: integer('vendor_id').references(() => vendors.vendorId),
  productTypeId: integer('product_type_id').references(() => productType.id),

  title: varchar('title', { length: 255 }),
  description: varchar('description'),

  latitude: varchar('latitude', { length: 255 }),
  longitude: varchar('longitude', { length: 255 }),

  isAvailable: boolean('is_available').default(true),
  currentPriceBook: integer('current_price_book').references(
    () => priceBooking.id
  ),

  isDiscountScheduled: boolean('is_discount_scheduled').default(false),

  pricingType: productPricingTypeEnum('pricing_type').notNull(),

  percentage: decimal('percentage', { precision: 5, scale: 2 }),

  minQuantity: integer('min_quantity').default(1).notNull(),
  maxQuantity: integer('max_quantity'),

  status: boolean('status').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const featuredCategoryProduct = pgTable('featured_category_product', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  name: varchar('name', { length: 255 }), // -- e.g. 'featured', 'most_popular', 'trending'
  description: varchar('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const featuredProdcuts = pgTable('featured_products', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  productId: integer('product_id').references(() => products.productId, {
    onDelete: 'cascade',
  }),
  featuredCategoryId: integer('featured_category_id').references(
    () => featuredCategoryProduct.id,
    {
      onDelete: 'cascade',
    }
  ),
  priority: integer('priority').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productAvailableArea = pgTable('product_available_area', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  productId: integer('product_id').references(() => productType.id),
  postalCode: varchar('postal_code', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productMedia = pgTable('product_media', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  productId: integer('product_id').references(() => products.productId),

  mediaType: mediaTypeEnum('media_type').notNull(),
  mediaUrl: varchar('media_url', { length: 255 }),
  altText: varchar('alt_text', { length: 255 }),
  sortOrder: integer('sort_order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const productAddons = pgTable('product_addons', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  mainProductId: integer('main_product_id').references(
    () => products.productId
  ),
  addonProductId: integer('addon_product_id').references(
    () => products.productId
  ),
});

export const discountScheduled = pgTable('discount_scheduled', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  productId: integer('product_id').references(() => productType.id),
  name: varchar('name', { length: 255 }),
  lowerBound: decimal('lower_bound', { precision: 10, scale: 2 }),
  upperBound: decimal('upper_bound', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 255 }),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const contractProductType = pgTable('contract_product_type', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  productTypeId: integer('product_type_id').references(() => productType.id),
  vendorId: integer('vendor_id').references(() => vendors.vendorId),

  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date').defaultNow(),

  adminCommissionPercentage: decimal('admin_commission_percentage', {
    precision: 10,
    scale: 2,
  }),

  platformFees: decimal('platform_fees', {
    precision: 10,
    scale: 2,
  }),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

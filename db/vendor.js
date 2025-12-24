import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { user } from './user.js';
import {
  mediaTypeEnum,
  productPricingTypeEnum,
  productTypeEnum,
  vendorStatusEnum,
} from './enum.js';

export const vendor = pgTable('vendor', {
  vendorId: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  businessName: varchar('business_name', { length: 255 }),
  websiteURL: varchar('website_url', { length: 255 }),
  logoUrl: varchar('logo_url', { length: 500 }),
  description: varchar('description'),
  DBAname: varchar('dba_name', { length: 255 }),
  legalEntityName: varchar('legal_entity_name', { length: 255 }),
  einNumber: integer('ein_number'),
  businessType: varchar('business_type', { length: 255 }),
  incorporationDate: timestamp('incorporation_date'),

  // Address
  streetAddressLine1: varchar('street_address_line1', { length: 255 }),
  streetAddressLine2: varchar('street_address_line2', { length: 255 }),
  zipcode: varchar('zipcode', { length: 20 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }),
  // location: varchar('location', { length: 255 }),
  latitude: varchar('latitude', { length: 255 }),
  longitude: varchar('longitude', { length: 255 }),

  // Admin of company
  createdBy: integer('created_by').references(() => user.userId),

  // Contact
  primaryContactName: varchar('primary_contact_name', { length: 255 }),
  primaryContactEmail: varchar('primary_contact_email', { length: 255 }),
  primaryPhoneNumber: varchar('primary_phone_number', { length: 50 }),
  // socials
  youtubeURL: varchar('youtube_url', { length: 255 }),
  facebookURL: varchar('facebook_url', { length: 255 }),
  linkedinURL: varchar('linkedin_url', { length: 255 }),
  instagramURL: varchar('instagram_url', { length: 255 }),

  // Account information
  bankName: varchar('bank_name', { length: 255 }),
  bankAccountNumber: varchar('bank_account_number', { length: 255 }),
  payeeName: varchar('payee_name', { length: 255 }),
  bankType: varchar('bank_type', { length: 255 }),
  routingNumber: varchar('routing_number', { length: 255 }),

  authorizedSignatory: integer('authorized_signatory').references(
    () => vendorOwnership.id
  ),

  // status
  status: vendorStatusEnum('status').notNull().default('pending_admin'),
  isAdminApproved: boolean('is_admin_approved').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const vendorNotification = pgTable('vendor_notification', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  vendorId: integer('vendor_id').references(() => vendor.vendorId),
  userId: integer('user_id').references(() => user.userId),
  title: varchar('title', { length: 255 }),
  message: varchar('message', { length: 255 }),
  status: boolean('status').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const vendorOwnership = pgTable('vendor_ownership', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),

  vendorId: integer('vendor_id').references(() => vendor.vendorId),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  ssnNumber: integer('ssn_number'),

  // Address
  streetAddressLine1: varchar('street_address_line1', { length: 255 }),
  streetAddressLine2: varchar('street_address_line2', { length: 255 }),
  zipcode: varchar('zipcode', { length: 20 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }),

  isAuthorizedSignature: boolean('is_authorized_signature').default(false),
  ownershipPercentage: decimal('ownership_percentage', {
    precision: 5,
    scale: 2,
  }),

  createdAt: timestamp('created_at').defaultNow(),
});

export const vendorDocument = pgTable('vendor_document', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  vendorId: integer('vendor_id').references(() => vendor.vendorId),
  documentType: varchar('document_type', { length: 255 }),
  documentUrl: varchar('document_url', { length: 255 }),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const vendorInvite = pgTable('vendor_invite', {
  vendorInviteId: integer('vendor_invite_id')
    .generatedAlwaysAsIdentity()
    .primaryKey(),
  vendorId: integer('vendor_id').references(() => vendor.vendorId),
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
  vendorId: integer('vendor_id').references(() => vendor.vendorId),
  userId: integer('user_id').references(() => user.userId),
  status: boolean('status').default(false).notNull(),
  note: text('note'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const vendorMedia = pgTable('vendor_media', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  vendorId: integer('vendor_id').references(() => vendor.vendorId),

  mediaType: mediaTypeEnum('media_type').notNull(),
  mediaUrl: varchar('media_url', { length: 255 }),
  altText: varchar('alt_text', { length: 255 }),
  sortOrder: integer('sort_order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const vendorEmployee = pgTable('vendor_employee', {
  vendorEmployeeId: integer('vendor_employee_id')
    .generatedAlwaysAsIdentity()
    .primaryKey(),

  userId: integer('user_id')
    .references(() => user.userId)
    .notNull()
    .unique(),

  vendorId: integer('vendor_id').references(() => vendor.vendorId),

  // portalRole: varchar('portal_role', { length: 100 }), // e.g., "isAdmin"
  permissions: text('permissions').array(),
  department: varchar('department', { length: 100 }),
  employeeCode: varchar('employee_code', { length: 100 }),
  isActive: boolean('is_active').default(false).notNull(),
  bio: varchar('bio'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const vendorContract = pgTable('vendor_contract', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  vendorId: integer('vendor_id').references(() => vendor.vendorId),
  contractType: varchar('contract_type', { length: 255 }),
  adminCommissionPercentage: decimal('admin_commission_percentage', {
    precision: 5,
    scale: 2,
  }),
  platformFees: decimal('platform_fees', {
    precision: 10,
    scale: 2,
  }),
  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const priceBook = pgTable('price_book', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  vendorId: integer('vendor_id').references(() => vendor.vendorId),

  isStandard: boolean('is_standard').default(false).notNull(),
  isActive: boolean('is_active').default(false).notNull(),

  name: varchar('name', { length: 255 }),
  description: varchar(),

  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date').defaultNow(),
});

export const priceBookEntry = pgTable('price_book_entry', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment

  productId: integer('product_id').references(() => product.productId),
  priceBookingId: integer('price_booking_id').references(() => priceBook.id, {
    onDelete: 'cascade',
  }),

  currency: varchar('currency', { length: 255 }),

  lowerSlab: integer('lower_slab'),
  upperSlab: integer('upper_slab'),

  listPrice: decimal('list_price', { precision: 10, scale: 2 }),

  discountPercentage: decimal('discount_percentage', {
    precision: 10,
    scale: 2,
  }),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),

  createdAt: timestamp('created_at').defaultNow(),
});

export const productType = pgTable('product_types', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  productParentId: integer('product_parent_id').references(
    () => productType.id
  ),
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),
  mediaURL: varchar('media_url', { length: 255 }),
  altText: varchar('alt_text', { length: 255 }),
  isNewProductApproval: boolean('is_new_product_approval').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const product = pgTable('product', {
  productId: integer('product_id').generatedAlwaysAsIdentity().primaryKey(),

  type: productTypeEnum('type').notNull().default('product'),

  vendorId: integer('vendor_id').references(() => vendor.vendorId),
  productTypeId: integer('product_type_id').references(() => productType.id),

  title: varchar('title', { length: 255 }),
  description: varchar('description'),

  latitude: varchar('latitude', { length: 255 }),
  longitude: varchar('longitude', { length: 255 }),
  // location: varchar('location', { length: 255 }),
  deliveryRadius: integer('delivery_radius').default(10),

  isAvailable: boolean('is_available').default(true),
  currentPriceBook: integer('current_price_book').references(
    () => priceBook.id
  ),

  pricingType: productPricingTypeEnum('pricing_type').notNull(),

  minQuantity: integer('min_quantity').default(1).notNull(),
  maxQuantity: integer('max_quantity'),

  status: boolean('status').default(true).notNull(),
  rating: integer('rating').default(4).notNull(),
  bannerImage: varchar('banner_image', { length: 255 }),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const featuredCategory = pgTable('featured_category', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  name: varchar('name', { length: 255 }), // -- e.g. 'featured', 'most_popular', 'trending'
  description: varchar('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const featuredProdcut = pgTable('featured_product', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  productId: integer('product_id').references(() => product.productId, {
    onDelete: 'cascade',
  }),
  featuredCategoryId: integer('featured_category_id').references(
    () => featuredCategory.id,
    {
      onDelete: 'cascade',
    }
  ),
  priority: integer('priority').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// export const productAvailableArea = pgTable('product_available_area', {
//   id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
//   productId: integer('product_id').references(() => productType.id),
//   postalCode: varchar('postal_code', { length: 255 }),
//   createdAt: timestamp('created_at').defaultNow(),
// });

export const productMedia = pgTable('product_media', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  productId: integer('product_id').references(() => product.productId),

  mediaType: mediaTypeEnum('media_type').notNull(),
  mediaUrl: varchar('media_url', { length: 255 }),
  altText: varchar('alt_text', { length: 255 }),
  sortOrder: integer('sort_order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const productAddon = pgTable('product_addon', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  mainProductId: integer('main_product_id').references(() => product.productId),
  addonProductId: integer('addon_product_id').references(
    () => product.productId
  ),
});

// export const discountScheduled = pgTable('discount_scheduled', {
//   id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
//   productId: integer('product_id').references(() => productType.id),
//   name: varchar('name', { length: 255 }),
//   lowerBound: decimal('lower_bound', { precision: 10, scale: 2 }),
//   upperBound: decimal('upper_bound', { precision: 10, scale: 2 }),
//   currency: varchar('currency', { length: 255 }),

//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow(),
// });

export const contractProductType = pgTable('contract_product_type', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(), // auto-increment
  productTypeId: integer('product_type_id').references(() => productType.id),
  vendorId: integer('vendor_id').references(() => vendor.vendorId),

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

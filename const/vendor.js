import { vendors } from '../db/schema.js';

export const commonVendorFields = {
  vendorId: vendors.vendorId,
  businessName: vendors.businessName,
  websiteURL: vendors.websiteURL,
  DBAname: vendors.DBAname,
  serviceLine: vendors.serviceLine,

  contactName: vendors.contactName,
  contactEmail: vendors.contactEmail,
  contactNumber: vendors.contactNumber,

  linkedinURL: vendors.linkedinURL,
  youtubeURL: vendors.youtubeURL,
  facebookURL: vendors.facebookURL,

  email: vendors.email,

  addressLine1: vendors.addressLine1,
  city: vendors.city,
  state: vendors.state,
  country: vendors.country,
  postalCode: vendors.postalCode,

  logoUrl: vendors.logoUrl,
  description: vendors.description,
  createdAt: vendors.createdAt,
};

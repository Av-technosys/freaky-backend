import { vendors } from '../db/schema.js';


export const commonVendorFields = {
  vendorId: vendors.vendorId,
  legalEntityName: vendors.legalEntityName,
  DBAname: vendors.DBAname,
  businessType: vendors.businessType,
  incorporationDate: vendors.incorporationDate,

  websiteURL: vendors.websiteURL,
  description: vendors.description,
  logoUrl: vendors.logoUrl,

  // Contact (correct field names!)
  primaryContactName: vendors.primaryContactName,
  primaryContactEmail: vendors.primaryContactEmail,
  primaryPhoneNumber: vendors.primaryPhoneNumber,

  // Social links
  linkedinURL: vendors.linkedinURL,
  youtubeURL: vendors.youtubeURL,
  facebookURL: vendors.facebookURL,
  instagramURL: vendors.instagramURL,

  // Address (match EXACTLY)
  streetAddressLine1: vendors.streetAddressLine1,
  streetAddressLine2: vendors.streetAddressLine2,
  zipcode: vendors.zipcode,
  city: vendors.city,
  state: vendors.state,
  country: vendors.country,

  createdAt: vendors.createdAt,
  updatedAt: vendors.updatedAt,
};

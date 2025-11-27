import { vendors } from '../db/schema.js';

// export const commonVendorFields = {
//   vendorId: vendors.vendorId,
//   businessName: vendors.businessName,
//   websiteURL: vendors.websiteURL,
//   DBAname: vendors.DBAname,
//   serviceLine: vendors.serviceLine,

//   contactName: vendors.contactName,
//   contactEmail: vendors.contactEmail,
//   contactNumber: vendors.contactNumber,

//   linkedinURL: vendors.linkedinURL,
//   youtubeURL: vendors.youtubeURL,
//   facebookURL: vendors.facebookURL,

//   email: vendors.email,

//   addressLine1: vendors.addressLine1,
//   city: vendors.city,
//   state: vendors.state,
//   country: vendors.country,
//   postalCode: vendors.postalCode,

//   logoUrl: vendors.logoUrl,
//   description: vendors.description,
//   createdAt: vendors.createdAt,
// };


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

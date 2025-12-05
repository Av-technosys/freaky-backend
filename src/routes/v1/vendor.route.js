import { Router } from 'express';
import {
  createVendor,
  createVendorEmpRequest,
  getCompanyProfile,
  listAllVendors,
  updateAddressDetails,
  updateBankDetails,
  updateCompanyDetails,
  updateContactDetails,
  updateOwnershipDetails,
  fetchVendorProducts,
  getAllFeaturedCategories,
} from '../../controllers/Vendor.controllers.js';
import { checkVendor } from '../../middleware/vendor.middleware.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';

const router = Router();

router.get(
  '/company_profile',
  confirmUserToken,
  checkVendor,
  getCompanyProfile
);
router.get('/vendors', listAllVendors);
router.post('/cerate_vendor', confirmUserToken, createVendor);
// router.get('/update_vendor', confirmUserToken, updateVendor);
router.post(
  '/create_vendor_emp_request',
  confirmUserToken,
  createVendorEmpRequest
);
router.put('/address', confirmUserToken, updateAddressDetails);
router.put('/bank_details', confirmUserToken, updateBankDetails);
router.put('/contact_details', confirmUserToken, updateContactDetails);
router.put('/company_details', confirmUserToken, updateCompanyDetails);
router.put('/ownership_details', confirmUserToken, updateOwnershipDetails);
// router.get("/create_vendor_emp_request", createVendorEmpRequest);

router.get('/vendor_products/:vendorId', confirmUserToken, fetchVendorProducts);

router.get('/featured_categories', confirmUserToken, getAllFeaturedCategories);

export default router;

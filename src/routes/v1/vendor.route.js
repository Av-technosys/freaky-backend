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
  fetchProductPrice,
  fetchAllProductTypes,
  listProductsByType,
  getAllProductsByCategoryId,
  getAllFeaturedCategories,
  fetchProductByProductId,
} from '../../controllers/Vendor.controllers.js';
import { checkVendor } from '../../middleware/vendor.middleware.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';

const router = Router();

router.get(
  '/get_company_profile',
  confirmUserToken,
  checkVendor,
  getCompanyProfile
);
router.get('/list_all_vendors', listAllVendors);
router.post('/cerate_vendor', confirmUserToken, createVendor);
// router.get('/update_vendor', confirmUserToken, updateVendor);
router.post(
  '/create_vendor_emp_request',
  confirmUserToken,
  createVendorEmpRequest
);
router.put('/update_address', confirmUserToken, updateAddressDetails);
router.put('/update_bank_details', confirmUserToken, updateBankDetails);
router.put('/update_contact_details', confirmUserToken, updateContactDetails);
router.put('/update_company_details', confirmUserToken, updateCompanyDetails);
router.put(
  '/update_ownership_details',
  confirmUserToken,
  updateOwnershipDetails
);
// router.get("/create_vendor_emp_request", createVendorEmpRequest);

router.post(
  '/get_vendor_products/:vendorId',
  confirmUserToken,
  fetchVendorProducts
);
router.post(
  '/get_product_price/:productId',
  confirmUserToken,
  fetchProductPrice
);

router.get('/list_product_type', confirmUserToken, fetchAllProductTypes);
router.get('/get_product_by_id', confirmUserToken, listProductsByType);

router.get(
  '/get_products_by_categoryId/:categoryId',
  confirmUserToken,
  getAllProductsByCategoryId
);

router.get(
  '/get_all_featured_categories',
  confirmUserToken,
  getAllFeaturedCategories
);

router.get(
  '/get_product_by_product_type_id/:productTypeId',
  confirmUserToken,
  fetchProductByProductId
);
export default router;

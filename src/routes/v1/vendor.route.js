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
  getVendorInfo,
  listAllPriceBooksById,
  deletePriceBookById,
  updatePriceBookById,
  createVendorDocument,
  getVendorCompanyInfo,
  getVendorDocuments,
  deleteVendorDocument,
  getVendorOwnershipDetails,
  updateVendorDocument,
  getVendorEmployees,
  updateEmployeePermissions,
  deleteVendorEmployee,
  createVendorEmployeeInvitation,
} from '../../controllers/Vendor.controllers.js';
import { checkVendor } from '../../middleware/vendor.middleware.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import { getAllProducts } from '../../controllers/product.controller.js';

const router = Router();

router.get(
  '/company_profile',
  confirmUserToken,
  checkVendor,
  getCompanyProfile
);
router.get('/details/:id', confirmUserToken, getVendorInfo);
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
router.get('/pricebooks/:id', confirmUserToken, listAllPriceBooksById);
router.delete('/pricebook/:priceBookId', confirmUserToken, deletePriceBookById);
router.put('/pricebook/:priceBookId', confirmUserToken, updatePriceBookById);
router.get('/products', confirmUserToken, getAllProducts);
router.post('/create_document', confirmUserToken, createVendorDocument);
router.put('/update_document', confirmUserToken, updateVendorDocument);
router.get('/documents', confirmUserToken, getVendorDocuments);
router.delete('/document/:id', confirmUserToken, deleteVendorDocument);
router.get('/vendor_details', confirmUserToken, getVendorCompanyInfo);
router.get('/ownership_details', confirmUserToken, getVendorOwnershipDetails);
router.get('/employees', confirmUserToken, getVendorEmployees);
router.post(
  '/invite_employees',
  confirmUserToken,
  createVendorEmployeeInvitation
);
router.put(
  '/update_employee_permissions/:employeeId',
  confirmUserToken,
  updateEmployeePermissions
);
router.delete('/employee/:id', confirmUserToken, deleteVendorEmployee);

export default router;

import { Router } from 'express';
import {
  createVendor,
  createVendorEmpRequest,
  getCompanyProfile,
  listAllVendors,
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
  getVendorInvites,
  requestedVendors,
  createVendorEmployeeRequest,
  updateBankDetails,
  updateContactDetails,
  updateCompanyDetails,
  updateOwnershipDetails,
  updateAddressDetails,
  createCompanyDetails,
  listAllPriceBooks,
  listAllServicesByPricebookId,
  getAllProdcutMeta,
} from '../../controllers/Vendor.controllers.js';
import { checkVendor } from '../../middleware/vendor.middleware.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import { getAllProducts } from '../../controllers/product.controller.js';
import vendorReviewRouter from './vendor.review.router.js';
import vendorcalendarRouter from './vendor.calendar.route.js';
import vendorPricebookRouter from './vendor.pricrbook.route.js';
import { signUp } from '../../utils/email/signup.js';
import { sendMail } from '../../utils/email/sendMail.js';
import { bookingConfirmed } from '../../utils/email/bookingConfirmed.js';
const router = Router();

router.get(
  '/company_profile',
  confirmUserToken,
  checkVendor,
  getCompanyProfile
);
router.use('/review', vendorReviewRouter);
router.use('/calendar', vendorcalendarRouter);
router.use('/pricebook', vendorPricebookRouter);

router.get('/details/:id', confirmUserToken, getVendorInfo);
router.get('/product/meta', confirmUserToken, getAllProdcutMeta);
router.get('/vendors', listAllVendors);
router.post('/cerate_vendor', confirmUserToken, createVendor);
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

router.post('/company_details', confirmUserToken, createCompanyDetails);

router.get('/vendor_products/:vendorId', confirmUserToken, fetchVendorProducts);

router.get('/featured_categories', confirmUserToken, getAllFeaturedCategories);
router.get('/pricebooks/:id', confirmUserToken, listAllServicesByPricebookId);
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
router.post('/send_mail', async (req, res) => {
  const { name, email, number } = req.body;
  console.log(name, email, number);
  try {
    // await sendMail({ to: email, subject: 'Hello', body: signUp(name) });
    await sendMail({
      to: email,
      subject: 'Booking confirmed',
      body: bookingConfirmed(),
    });
    console.log('mail sent');
    return res.status(200).json({ message: 'Mail sent successfully.' });
  } catch (error) {
    console.log(' error: ', error);
    return res.status(500).json({ message: 'Error sending mail.' });
  }
});
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
router.get('/invites', confirmUserToken, getVendorInvites);
router.get('/request_vendors', requestedVendors);
router.post('/employee_request', confirmUserToken, createVendorEmployeeRequest);

export default router;

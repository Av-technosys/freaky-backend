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
  getVendorNotifications,
  getAllSearchItems,
} from '../../controllers/Vendor.controllers.js';
import { checkVendor } from '../../middleware/vendor.middleware.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import { getAllProducts } from '../../controllers/product.controller.js';
import vendorReviewRouter from './vendor.review.router.js';
import vendorcalendarRouter from './vendor.calendar.route.js';
import { signUp } from '../../utils/email/signup.js';
import { sendMail } from '../../utils/email/sendMail.js';
import { welcome } from '../../utils/email/welcome.js';
import { bookingConfirmed } from '../../utils/email/bookingConfirmation.js';
import { shareFeedback } from '../../utils/email/shareFeedback.js';
import { refund } from '../../utils/email/refund.js';
import { completePayment } from '../../utils/email/completePayment.js';
import { completeProfileVendor } from '../../utils/email/completeProfileVendor.js';
const router = Router();

router.get(
  '/company_profile',
  confirmUserToken,
  checkVendor,
  getCompanyProfile
);
router.use('/review', vendorReviewRouter);
router.use('/calendar', vendorcalendarRouter);
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

router.post('/company_details', confirmUserToken, createCompanyDetails);
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
router.post('/send_mail', async (req, res) => {
  const { name, email, number } = req.body;
  console.log(name, email, number);
  try {
    // await sendMail({
    //   to: email,
    //   subject: 'bookingConfirmeds',
    //   body: bookingConfirmed(name),
    // }); //
    // await sendMail({ to: email, subject: 'signup', body: signUp(name) });
    // await sendMail({ to: email, subject: 'welcome', body: welcome(name) }); // ✅
    // await sendMail({
    //   to: email,
    //   subject: 'completeProfileVendor',
    //   body: completeProfileVendor(name),
    // }); // ✅
    // await sendMail({
    //   to: email,
    //   subject: 'shareFeedback',
    //   body: shareFeedback(name),
    // }); //✅
    // await sendMail({
    //   to: email,
    //   subject: 'completePayment',
    //   body: completePayment(name),
    // }); //✅
    await sendMail({
      to: email,
      subject: 'refund',
      body: refund(name),
    }); //
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
router.get('/notifications', confirmUserToken, getVendorNotifications);
router.get('/searchitems', confirmUserToken, getAllSearchItems);

export default router;

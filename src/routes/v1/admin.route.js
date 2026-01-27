import { Router } from 'express';
import {
  adminResetPassword,
  createEventType,
  createProductType,
  deleteEventTypeById,
  deleteProductTypeById,
  deleteReviewById,
  getAllProductTypes,
  getAllUserReviews,
  listAllRejectedVendors,
  listAllRequestedVendors,
  listAllUsers,
  listAllVendors,
  updateEventTypeById,
  updateFeaturedBannerPriority,
  updateProductTypeById,
  updateVendorStatus,
  userDetailsById,
  vendorDetailsById,
} from '../../controllers/admin.controllers.js';
import {
  getBanner,
  listAllEventTypes,
} from '../../controllers/Event.controller.js';

const router = Router();

router.post('/reset_user_password', adminResetPassword);
router.get('/requested_vendors', listAllRequestedVendors);
router.get('/rejected_vendors', listAllRejectedVendors);
router.get('/vendors', listAllVendors);
router.get('/vendor_details/:vendorId', vendorDetailsById);
router.get('/users', listAllUsers);
router.get('/user_details/:userId', userDetailsById);
router.put('/update_status/:vendorId', updateVendorStatus);
router.get('/event_type', listAllEventTypes);
router.put('/event_type/:eventTypeId', updateEventTypeById);
router.post('/event_type', createEventType);
router.delete('/event_type/:eventTypeId', deleteEventTypeById);
router.get('/reviews', getAllUserReviews);
router.delete('/review/:reviewId', deleteReviewById);

router.post('/product_type', createProductType);
router.get('/product_types', getAllProductTypes);
router.put('/product_type/:productTypeId', updateProductTypeById);
router.delete('/product_type/:productTypeId', deleteProductTypeById);

router.get('/banner', getBanner);
router.put('/banner/:bannerId', updateFeaturedBannerPriority);

export default router;

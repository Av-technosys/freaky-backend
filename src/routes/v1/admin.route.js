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
  createFeaturedBanner,
  getBanner,
  listAllEventTypes,
} from '../../controllers/Event.controller.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';

const router = Router();

router.post('/reset_user_password', adminResetPassword);
router.get('/requested_vendors', confirmUserToken, listAllRequestedVendors);
router.get('/rejected_vendors', confirmUserToken, listAllRejectedVendors);
router.get('/vendors', confirmUserToken, listAllVendors);
router.get('/vendor_details/:vendorId', confirmUserToken, vendorDetailsById);
router.get('/users', confirmUserToken, listAllUsers);
router.get('/user_details/:userId', confirmUserToken, userDetailsById);
router.put('/update_status/:vendorId', confirmUserToken, updateVendorStatus);
router.get('/event_type', confirmUserToken, listAllEventTypes);
router.put('/event_type/:eventTypeId', confirmUserToken, updateEventTypeById);
router.post('/event_type', confirmUserToken, createEventType);
router.delete(
  '/event_type/:eventTypeId',
  confirmUserToken,
  deleteEventTypeById
);
router.get('/reviews', confirmUserToken, getAllUserReviews);
router.delete('/review/:reviewId', confirmUserToken, deleteReviewById);

router.post('/product_type', confirmUserToken, createProductType);
router.get('/product_types', confirmUserToken, getAllProductTypes);
router.put(
  '/product_type/:productTypeId',
  confirmUserToken,
  updateProductTypeById
);
router.delete(
  '/product_type/:productTypeId',
  confirmUserToken,
  deleteProductTypeById
);

router.get('/banner', confirmUserToken, getBanner);
router.post('/banner', confirmUserToken, createFeaturedBanner);
router.put('/banner/:bannerId', confirmUserToken, updateFeaturedBannerPriority);

export default router;

import { Router } from 'express';
import {
  adminResetPassword,
  createEventType,
  createFeaturedCategory,
  createFeaturedProduct,
  createProductType,
  deleteEventTypeById,
  deleteFeaturedBanner,
  deleteFeaturedCategory,
  deleteProductTypeById,
  deleteReviewById,
  getAllFeaturedProducts,
  getAllProductTypes,
  getAllUserReviews,
  getFeaturedCategory,
  listAllRejectedVendors,
  listAllRequestedVendors,
  listAllUsers,
  listAllVendors,
  updateEventTypeById,
  updateFeaturedBannerPriority,
  updateFeaturedCategory,
  updateFeaturedProductPriority,
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
router.delete('/banner/:bannerId', confirmUserToken, deleteFeaturedBanner);

router.get('/category', confirmUserToken, getFeaturedCategory);
router.post('/category', confirmUserToken, createFeaturedCategory);
router.put('/category/:categoryId', confirmUserToken, updateFeaturedCategory);
router.delete(
  '/category/:categoryId',
  confirmUserToken,
  deleteFeaturedCategory
);

router.get('/featured_products', confirmUserToken, getAllFeaturedProducts);
router.put(
  '/featured_product/:productId',
  confirmUserToken,
  updateFeaturedProductPriority
);
router.post('/featured_product', confirmUserToken, createFeaturedProduct);

export default router;

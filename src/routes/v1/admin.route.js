import { Router } from 'express';
import {
  adminResetPassword,
  createEventType,
  deleteEventTypeById,
  deleteReviewById,
  getAllUserReviews,
  listAllRequestedVendors,
  listAllUsers,
  listAllVendors,
  updateEventTypeById,
  updateVendorStatus,
  userDetailsById,
  vendorDetailsById,
} from '../../controllers/admin.controllers.js';
import { listAllEventTypes } from '../../controllers/Event.controller.js';

const router = Router();

router.post('/reset_user_password', adminResetPassword);
router.get('/requested_vendors', listAllRequestedVendors);
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

export default router;

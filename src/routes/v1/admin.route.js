import { Router } from 'express';
import {
  adminResetPassword,
  createEventType,
  deleteEventTypeById,
  listAllRequestedVendors,
  listAllUsers,
  listAllVendors,
  updateEventTypeById,
  updateVendorStatus,
} from '../../controllers/admin.controllers.js';
import { listAllEventTypes } from '../../controllers/Event.controller.js';

const router = Router();

router.post('/reset_user_password', adminResetPassword);
router.get('/vendors_for_adminpanel', listAllVendorsForAdminpanel);
router.put('/update_status/:vendorId', updateVendorStatus);
router.get('/event_type', listAllEventTypes);
router.put('/event_type/:eventTypeId', updateEventTypeById);
router.post('/event_type', createEventType);
router.delete('/event_type/:eventTypeId', deleteEventTypeById);

export default router;

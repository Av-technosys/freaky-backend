import { Router } from 'express';
import {
  adminResetPassword,
  listAllRequestedVendors,
  listAllUsers,
  listAllVendors,
  updateVendorStatus,
  userDetailsById,
  vendorDetailsById,
} from '../../controllers/admin.controllers.js';

const router = Router();

router.post('/reset_user_password', adminResetPassword);
router.get('/requested_vendors', listAllRequestedVendors);
router.get('/vendors', listAllVendors);
router.get('/vendor_details/:vendorId', vendorDetailsById);
router.get('/users', listAllUsers);
router.get('/user_details/:userId', userDetailsById);
router.put('/update_status/:vendorId', updateVendorStatus);

export default router;

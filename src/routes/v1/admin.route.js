import { Router } from 'express';
import {
  adminResetPassword,
  listAllVendorsForAdminpanel,
  updateVendorStatus,
} from '../../controllers/admin.controllers.js';

const router = Router();

router.post('/reset_user_password', adminResetPassword);
router.get('/vendors_for_adminpanel', listAllVendorsForAdminpanel);
router.put('/update_status/:vendorId', updateVendorStatus);

export default router;

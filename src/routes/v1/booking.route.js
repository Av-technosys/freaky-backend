import { Router } from 'express';
import { checkVendor } from '../../middleware/vendor.middleware.js'; 
import { createExternalBooking } from '../../controllers/booking.controllers.js';
 
const router = Router();

router.post('/create_external_booking', checkVendor, createExternalBooking);
export default router;

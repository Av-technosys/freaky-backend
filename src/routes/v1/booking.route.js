import { Router } from 'express';
import { checkVendor } from '../../middleware/vendor.middleware.js';
import {
  createExternalBooking,
  createBookingItem,
  createBooking,
  getBooking,
  getBookingItemDetailsById,
} from '../../controllers/booking.controllers.js';

const router = Router();

router.post('/create_external_booking', checkVendor, createExternalBooking);
router.post('/bookingItem', checkVendor, createBookingItem);
router.post('/booking', checkVendor, createBooking);
router.get('/', checkVendor, getBooking);
router.get('/:bookingId', checkVendor, getBookingItemDetailsById);
export default router;

import { Router } from 'express';
import { checkVendor } from '../../middleware/vendor.middleware.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';

import {
  createExternalBooking,
  createBookingItem,
  createBooking,
  getBooking,
  getBookingItemDetailsById,
  checkServiceAvailability,
  getMyBookings,
} from '../../controllers/booking.controllers.js';

const router = Router();

router.post('/create_external_booking', checkVendor, createExternalBooking);
router.post('/bookingItem', checkVendor, createBookingItem);
router.post('/booking', checkVendor, createBooking);
router.get('/my-bookings', confirmUserToken, getMyBookings);
router.get('/', checkVendor, getBooking);
router.get('/:bookingId', checkVendor, getBookingItemDetailsById);
router.post('/check_service_available', checkVendor, checkServiceAvailability);

export default router;

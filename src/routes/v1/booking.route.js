import { Router } from 'express';
import { checkVendor } from '../../middleware/vendor.middleware.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';

import { createExternalBooking, createBookingItem, createBooking, getBooking, getBookingDetailsById, checkServiceAvailability, getMyBookings, getVendorMonthlyBooking, getBookingItemDetailsById } from '../../controllers/booking.controllers.js';

const router = Router();

router.post('/create_external_booking', checkVendor, createExternalBooking);
router.post('/bookingItem', checkVendor, createBookingItem);
router.post('/booking', checkVendor, createBooking);
router.get('/my-bookings', confirmUserToken, getMyBookings);
router.get('/', checkVendor, getBooking);
router.get('/month', checkVendor, getVendorMonthlyBooking);
router.get('/:bookingId', checkVendor, getBookingDetailsById);
router.post('/check_service_available', checkVendor, checkServiceAvailability);
router.get('/item/:bookingItemId', checkVendor, getBookingItemDetailsById);

export default router;

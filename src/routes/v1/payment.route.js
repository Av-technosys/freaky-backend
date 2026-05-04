import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import { checkVendor } from '../../middleware/vendor.middleware.js';
import {
  verifyAndSavePayment,
  createOrder,
  fetchVendorPayments,
} from '../../controllers/payment.controllers.js';

const router = Router();

router.post('/checkout-session', (req, res) => {
  res.json({ message: 'Checkout session created' });
});
router.post('/create-order', confirmUserToken, createOrder);
router.post('/verify', confirmUserToken, verifyAndSavePayment);
router.get('/payments', checkVendor, fetchVendorPayments);
export default router;

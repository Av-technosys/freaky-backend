import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import {
  verifyAndSavePayment,
  createOrder,
} from '../../controllers/payment.controllers.js';

const router = Router();

router.post('/checkout-session', (req, res) => {
  res.json({ message: 'Checkout session created' });
});
router.post('/create-order', confirmUserToken, createOrder);
router.post('/verify', confirmUserToken, verifyAndSavePayment);
export default router;

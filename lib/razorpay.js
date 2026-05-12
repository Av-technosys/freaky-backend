import Razorpay from 'razorpay';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '../const/env.js';

console.log('RAZORPAY_KEY_ID:', RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', RAZORPAY_KEY_SECRET);

export const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

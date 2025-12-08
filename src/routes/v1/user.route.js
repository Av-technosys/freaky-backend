import { Router } from 'express';
import {
  getAllReviews,
  getUserInfo,
  updateUserInfo,
  cartHandler,
  profilePictureHandler,
  addReview,
  deleteReview,
} from '../../controllers/User.controllers.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import addressRouter from './user.address.route.js';
import cartRouter from './user.cart.js';

const router = Router();
console.log('request reviced user');
router.use('/address', addressRouter);
router.use('/cart', cartRouter);

router.get('/get_personal_info', confirmUserToken, getUserInfo);
router.get('/get_all_reviews', confirmUserToken, getAllReviews);

router.post('/update_personal_info', confirmUserToken, updateUserInfo);

router.post('/profile_picture', confirmUserToken, profilePictureHandler);
router.delete('/profile_picture', confirmUserToken, profilePictureHandler);
router.post('/add_review', confirmUserToken, addReview);
router.delete('/review', confirmUserToken, deleteReview);
export default router;

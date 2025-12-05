import { Router } from 'express';
import {
  addAddress,
  editAddresses,
  getAllReviews,
  getUserInfo,
  listAllAddresses,
  setCurrentAddress,
  updateUserInfo,
  deleteAddress,
  cartHandler,
  profilePictureHandler,
  addReview,
} from '../../controllers/User.controllers.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';

const router = Router();

router.get('/get_personal_info', confirmUserToken, getUserInfo);
router.get('/list_all_addresses', confirmUserToken, listAllAddresses);
router.get('/get_all_reviews', confirmUserToken, getAllReviews);

router.post('/update_personal_info', confirmUserToken, updateUserInfo);
router.post('/add_address', confirmUserToken, addAddress);
router.post('/edit_address', confirmUserToken, editAddresses);
router.post('/set_current_address', confirmUserToken, setCurrentAddress);
router.post('/delete_address', confirmUserToken, deleteAddress);
router.post('/cart', confirmUserToken, cartHandler);
router.get('/cart', confirmUserToken, cartHandler);
router.delete('/cart/:cartItemId', confirmUserToken, cartHandler);

router.post('/profile_picture', confirmUserToken, profilePictureHandler);
router.delete('/profile_picture', confirmUserToken, profilePictureHandler);
router.post('/add_review', confirmUserToken, addReview);
export default router;

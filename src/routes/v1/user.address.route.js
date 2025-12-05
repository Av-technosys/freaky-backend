import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import {
  addAddress,
  deleteAddress,
  editAddresses,
  listAllAddresses,
  setCurrentAddress,
} from '../../controllers/User.controllers.js';

const router = Router();
console.log('request reviced address');
router.get('/', confirmUserToken, listAllAddresses);
router.post('/add', confirmUserToken, addAddress);
router.put('/edit', confirmUserToken, editAddresses);
router.post('/set_current', confirmUserToken, setCurrentAddress);
router.delete('/delete', confirmUserToken, deleteAddress);

export default router;

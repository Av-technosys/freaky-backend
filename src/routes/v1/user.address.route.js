import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import {
  addAddress,
  deleteAddress,
  editAddresses,
  listAllAddresses,
  setCurrentAddress,
  fetchCurrentAddress,
} from '../../controllers/User.controllers.js';

const router = Router();
router.get('/', confirmUserToken, listAllAddresses);
router.post('/add', confirmUserToken, addAddress);
router.put('/edit', confirmUserToken, editAddresses);
router.post('/set_current', confirmUserToken, setCurrentAddress);
router.get('/current_address/:id', confirmUserToken, fetchCurrentAddress);
router.delete('/delete', confirmUserToken, deleteAddress);

export default router;

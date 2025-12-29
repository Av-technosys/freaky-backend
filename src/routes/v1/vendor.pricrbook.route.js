import { Router } from 'express';
import {
  listAllPriceBooks,
  updatePriceBookEnteries,
} from '../../controllers/Vendor.controllers.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';

const router = Router();

router.put('/update', confirmUserToken, updatePriceBookEnteries);
router.get('/', confirmUserToken, listAllPriceBooks);

export default router;

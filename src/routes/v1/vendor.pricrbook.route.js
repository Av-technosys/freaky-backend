import { Router } from 'express';
import { updatePriceBookEnteries } from '../../controllers/Vendor.controllers.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';

const router = Router();

router.put('/update', confirmUserToken, updatePriceBookEnteries);

export default router;

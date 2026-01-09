import { Router } from 'express';
import { cartHandler } from '../../controllers/User.controllers.js';
import { confirmUserToken } from '../../middleware/user.middleware.js';

const router = Router();

router.post('/item', confirmUserToken, cartHandler);
router.get('/items', confirmUserToken, cartHandler);
router.delete('/item/:bookingDraftId', confirmUserToken, cartHandler);

export default router;

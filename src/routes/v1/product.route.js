import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import { getAllProductReviews } from '../../controllers/product.controller.js';

const router = Router();

router.get('/reviews/:productid', confirmUserToken, getAllProductReviews);

export default router;

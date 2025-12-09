import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import { getAllProductReviews } from '../../controllers/product.controller.js';
import {
  fetchProductDetailById,
  fetchProductPrice,
  getAllProductsByCategoryId,
  productByTypeId,
} from '../../controllers/Vendor.controllers.js';

const router = Router();
router.get('/reviews/:productid', confirmUserToken, getAllProductReviews);
router.get('/info', confirmUserToken, fetchProductDetailById);
router.post('/product_price/:productId', confirmUserToken, fetchProductPrice);
router.get('/by_product_type_id', confirmUserToken, productByTypeId);
router.get(
  '/products_by_categoryId/:categoryId',
  confirmUserToken,
  getAllProductsByCategoryId
);

export default router;

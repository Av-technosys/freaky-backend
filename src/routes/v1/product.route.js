import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import { getAllProductReviews } from '../../controllers/product.controller.js';
import {
  fetchProductByProductId,
  fetchProductPrice,
  getAllProductsByCategoryId,
  listProductsType,
} from '../../controllers/Vendor.controllers.js';

const router = Router();

router.get('/reviews/:productid', confirmUserToken, getAllProductReviews);
router.get(
  '/product_by_product_type_id/:productTypeId',
  confirmUserToken,
  fetchProductByProductId
);
router.post('/product_price/:productId', confirmUserToken, fetchProductPrice);
router.get('/products_type', confirmUserToken, listProductsType);
router.get(
  '/products_by_categoryId/:categoryId',
  confirmUserToken,
  getAllProductsByCategoryId
);

export default router;

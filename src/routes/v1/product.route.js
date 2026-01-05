import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import {
  deleteProductById,
  getAllProductReviews,
  getAllProductTypes,
} from '../../controllers/product.controller.js';
import {
  deleteProductImage,
  fetchProductDetailById,
  fetchProductPrice,
  getAllProductsByCategoryId,
  productByTypeId,
  updateProductById,
} from '../../controllers/Vendor.controllers.js';

const router = Router();
router.get('/reviews/:productid', confirmUserToken, getAllProductReviews);
router.get('/info', confirmUserToken, fetchProductDetailById);
router.post('/product_price/:productId', confirmUserToken, fetchProductPrice);
router.get('/products_type', confirmUserToken, getAllProductTypes);

router.get('/by_product_type_id', confirmUserToken, productByTypeId);
router.get(
  '/products_by_categoryId/:categoryId',
  confirmUserToken,
  getAllProductsByCategoryId
);
router.put('/update/:productId', confirmUserToken, updateProductById);
router.delete('/image/:id', confirmUserToken, deleteProductImage);
router.delete('/delete/:productId', confirmUserToken, deleteProductById);

export default router;

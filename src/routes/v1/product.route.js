import { Router } from 'express';
import { confirmUserToken } from '../../middleware/user.middleware.js';
import {
  deleteBannerImage,
  deleteProductById,
  deleteProductImage,
  getAllProductReviews,
  getAllProductTypes,
} from '../../controllers/product.controller.js';
import {
  createProduct,
  fetchProductDetailById,
  fetchProductPrice,
  getAllProductsByCategoryId,
  getAllFeaturedProducts,
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
router.get('/featuredProducts/', confirmUserToken, getAllFeaturedProducts);
router.put('/update/:productId', confirmUserToken, updateProductById);
router.post('/create', confirmUserToken, createProduct);
router.delete('/image/:id', confirmUserToken, deleteProductImage);
router.delete('/banner/:productId', confirmUserToken, deleteBannerImage);
router.delete('/delete/:productId', confirmUserToken, deleteProductById);

export default router;

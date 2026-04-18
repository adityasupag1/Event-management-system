import express from 'express';
import {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/mine', protect, authorize('vendor'), getMyProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('vendor'), createProduct);
router.put('/:id', protect, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);

export default router;

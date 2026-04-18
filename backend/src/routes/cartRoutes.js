import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('user'));
router.get('/', getCart);
router.post('/', addToCart);
router.delete('/', clearCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);

export default router;

import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post('/', authorize('user'), createOrder);
router.get('/mine', authorize('user'), getMyOrders);
router.get('/vendor', authorize('vendor'), getVendorOrders);
router.get('/', authorize('admin'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('vendor', 'admin'), updateOrderStatus);
router.put('/:id/cancel', authorize('user'), cancelOrder);

export default router;

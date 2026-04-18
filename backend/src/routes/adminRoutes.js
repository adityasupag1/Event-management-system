import express from 'express';
import {
  getStats,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/stats', getStats);
router.get('/users', listUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/status', toggleUserStatus);

export default router;

import express from 'express';
import { getRequests, createRequest, updateRequest } from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getRequests);
router.post('/', authorize('user'), createRequest);
router.put('/:id', authorize('vendor'), updateRequest);

export default router;

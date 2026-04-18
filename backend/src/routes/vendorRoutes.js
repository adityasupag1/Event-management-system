import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// @desc Public — list vendors (optionally filtered by category)
// @route GET /api/vendors
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, search } = req.query;
    const q = { role: 'vendor', status: 'active' };
    if (category) q.category = category;
    if (search) q.$or = [
      { name: { $regex: search, $options: 'i' } },
      { businessName: { $regex: search, $options: 'i' } },
    ];
    const vendors = await User.find(q).select('-password');
    // Attach product count
    const withCounts = await Promise.all(
      vendors.map(async (v) => {
        const count = await Product.countDocuments({ vendor: v._id });
        return { ...v.toObject(), productCount: count };
      })
    );
    res.json(withCounts);
  })
);

// @desc Public — single vendor profile
// @route GET /api/vendors/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const vendor = await User.findById(req.params.id).select('-password');
    if (!vendor || vendor.role !== 'vendor') {
      res.status(404);
      throw new Error('Vendor not found');
    }
    res.json(vendor);
  })
);

// @desc Public — category counts (for landing/dashboard chips)
// @route GET /api/vendors/stats/categories
router.get(
  '/stats/categories',
  asyncHandler(async (req, res) => {
    const cats = ['Catering', 'Florist', 'Decoration', 'Lighting'];
    const counts = await Promise.all(
      cats.map((c) => User.countDocuments({ role: 'vendor', category: c, status: 'active' }))
    );
    res.json(cats.map((c, i) => ({ category: c, count: counts[i] })));
  })
);

export default router;

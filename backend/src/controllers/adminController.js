import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import {
  isValidMembershipPlan,
  monthsFromPlan,
  planFromDurationMonths,
} from '../utils/membershipPlan.js';

// @desc GET admin dashboard stats
// @route GET /api/admin/stats
export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalVendors, totalOrders, completedOrders] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'vendor' }),
    Order.countDocuments({}),
    Order.countDocuments({ status: 'delivered' }),
  ]);
  const activeOrders = await Order.countDocuments({
    status: { $in: ['received', 'ready', 'out_for_delivery'] },
  });
  const revenueAgg = await Order.aggregate([
    { $match: { status: 'delivered' } },
    { $group: { _id: null, total: { $sum: '$grandTotal' } } },
  ]);
  const revenue = revenueAgg[0]?.total || 0;

  const recent = await Order.find({}).sort('-createdAt').limit(5).populate('user', 'name');

  res.json({
    totalUsers,
    totalVendors,
    totalOrders,
    activeOrders,
    completedOrders,
    revenue,
    recent,
  });
});

/** Users missing a real tier plan (old accounts or pre-membership schema). */
const USER_NEEDS_DEFAULT_MEMBERSHIP = {
  role: 'user',
  $or: [
    { membership: { $exists: false } },
    { membership: null },
    { 'membership.plan': { $exists: false } },
    { 'membership.plan': null },
    { 'membership.plan': '' },
    { 'membership.plan': 'free' },
    { 'membership.plan': 'basic' },
    { 'membership.plan': 'premium' },
  ],
};

// @desc GET users (admin)
// @route GET /api/admin/users
export const listUsers = asyncHandler(async (req, res) => {
  const { role, search, status } = req.query;

  // One-shot style backfill: persist default tier so admin UI and Mongoose always see a valid plan.
  try {
    await User.collection.updateMany(USER_NEEDS_DEFAULT_MEMBERSHIP, [
      {
        $set: {
          membership: {
            plan: '6 month',
            expiresAt: {
              $dateAdd: {
                startDate: { $ifNull: ['$createdAt', '$$NOW'] },
                unit: 'month',
                amount: 6,
              },
            },
          },
        },
      },
    ]);
  } catch {
    const stale = await User.find(USER_NEEDS_DEFAULT_MEMBERSHIP);
    for (const u of stale) {
      const exp = new Date(u.createdAt || Date.now());
      exp.setMonth(exp.getMonth() + 6);
      u.set('membership', { plan: '6 month', expiresAt: exp });
      await u.save();
    }
  }

  const q = { role: role || 'user' };
  if (status) q.status = status;
  if (search) q.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  const users = await User.find(q).sort('-createdAt');
  res.json(users);
});

// @desc POST create user (admin)
// @route POST /api/admin/users
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'user', membershipPlan, membershipDurationMonths } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }
  const exists = await User.findOne({ email: String(email).toLowerCase() });
  if (exists) {
    res.status(400);
    throw new Error('Email already registered');
  }
  const user = new User({ name, email, password, role });
  if (role === 'user') {
    const plan = isValidMembershipPlan(membershipPlan)
      ? membershipPlan
      : planFromDurationMonths(membershipDurationMonths);
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + monthsFromPlan(plan));
    user.set('membership', { plan, expiresAt });
  }
  await user.save();
  res.status(201).json(user);
});

// @desc PUT update user (admin)
// @route PUT /api/admin/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const {
    password,
    membershipPlan,
    membershipDurationMonths,
    membership: _membershipFromBody,
    ...rest
  } = req.body;
  Object.assign(user, rest);
  if (password) user.password = password;

  // `membershipPlan !== undefined` fails when the client omits the key (JSON drops undefined values).
  const body = req.body;
  const wantsMembershipUpdate =
    user.role === 'user' &&
    (Object.prototype.hasOwnProperty.call(body, 'membershipPlan') ||
      Object.prototype.hasOwnProperty.call(body, 'membershipDurationMonths'));

  if (wantsMembershipUpdate) {
    const plan = isValidMembershipPlan(membershipPlan)
      ? membershipPlan
      : planFromDurationMonths(membershipDurationMonths);
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + monthsFromPlan(plan));
    user.set('membership', { plan, expiresAt });
  }

  await user.save();
  const fresh = await User.findById(user._id).select('-password');
  res.json(fresh);
});

// @desc DELETE user (admin)
// @route DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ message: 'User removed' });
});

// @desc PUT toggle user status (suspend/activate)
// @route PUT /api/admin/users/:id/status
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.status = status;
  await user.save();
  res.json(user);
});

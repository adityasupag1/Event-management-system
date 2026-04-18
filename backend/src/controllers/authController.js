import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import {
  isValidMembershipPlan,
  monthsFromPlan,
  planFromDurationMonths,
} from '../utils/membershipPlan.js';

const membershipPayload = (user) => ({
  plan: user.membership?.plan ?? null,
  expiresAt: user.membership?.expiresAt || null,
});

// @desc Register (user | vendor | admin)
// @route POST /api/auth/signup
export const signup = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    userId,
    role = 'user',
    businessName,
    category,
    membershipPlan,
    membershipDurationMonths,
  } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = new User({
    name,
    email,
    password,
    role,
    userId,
    businessName,
    category,
  });

  if (role === 'user') {
    const plan = isValidMembershipPlan(membershipPlan)
      ? membershipPlan
      : planFromDurationMonths(membershipDurationMonths);
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + monthsFromPlan(plan));
    user.set('membership', { plan, expiresAt });
  }

  await user.save();

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    userId: user.userId,
    role: user.role,
    businessName: user.businessName,
    category: user.category,
    membership: membershipPayload(user),
    token: generateToken(user._id),
  });
});

// @desc Login — accepts either email or userId
// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { userId, email, password, role } = req.body;
  const identifier = userId || email;
  if (!identifier || !password) {
    res.status(400);
    throw new Error('Please provide credentials');
  }

  const query = userId ? { userId } : { email };
  if (role) query.role = role;

  const user = await User.findOne(query).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  if (role && user.role !== role) {
    res.status(403);
    throw new Error(`This account is not a ${role} account`);
  }
  if (user.status === 'suspended') {
    res.status(403);
    throw new Error('Your account is suspended. Please contact support.');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    userId: user.userId,
    role: user.role,
    businessName: user.businessName,
    category: user.category,
    membership: membershipPayload(user),
    token: generateToken(user._id),
  });
});

// @desc Current user
// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

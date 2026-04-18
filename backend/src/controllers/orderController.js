import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc POST place order from cart
// @route POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { deliveryDetails, paymentMethod = 'cash' } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const items = cart.items.map((i) => ({
    product: i.product._id,
    vendor: i.product.vendor,
    name: i.product.name,
    price: i.product.price,
    quantity: i.quantity,
    image: i.product.image,
  }));

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = 50;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const grandTotal = subtotal + deliveryFee + tax;

  const order = await Order.create({
    user: req.user._id,
    items,
    deliveryDetails,
    paymentMethod,
    subtotal,
    deliveryFee,
    tax,
    grandTotal,
    statusHistory: [{ status: 'received', note: 'Order placed' }],
  });

  // Decrement stock
  for (const i of items) {
    await Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.quantity } });
  }

  // Empty cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

// @desc GET my orders (user)
// @route GET /api/orders/mine
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(orders);
});

// @desc GET single order
// @route GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isVendor = req.user.role === 'vendor' && order.items.some((i) => i.vendor?.toString() === req.user._id.toString());
  if (!isOwner && !isVendor && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }
  res.json(order);
});

// @desc GET orders addressed to current vendor
// @route GET /api/orders/vendor
export const getVendorOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'items.vendor': req.user._id })
    .populate('user', 'name email')
    .sort('-createdAt');
  res.json(orders);
});

// @desc PUT update status (vendor/admin)
// @route PUT /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const valid = ['received', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!valid.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = status;
  order.statusHistory.push({ status, note: note || '' });
  await order.save();
  res.json(order);
});

// @desc PUT cancel order (owner)
// @route PUT /api/orders/:id/cancel
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  if (['delivered', 'out_for_delivery'].includes(order.status)) {
    res.status(400);
    throw new Error('Cannot cancel order in current status');
  }
  order.status = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by customer' });
  await order.save();
  res.json(order);
});

// @desc GET all orders (admin)
// @route GET /api/orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
  res.json(orders);
});

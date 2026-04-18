import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc GET all products (with filters)
// @route GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const { category, vendor, search, status } = req.query;
  const q = {};
  if (category) q.category = category;
  if (vendor) q.vendor = vendor;
  if (status) q.status = status;
  if (search) q.name = { $regex: search, $options: 'i' };
  const products = await Product.find(q).populate('vendor', 'name businessName category rating');
  res.json(products);
});

// @desc GET single product
// @route GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('vendor', 'name businessName category rating');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// @desc GET products for the logged-in vendor
// @route GET /api/products/mine
export const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ vendor: req.user._id });
  res.json(products);
});

// @desc POST create product (vendor)
// @route POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;
  const vendor = await User.findById(req.user._id);
  const product = await Product.create({
    vendor: req.user._id,
    name,
    description,
    price,
    category: category || vendor?.category || 'Catering',
    image,
    stock: stock ?? 10,
  });
  res.status(201).json(product);
});

// @desc PUT update product (vendor)
// @route PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

// @desc DELETE product
// @route DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

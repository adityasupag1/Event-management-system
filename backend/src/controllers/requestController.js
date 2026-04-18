import asyncHandler from 'express-async-handler';
import Request from '../models/Request.js';

// @desc GET requests (vendor sees requests matching their category)
// @route GET /api/requests
export const getRequests = asyncHandler(async (req, res) => {
  const q = {};
  if (req.user.role === 'vendor') q.category = req.user.category;
  else if (req.user.role === 'user') q.requester = req.user._id;
  const requests = await Request.find(q).populate('requester', 'name').sort('-createdAt');
  res.json(requests);
});

// @desc POST create (user)
// @route POST /api/requests
export const createRequest = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const request = await Request.create({
    requester: req.user._id,
    title,
    description,
    category,
  });
  res.status(201).json(request);
});

// @desc PUT update status (vendor)
// @route PUT /api/requests/:id
export const updateRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const request = await Request.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }
  if (status) request.status = status;
  await request.save();
  res.json(request);
});

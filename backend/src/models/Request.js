import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: {
      type: String,
      enum: ['Catering', 'Florist', 'Decoration', 'Lighting'],
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    requestedByCount: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'fulfilled', 'rejected'],
      default: 'new',
    },
  },
  { timestamps: true }
);

const Request = mongoose.model('Request', requestSchema);
export default Request;

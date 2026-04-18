import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Catering', 'Florist', 'Decoration', 'Lighting'],
      required: true,
    },
    image: { type: String, default: '' }, // URL or base64
    stock: { type: Number, default: 10, min: 0 },
    status: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock'],
      default: 'in_stock',
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

// Auto-update status from stock level
productSchema.pre('save', function (next) {
  if (this.stock === 0) this.status = 'out_of_stock';
  else if (this.stock < 5) this.status = 'low_stock';
  else this.status = 'in_stock';
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;

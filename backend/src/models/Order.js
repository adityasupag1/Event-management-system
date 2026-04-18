import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1, min: 1 },
    image: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [orderItemSchema],
    deliveryDetails: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pinCode: String,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi'],
      default: 'cash',
    },
    subtotal: Number,
    deliveryFee: { type: Number, default: 50 },
    tax: Number,
    grandTotal: Number,
    status: {
      type: String,
      enum: ['received', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'received',
    },
    statusHistory: [
      {
        status: String,
        note: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `${1000 + Math.floor(Math.random() * 9000)}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;

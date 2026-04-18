import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { planFromDurationMonths } from '../utils/membershipPlan.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    userId: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      default: 'user',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'pending'],
      default: 'active',
    },
    membership: {
      /**
       * Canonical: "6 month" | "1 year" | "2 years".
       * Legacy enum values kept so Mongoose does not drop them on read; promo rows migrate on save.
       */
      plan: {
        type: String,
        enum: ['6 month', '1 year', '2 years', 'promo', 'free', 'basic', 'premium'],
      },
      expiresAt: { type: Date },
      /** @deprecated Legacy only — removed when document is saved after promo migration. */
      durationMonths: { type: Number, enum: [6, 12, 24] },
    },
    // Vendor-specific fields (populated only when role = vendor)
    businessName: { type: String, trim: true },
    category: {
      type: String,
      enum: ['Catering', 'Florist', 'Decoration', 'Lighting'],
    },
    description: { type: String, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    phone: { type: String, trim: true },
    address: {
      street: String,
      city: String,
      state: String,
      pinCode: String,
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

// Generate a user/vendor/admin ID when missing
userSchema.pre('save', function (next) {
  if (!this.userId) {
    const prefix = this.role === 'vendor' ? 'VND' : this.role === 'admin' ? 'ADM' : 'USR';
    this.userId = `${prefix}-${Date.now().toString().slice(-6)}`;
  }
  next();
});

// Migrate legacy complimentary rows to canonical plan strings (drops durationMonths)
userSchema.pre('save', function (next) {
  const m = this.membership;
  if (!m || m.plan !== 'promo' || m.durationMonths == null) return next();
  const dm = parseInt(m.durationMonths, 10);
  if (![6, 12, 24].includes(dm)) return next();
  const plan = planFromDurationMonths(dm);
  this.set('membership', { plan, expiresAt: m.expiresAt });
  next();
});

const User = mongoose.model('User', userSchema);
export default User;

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Product.deleteMany({});

  // Admin
  await User.create({
    name: 'Platform Admin',
    email: 'admin@eventms.com',
    password: 'admin123',
    role: 'admin',
    userId: 'ADM-001',
  });

  const johnExpiry = new Date();
  johnExpiry.setMonth(johnExpiry.getMonth() + 6);
  const sarahExpiry = new Date();
  sarahExpiry.setMonth(sarahExpiry.getMonth() + 12);
  await User.create([
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
      userId: 'USR-001',
      membership: { plan: '6 month', expiresAt: johnExpiry },
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      password: 'user123',
      role: 'user',
      userId: 'USR-002',
      membership: { plan: '1 year', expiresAt: sarahExpiry },
    },
  ]);

  // Vendors
  const vendors = await User.create([
    {
      name: 'Gourmet Affairs',
      businessName: 'Gourmet Affairs',
      email: 'contact@gourmetaffairs.com',
      password: 'vendor123',
      role: 'vendor',
      userId: 'VND-1042',
      category: 'Catering',
      description: 'Exquisite farm-to-table culinary experiences for elegant weddings and corporate events.',
      rating: 4.9,
      totalReviews: 124,
    },
    {
      name: 'Bloom & Twig',
      businessName: 'Bloom & Twig',
      email: 'hello@bloomandtwig.net',
      password: 'vendor123',
      role: 'vendor',
      userId: 'VND-1043',
      category: 'Florist',
      description: 'Hand-crafted bouquets and arrangements for every event.',
      rating: 4.8,
      totalReviews: 89,
    },
    {
      name: 'Lux Lighting Co.',
      businessName: 'Lux Lighting Co.',
      email: 'sales@luxlighting.co',
      password: 'vendor123',
      role: 'vendor',
      userId: 'VND-1044',
      category: 'Lighting',
      description: 'Premium ambient and stage lighting rentals.',
      rating: 4.7,
      totalReviews: 67,
    },
    {
      name: 'Elegant Drapes',
      businessName: 'Elegant Drapes',
      email: 'info@elegantdrapes.com',
      password: 'vendor123',
      role: 'vendor',
      userId: 'VND-1045',
      category: 'Decoration',
      description: 'Premium décor and theme setup for weddings and galas.',
      rating: 4.9,
      totalReviews: 156,
    },
  ]);

  // Products per vendor
  const sampleProducts = {
    Catering: [
      { name: 'Artisanal Truffle Pasta', price: 1200, description: 'Handmade fettuccine infused with black truffle oil.', stock: 20 },
      { name: 'Premium Antipasto Platter', price: 3500, description: 'Curated selection of cured meats and artisan cheeses.', stock: 15 },
      { name: 'Vanilla Bean Panna Cotta', price: 850, description: 'Silky smooth Italian dessert infused with real vanilla.', stock: 30 },
      { name: 'Wood-fired Margherita', price: 1100, description: 'Classic Neapolitan pizza with San Marzano tomatoes.', stock: 0 },
    ],
    Florist: [
      { name: 'Premium Floral Centerpiece', price: 125, description: 'Hand-arranged roses, peonies and greenery.', stock: 25 },
      { name: 'Bridal Bouquet — Classic', price: 350, description: 'Timeless white bouquet.', stock: 10 },
      { name: 'Aisle Petals (per kg)', price: 80, description: 'Fresh rose petals for aisle decoration.', stock: 40 },
    ],
    Lighting: [
      { name: 'Fairy Light Canopy (10m)', price: 2200, description: 'Warm-white fairy lights with controller.', stock: 12 },
      { name: 'Uplighter Set (4 units)', price: 3000, description: 'Battery-powered LED uplighters.', stock: 8 },
    ],
    Decoration: [
      { name: 'Chiavari Chairs (Gold)', price: 85, description: 'Premium gold Chiavari chair, per unit.', stock: 200 },
      { name: 'Round Banquet Table', price: 1200, description: 'Seats 10 comfortably, includes linen.', stock: 30 },
      { name: 'Backdrop Drape Set', price: 4500, description: 'Elegant backdrop in multiple colors.', stock: 5 },
    ],
  };

  for (const v of vendors) {
    const products = sampleProducts[v.category].map((p) => ({ ...p, vendor: v._id, category: v.category }));
    await Product.insertMany(products);
  }

  console.log('Seed complete!');
  console.log('  Admin:  admin@eventms.com / admin123');
  console.log('  User:   john@example.com / user123');
  console.log('  Vendor: contact@gourmetaffairs.com / vendor123');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

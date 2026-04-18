import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';

dotenv.config();
connectDB();

const app = express();

/** Split comma-separated env values, trim, strip trailing slashes (Origin never has one). */
function parseOriginList(...sources) {
  const set = new Set();
  for (const src of sources) {
    if (src == null || src === '') continue;
    for (const part of String(src).split(',')) {
      const o = part.trim().replace(/\/+$/, '');
      if (o) set.add(o);
    }
  }
  return [...set];
}

// Default frontends (Render CORS) if CLIENT_URL is still localhost-only on production.
const defaultClientOrigins = parseOriginList(
  'https://event-management-system-cui.netlify.app',
  'https://event-management-system-blush-beta.vercel.app',
  process.env.CLIENT_URL,
  process.env.ALLOWED_ORIGINS
);
const stringOrigins = parseOriginList('http://localhost:5173', ...defaultClientOrigins);
// Preview deployments: <name>-git-<branch>-<scope>.vercel.app
const vercelOriginPattern = /^https:\/\/[^\s/]+\.vercel\.app$/i;

if (process.env.NODE_ENV !== 'test') {
  console.log(`CORS (strings): ${stringOrigins.join(', ')}; plus *.vercel.app pattern`);
}

app.use(
  cors({
    origin: [...stringOrigins, vercelOriginPattern],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.get('/api/health', (_, res) => res.json({ ok: true, service: 'EventMS API' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendors', vendorRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`EventMS API running on port ${PORT}`));

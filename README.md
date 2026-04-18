<<<<<<< HEAD
<<<<<<< HEAD
# EventMS — Event Management System

A full-stack **MERN** (MongoDB + Express + React + Node) event management platform with three role-based portals: **User**, **Vendor**, and **Admin**. Built pixel-accurate from the Stitch Material Design 3 system with role-themed colours (Admin=Blue, Vendor=Yellow, User=Green) and category chips (Catering, Florist, Decoration, Lighting).

## Features

### User portal (Green theme)
- Browse vendors by category (Catering, Florist, Decoration, Lighting)
- Vendor product catalogues with stock status, qty controls, add-to-cart
- Full shopping cart with coupon field, delivery & tax calculation
- Multi-step checkout (Delivery Details → Payment → Confirmation)
- Order success page with confetti animation & receipt
- Order tracking with 4-step progress tracker (Received → Ready → Out for Delivery → Delivered) and cancel-order

### Vendor portal (Yellow theme)
- Dashboard with KPI cards, revenue, recent activity
- Manage products — add/edit/delete with stock tracking and auto status (in_stock / low_stock / out_of_stock)
- Customer requests inbox (new / in_progress / fulfilled / rejected)
- Order management with status filters
- Update order status with radio-style selector and customer note

### Admin portal (Blue theme)
- System dashboard with KPIs (users, vendors, active orders, revenue)
- Maintain users — CRUD, suspend/activate, search, filter
- Maintain vendors — CRUD, category + status filters, stat cards
- Recent activity timeline with colored dots
- System health indicators

### Cross-cutting
- JWT-based authentication with role guard (user/vendor/admin)
- Role-aware navbar with mobile drawer that matches design spec (280 px drawer, role-themed header, dot accents, red Logout button)
- Breadcrumbs on every inner page
- React Hot Toast for notifications
- Responsive — tables collapse to stacked cards on mobile, two-column layouts stack vertically, buttons go full-width
- Animations — fade-slide-up page transitions, card hover lift, button scale, drawer slide, confetti on success
- Accessibility — 44×44 min tap targets, focus rings, alt text, icon+text labels

## Project structure

```
eventms/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controllers/   # auth, product, cart, order, request, admin
│   │   ├── middleware/    # JWT protect + role authorize, error handler
│   │   ├── models/        # User, Product, Order, Cart, Request
│   │   ├── routes/        # All /api/* endpoints
│   │   ├── utils/         # generateToken, seed
│   │   └── server.js      # Express entry
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/           # Axios client + service modules
    │   ├── components/
    │   │   ├── layout/    # Navbar, Footer, Breadcrumbs, Layout
    │   │   └── ui/        # Icon, Logo, Chip, StatusBadge primitives
    │   ├── context/       # AuthContext, CartContext
    │   ├── pages/
    │   │   ├── auth/      # 3 logins + 3 signups + shared AuthShell
    │   │   ├── user/      # 7 pages
    │   │   ├── vendor/    # 5 pages
    │   │   ├── admin/     # 3 pages
    │   │   └── Landing.jsx
    │   ├── utils/         # theme tokens, formatters
    │   ├── App.jsx        # router
    │   └── main.jsx       # entry
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` OR a Mongo Atlas connection string

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env           # edit .env if needed
npm install
npm run seed                   # creates admin + 2 users + 4 vendors + products
npm run dev                    # starts on http://localhost:5000
```

`.env` variables:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/eventms
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                    # starts on http://localhost:5173
```

Vite is already configured to proxy `/api/*` → `http://localhost:5000`, so no extra CORS setup is needed.

## Demo credentials (after seeding)

| Role   | Email                         | Password   |
|--------|-------------------------------|------------|
| Admin  | admin@eventms.com             | admin123   |
| User   | john@example.com              | user123    |
| Vendor | contact@gourmetaffairs.com    | vendor123  |

Additional seeded users/vendors are in `backend/src/utils/seed.js`.

## API endpoints

**Auth**
- `POST /api/auth/signup` – body: `{name, email, password, role, category?}`
- `POST /api/auth/login`  – body: `{email|userId, password, role?}`
- `GET  /api/auth/me`     – header: `Authorization: Bearer <token>`

**Vendors (public)**
- `GET /api/vendors?category=Catering&search=…`
- `GET /api/vendors/:id`
- `GET /api/vendors/stats/categories`

**Products**
- `GET  /api/products?category=&vendor=&search=`
- `GET  /api/products/:id`
- `GET  /api/products/mine`           – vendor-only
- `POST /api/products`                – vendor-only
- `PUT  /api/products/:id`            – vendor/admin
- `DELETE /api/products/:id`          – vendor/admin

**Cart (user-only)**
- `GET    /api/cart`
- `POST   /api/cart`                  – body: `{productId, quantity}`
- `PUT    /api/cart/:productId`       – body: `{quantity}`
- `DELETE /api/cart/:productId`
- `DELETE /api/cart`

**Orders**
- `POST /api/orders`                  – body: `{deliveryDetails, paymentMethod}` (user)
- `GET  /api/orders/mine`             – user
- `GET  /api/orders/vendor`           – vendor
- `GET  /api/orders`                  – admin
- `GET  /api/orders/:id`
- `PUT  /api/orders/:id/status`       – body: `{status, note}` (vendor/admin)
- `PUT  /api/orders/:id/cancel`       – user

**Requests**
- `GET  /api/requests`                – filtered by role
- `POST /api/requests`                – user
- `PUT  /api/requests/:id`            – vendor

**Admin**
- `GET    /api/admin/stats`
- `GET    /api/admin/users?role=user|vendor&status=…&search=…`
- `POST   /api/admin/users`
- `PUT    /api/admin/users/:id`
- `PUT    /api/admin/users/:id/status`
- `DELETE /api/admin/users/:id`

## Scripts

**Backend**: `npm run dev` (nodemon), `npm start` (prod), `npm run seed`

**Frontend**: `npm run dev`, `npm run build`, `npm run preview`

## Design system notes (enforced in code)

- Role colours pure throughout: `user-green`, `vendor-yellow`, `admin-blue`
- Category colours pure: `cat-catering` red, `cat-florist` green, `cat-decoration` blue, `cat-lighting` yellow
- All destructive actions (Delete, Cancel order, Logout) use `cat-catering` red
- White cards with coloured top borders via `.card` + `border-<color>` classes
- Headings `#202124` / body `#5F6368` (Google neutral)
- Google Sans + Roboto + Material Symbols loaded in `index.html`
- Breadcrumbs on every inner page
- No dark backgrounds, no heavy shadows — only the design-spec soft shadow

## Features intentionally not implemented

Per the original brief, these screens appeared in the design but are non-code deliverables (analytics, transactions view, guest list full UI, memberships tabs). The tabs and placeholders exist in the shell so you can plug them in without changing the routing.

## License

MIT
=======
# Event-Management-System
this is an event management system
>>>>>>> 1a652353f484d802397b2b1b23478a0a3b2e66ba
=======
# Event-Management-System
this is an event management system
>>>>>>> 1a652353f484d802397b2b1b23478a0a3b2e66ba
#   E v e n t - m a n a g e m e n t - s y s t e m  
 
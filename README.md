# 🎨 AuraGallery — Art Gallery Platform

A **production-ready, full-stack Art Gallery Platform** with role-based dashboards, virtual tours, artwork marketplace, and simulated Stripe payments.

## ✨ Features

### Authentication & Roles
- JWT-based auth (access + refresh tokens)
- 4 user roles: **Admin**, **Artist**, **Curator**, **Visitor**
- Protected routes with role-based access control
- **Works in full offline/demo mode** — no backend required!

### Dashboards (Role-Based)
| Role | Features |
|---|---|
| **Admin** | User CRUD, artwork approval/rejection, platform analytics (Recharts charts) |
| **Artist** | Upload artworks, manage listings, track sales, messages UI |
| **Curator** | Create exhibitions, manage collections, feature artworks |
| **Visitor** | Browse, wishlist, order history, recommended artworks |

### Core Features
- **Artwork Gallery** — Grid with search, category, price, sort filters
- **Artwork Detail** — Image gallery, cultural history, reviews & ratings, add to cart
- **Virtual Tour** — CSS 3D gallery rooms with clickable artworks and room navigation
- **Shopping Cart** — Redux-persisted, slide-out sidebar
- **Checkout** — Multi-step form with mock Stripe card payment
- **Order Confirmation** — Full order summary with animated success state
- **Dark/Light Mode** — Persisted preference
- **Notifications Bell** — Unread count, mark all read
- **Framer Motion** — Page transitions and micro-animations

## 🚀 Quick Start

### Frontend (Demo Mode — No Backend Required!)
```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

### Full Stack Setup

#### Backend
```bash
cd server
npm install

# 1. Start MongoDB (must be running locally)
# 2. Configure environment
cp .env .env.local   # edit with your values

# 3. Seed demo data
npm run seed

# 4. Start server
npm run dev
# → http://localhost:5000
```

#### Frontend (with backend)
```bash
cd client
npm install
npm run dev
```

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@gallery.com | Admin@123 |
| Artist | artist@gallery.com | Artist@123 |
| Curator | curator@gallery.com | Curator@123 |
| Visitor | visitor@gallery.com | Visitor@123 |

> ⚡ The login page has **Quick Demo Login** buttons — just click a role to auto-fill!

## 💳 Stripe Test Payment

Use these test card details on the checkout page:
- **Card number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/26`)
- **CVC**: Any 3 digits (e.g., `123`)

## 📁 Project Structure

```
FSAD_PROJECT/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/         # Navbar, Sidebar, Footer
│       │   ├── artwork/        # ArtworkCard
│       │   └── cart/           # CartSidebar
│       ├── layouts/            # MainLayout, DashboardLayout, AuthLayout
│       ├── pages/
│       │   ├── auth/           # Login, Register
│       │   ├── artworks/       # Artworks, ArtworkDetail
│       │   ├── dashboard/      # All 4 role dashboards
│       │   ├── cart/           # Cart, Checkout, OrderConfirmation
│       │   └── tour/           # VirtualTour
│       ├── redux/
│       │   ├── store.js
│       │   └── slices/         # authSlice, artworkSlice, cartSlice, userSlice, notificationSlice
│       ├── routes/             # ProtectedRoute, RoleRoute
│       ├── services/           # API layer (authService, artworkService, etc.)
│       ├── hooks/              # useAuth, useCart
│       └── utils/              # formatters, constants
│
└── server/                     # Node.js + Express backend
    └── src/
        ├── config/             # db.js
        ├── models/             # User, Artwork, Order, Exhibition
        ├── controllers/        # authController, artworkController, etc.
        ├── middleware/         # auth.js, errorHandler.js
        ├── routes/             # auth, artworks, orders, users, exhibitions
        └── utils/seed.js       # Database seeder
```

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| State | Redux Toolkit |
| Routing | React Router DOM v6 |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh) |
| Payments | Stripe (mock mode) |
| Toast | React Hot Toast |

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET  /api/auth/me`

### Artworks
- `GET  /api/artworks` — List with filters
- `GET  /api/artworks/featured`
- `GET  /api/artworks/my` — Artist's artworks
- `GET  /api/artworks/:id`
- `POST /api/artworks` — Artist/Admin
- `PUT  /api/artworks/:id`
- `DELETE /api/artworks/:id`
- `PATCH /api/artworks/:id/status` — Admin approval
- `POST /api/artworks/:id/reviews`

### Orders
- `POST /api/orders`
- `POST /api/orders/stripe-session`
- `POST /api/orders/:id/confirm`
- `GET  /api/orders/my`
- `GET  /api/orders` — Admin

### Users
- `GET  /api/users` — Admin
- `GET  /api/users/analytics` — Admin
- `PUT  /api/users/:id` — Admin
- `DELETE /api/users/:id` — Admin
- `POST /api/users/wishlist/:artworkId`

### Exhibitions
- `GET  /api/exhibitions`
- `POST /api/exhibitions` — Curator/Admin
- `PUT  /api/exhibitions/:id`
- `DELETE /api/exhibitions/:id`

## 📝 Environment Variables

### Server `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/artgallery
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:5173
```

### Client `.env` (optional)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home page |
| `/artworks` | Public | Browse all artworks |
| `/artworks/:id` | Public | Artwork detail |
| `/virtual-tour` | Public | Virtual gallery |
| `/login` | Public | Sign in |
| `/register` | Public | Sign up |
| `/dashboard` | Auth | Role-based dashboard |
| `/cart` | Auth | Shopping cart |
| `/checkout` | Auth | Payment |
| `/order-confirmation` | Auth | Post-purchase |
| `/admin/*` | Admin | Admin sub-pages |
| `/artist/*` | Artist | Artist sub-pages |
| `/curator/*` | Curator | Curator sub-pages |
| `/visitor/*` | Visitor | Visitor sub-pages |

# SHADAY — MongoDB Edition

Full-stack men's shirt e-commerce platform. **Prisma/MySQL removed** — uses **MongoDB + Mongoose** directly.

## Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS v4
- **Backend**: Node.js, Express 4
- **Database**: MongoDB + Mongoose (you connect your own)
- **Auth**: JWT (7-day tokens)
- **Roles**: CUSTOMER · SELLER · ADMIN

## ER Diagram → MongoDB Mapping

| ER Entity | MongoDB Collection / Document |
|---|---|
| User (Shaday, ISA) | `users` collection — role field covers Admin/Seller/Customer |
| Address (belongs) | Embedded array inside `users.addresses` |
| Product (P_id, Price, Name) | `products` collection |
| Category (fabric, texture, size) | Embedded `products.category` sub-doc |
| Item (I_id, O_id, Name) | Embedded `orders.items` array |
| Review (r_id, writes, are) | `reviews` collection with userId + productId refs |
| CartItem | `cartitems` collection |
| WishlistItem | `wishlistitems` collection |
| Order (O_id, price, quantity) | `orders` collection |
| Shipping (S_id, address) | Embedded `orders.shipping` sub-doc |
| Payment (transaction_id, mode, date) | Embedded `orders.payment` sub-doc |

## Setup

### 1. Clone & Install
```bash
cd shaday-mongo
npm install          # installs both client + server
```

### 2. Configure Environment
```bash
# Server
cp .env.example .env
# Edit .env and set your MongoDB URI:
MONGODB_URI=mongodb://localhost:27017/shaday_db
JWT_SECRET=your-long-random-secret-here
PORT=5000
CLIENT_URL=http://localhost:5173

# Client
cp client/.env.example client/.env
# (default VITE_API_URL=http://localhost:5000/api is fine for local dev)
```

### 3. Seed Demo Data (optional)
```bash
npm run seed --workspace server
```
This creates 3 users + 6 products:
| Role | Email | Password |
|---|---|---|
| Admin | admin@shaday.com | Password@123 |
| Seller | seller@shaday.com | Password@123 |
| Customer | customer@shaday.com | Password@123 |

### 4. Run
```bash
# Terminal 1 — API server (port 5000)
npm run dev:server

# Terminal 2 — React frontend (port 5173)
npm run dev:client
```

Open **http://localhost:5173**

## Connect Your Own MongoDB

Just update `MONGODB_URI` in `.env`:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/shaday_db

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shaday_db

# With auth
MONGODB_URI=mongodb://admin:pass@localhost:27017/shaday_db?authSource=admin
```

## Password Rules
8+ chars · 1 uppercase · 1 special character · 3+ numbers  
Example: `Password@123`

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✅ | Profile |
| GET | /api/auth/verify-email?token= | — | Verify email |
| POST | /api/auth/addresses | ✅ | Add address |
| GET | /api/products | — | List products |
| GET | /api/products/:slug | — | Product detail |
| POST | /api/products | SELLER/ADMIN | Create product |
| GET | /api/products/seller | SELLER | My products |
| GET | /api/cart | ✅ | Get cart |
| POST | /api/cart | ✅ | Add to cart |
| PATCH | /api/cart/:id | ✅ | Update quantity |
| DELETE | /api/cart/:id | ✅ | Remove item |
| GET | /api/wishlist | ✅ | Get wishlist |
| POST | /api/wishlist/toggle | ✅ | Toggle save |
| POST | /api/orders | ✅ | Place order |
| GET | /api/orders/mine | ✅ | My orders |
| GET | /api/orders/admin/all | ADMIN | All orders |
| PATCH | /api/orders/:id/status | ADMIN | Update status |
| POST | /api/reviews | ✅ | Post review |
| GET | /api/dashboard/admin | ADMIN | Admin metrics |
| GET | /api/dashboard/seller | SELLER | Seller metrics |

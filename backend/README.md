# Chewy-like Pet E‑Commerce Backend

**Stack:** Node.js, Express, Prisma, SQLite (dev). Switch to Postgres in prod by changing `DATABASE_URL`.

## Quick Start
```bash
cd chewy-backend
cp .env.example .env
# (optional) edit .env values
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```
API: http://localhost:${PORT:-5000}

## Key Endpoints
- `POST /api/auth/register` { email, password, name }
- `POST /api/auth/login` { email, password }
- `GET /api/products?q=&category=&vendor=&take=&skip=`
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/cart/items` (auth) { productId, qty }
- `GET /api/cart` (auth)
- `POST /api/orders` (auth) → creates order from cart
- `GET /api/orders` (auth)
- `POST /api/uploads` form-data key `image` → returns `{ url }`

**Auth:** Bearer token in `Authorization: Bearer <token>`

## Switching to Postgres
1. Set `DATABASE_URL` to your Postgres URL in `.env` and update `datasource provider` in `prisma/schema.prisma` to `postgresql`.
2. Run `npx prisma migrate dev --name init`.

## Notes
- Image uploads are saved to `/public/uploads` and served at `/uploads/...`.
- Admin-only actions (create/update product/category) require a user with `role=ADMIN`.
- This is a slim MVP. Add payments (Stripe), addresses, shipping, wishlists, etc. as needed.

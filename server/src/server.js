// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

// ✅ If your routes import prisma from ../utils/prisma.js, keep this:
import { prisma } from "./utils/prisma.js";

// ✅ Your existing route modules (paths match the files you shared)
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import categoriesRoutes from "./routes/categories.js";
import cartRoutes from "./routes/cart.js";
import ordersRoutes from "./routes/orders.js";
import uploadsRoutes from "./routes/uploads.js";
// (Optional, only if/when you add it)
// import paymentsRoutes from './payments.js';

const app = express();

/* -------------------- CORS (env-driven) -------------------- */
// .env example:
// CORS_ORIGIN="http://localhost:5173,https://naijapet.com"
const allowed = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowed.length ? allowed : true, // dev fallback: allow all if unset
    credentials: false, // set true if you start using cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Preflight
app.options("*", cors());

/* -------------------- Security & logs -------------------- */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* -------------------- Parsers -------------------- */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/* -------------------- Static uploads -------------------- */
// Ensure you save files to "public/uploads" in uploads.js
app.use("/uploads", express.static("public/uploads"));

/* -------------------- Routes -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/uploads", uploadsRoutes);
// If you add Paystack endpoints later:
// app.use('/api/payments', paymentsRoutes);

/* -------------------- Health check -------------------- */
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "NaijaPet API" });
});

/* -------------------- 404 & Error handlers -------------------- */
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Server error",
  });
});

/* -------------------- Start & graceful shutdown -------------------- */
const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  try {
    await prisma.$disconnect();
  } catch {}
  process.exit(0);
});
process.on("SIGTERM", async () => {
  try {
    await prisma.$disconnect();
  } catch {}
  process.exit(0);
});

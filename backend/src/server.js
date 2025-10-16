import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import { prisma } from "./utils/prisma.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import uploadRoutes from "./routes/uploads.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security & logging
app.use(helmet());
app.use(morgan("dev"));

// CORS for dev (adjust allowed origins as needed)
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: false, // true only if you use cookies/sessions
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// IMPORTANT: let preflight succeed
app.options("*", cors());

// Body & cookies
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Static uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "public", "uploads"))
);

// Rate limit (basic)
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use("/api", apiLimiter);

// Health
app.get("/health", (_req, res) => res.status(200).send("ok"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);

// 404
app.use((req, res) =>
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` })
);

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`API on http://localhost:${PORT}`)
);

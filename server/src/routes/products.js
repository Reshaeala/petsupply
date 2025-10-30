import { Router } from "express";
import { prisma } from "../utils/prisma.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/products?q=&category=&species=&vendor=&take=&skip=
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const { q, category, species, vendor, take = 24, skip = 0 } = req.query;

    const where = {
      AND: [
        q ? { name: { contains: q, mode: "insensitive" } } : {},
        vendor ? { vendor: { contains: vendor, mode: "insensitive" } } : {},
        category ? { category: { slug: category } } : {},
        species ? { species: { equals: species.toUpperCase() } } : {},
        { isActive: true },
      ],
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: Number(take),
        skip: Number(skip),
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ items, total });
  } catch (e) {
    next(e);
  }
});

router.get("/species/:species", async (req, res, next) => {
  try {
    const { species } = req.params;
    console.log("species:", species);

    // Fetch products where the species matches the query
    const products = await prisma.product.findMany({
      where: { species: species.toLowerCase() },
      include: { category: true },
    });

    res.json(products);
  } catch (e) {
    console.error("Error fetching species products:", e);
    next(e); // Pass the error to the error-handling middleware
  }
});

router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true, reviews: true },
    });
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (e) {
    next(e);
  }
});

router.get("/category/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { sort } = req.query;
    console.log("Fetching products for category slug:", slug);
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Determine sorting logic
    let orderBy = {};
    if (sort === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { price: "desc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    }

    const products = await prisma.product.findMany({
      where: { categoryId: category.id },
      orderBy,
    });

    res.json({ items: products, total: products.length });
  } catch (err) {
    console.error("Error fetching category products:", err);
    next(err);
  }
});

// Admin create/update (simplified; add role check in real app)
router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN")
      return res.status(403).json({ error: "Forbidden" });
    const {
      name,
      description,
      price,
      imageUrl,
      vendor,
      sku,
      categoryId,
      stock,
    } = req.body;
    const p = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        vendor,
        sku,
        categoryId,
        stock,
      },
    });
    res.status(201).json(p);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (e) {
    console.error("Error fetching product by ID:", e);
    next(e);
  }
});

export default router;

import { Router } from "express";
import { prisma } from "../utils/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    res.json(cart || { items: [] });
  } catch (e) {
    next(e);
  }
});

router.post("/items", requireAuth, async (req, res, next) => {
  try {
    const { productId, qty = 1 } = req.body;
    const userId = req.user.id;
    let cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + qty },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, qty },
      });
    }
    cart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });
    res.status(201).json(cart);
  } catch (e) {
    next(e);
  }
});

router.delete("/items/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.cartItem.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

// Add item to cart
router.post("/add", async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ error: "Product ID and quantity are required" });
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Add or update the cart item
    const cartItem = await prisma.cartItem.upsert({
      where: { productId },
      update: { quantity: { increment: quantity } },
      create: { productId, quantity },
    });

    res.status(200).json(cartItem);
  } catch (err) {
    console.error("Error adding item to cart:", err);
    next(err);
  }
});
export default router;

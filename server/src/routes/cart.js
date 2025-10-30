import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get user's cart
router.get("/", requireAuth, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart" });
  }
});

// Add or update item in cart
router.post("/", requireAuth, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cartItem = await prisma.cartItem.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId: req.user.id, productId, quantity },
      include: { product: true },
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Update item quantity in cart
router.put("/:productId", requireAuth, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  try {
    const cartItem = await prisma.cartItem.update({
      where: { userId_productId: { userId: req.user.id, productId: parseInt(productId) } },
      data: { quantity },
      include: { product: true },
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update item quantity" });
  }
});


// Remove item from cart
router.delete("/:productId", requireAuth, async (req, res) => {
  const { productId } = req.params;
  try {
    await prisma.cartItem.delete({
      where: { userId_productId: { userId: req.user.id, productId: parseInt(productId) } },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

// Clear cart
router.delete("/", requireAuth, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default router;

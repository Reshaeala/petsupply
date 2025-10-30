import { Router } from "express";
import { prisma } from "../utils/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: "Cart is empty" });

    const total = cart.items.reduce((sum, i) => sum + i.qty * i.product.price, 0);
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        items: {
          create: cart.items.map(i => ({
            productId: i.productId,
            qty: i.qty,
            price: i.product.price
          }))
        }
      },
      include: { items: true }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.status(201).json(order);
  } catch (e) { next(e); }
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } }
    });
    res.json(orders);
  } catch (e) { next(e); }
});

export default router;

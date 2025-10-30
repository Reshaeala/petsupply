import { Router } from "express";
import fetch from "node-fetch";
import { prisma } from "../utils/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET || "";
const BASE_URL = "https://api.paystack.co";

router.post("/initialize", requireAuth, async (req, res, next) => {
  try {
    if (!PAYSTACK_SECRET)
      return res.status(400).json({ error: "Missing PAYSTACK_SECRET" });

    const userId = req.user.id;
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart empty" });

    const amount = cart.items.reduce(
      (sum, i) => sum + i.qty * i.product.price,
      0
    );
    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING",
        total: amount,
        currency: "NGN",
        items: {
          create: cart.items.map((i) => ({
            productId: i.productId,
            qty: i.qty,
            price: i.product.price,
          })),
        },
      },
    });

    const init = await fetch(`${BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: req.user.email || "customer@example.com",
        amount: amount * 100, // kobo
        reference: `order_${order.id}`,
        currency: "NGN",
        // callback_url: "https://yourapp.com/payments/callback"
      }),
    }).then((r) => r.json());

    if (!init.status)
      return res
        .status(400)
        .json({ error: init.message || "Paystack init failed" });

    res.json({
      orderId: order.id,
      authorizationUrl: init.data.authorization_url,
    });
  } catch (e) {
    next(e);
  }
});

// webhook skeleton (remember to set raw body for this route in server.js if verifying signature)
router.post("/webhook", async (req, res) => {
  // Verify signature if desired: x-paystack-signature
  const evt = req.body;
  if (evt?.event === "charge.success") {
    const ref = evt.data?.reference || "";
    const orderId = ref.replace(/^order_/, "");
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status: "PAID", paidAt: new Date() },
        include: { items: true },
      });
      // idempotent stock decrement example
      if (!order.inventoryDeducted) {
        for (const it of order.items) {
          await tx.product.update({
            where: { id: it.productId },
            data: { stock: { decrement: it.qty } },
          });
        }
        await tx.order.update({
          where: { id: orderId },
          data: { inventoryDeducted: true },
        });
      }
    });
  }
  res.sendStatus(200);
});

export default router;

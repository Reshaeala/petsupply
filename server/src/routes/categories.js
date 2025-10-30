import { Router } from "express";
import { prisma } from "../utils/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const cats = await prisma.category.findMany({ orderBy: { name: "asc" } });
    res.json(cats);
  } catch (e) { next(e); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });
    const { name, slug } = req.body;
    const cat = await prisma.category.create({ data: { name, slug } });
    res.status(201).json(cat);
  } catch (e) { next(e); }
});

export default router;

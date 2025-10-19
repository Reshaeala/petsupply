import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// Correctly initialize the Google OAuth2 client with the Client ID and Client Secret
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash: hashedPassword, name },
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new Error("Invalid password");
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/google/callback", async (req, res) => {
  const { code, redirect_uri } = req.body;

  console.log("--- Verifying Environment Variables ---");
  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
  if (process.env.GOOGLE_CLIENT_SECRET) {
    console.log(
      "GOOGLE_CLIENT_SECRET is set. Length:",
      process.env.GOOGLE_CLIENT_SECRET.length
    );
  } else {
    console.log("GOOGLE_CLIENT_SECRET is NOT set.");
  }
  console.log("------------------------------------");

  console.log("--- Google Callback Data ---");
  console.log("Code:", code);
  console.log("Redirect URI:", redirect_uri);
  console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("--------------------------");

  try {
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
    });
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token");
    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          passwordHash: await bcrypt.hash(Math.random().toString(36), 10),
        },
      });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    console.error("Error during Google OAuth callback:", error);
    res.status(400).json({ error: error.message });
  }
});

export default router;

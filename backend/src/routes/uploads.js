import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  const filePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: filePath });
});

export default router;

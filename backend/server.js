import dotenv from "dotenv"; // ✅ Load .env early
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("📦 Loaded MONGODB_URI:", process.env.MONGODB_URI);
console.log("📦 Loaded PORT:", process.env.PORT);

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ================================
   🚀 Middleware
================================ */
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

app.use(
  cors({
    origin: "*", // Change this to your production frontend URL if needed
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static image files
const assetsPath = path.join(__dirname, "public", "assets");
console.log("🖼️ Serving static files from:", assetsPath);
app.use("/assets", express.static(assetsPath));

/* ================================
   🚀 MongoDB
================================ */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully."))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

/* ================================
   🚀 API Routes
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

/* ================================
   🚀 Frontend SPA Fallback
================================ */
const distPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});

/* ================================
   🚀 Start Server
================================ */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM received: shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("⚠️ SIGINT received: shutting down gracefully");
  process.exit(0);
});

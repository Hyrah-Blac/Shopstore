import dotenv from "dotenv"; // ✅ Must be at the very top, before anything uses process.env
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES Modules (needed early)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

// DEBUG: Log loaded env variables to verify dotenv works
console.log("📦 Loaded MONGODB_URI:", process.env.MONGODB_URI);
console.log("📦 Loaded PORT:", process.env.PORT);

// Now import the other modules after dotenv.config()
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

/* ================================
   🚀 Middleware Configurations
================================ */
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

app.use(
  cors({
    origin: "https://dressin-bgrnb6uac-hyrahs-projects.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static assets
const assetsPath = path.join(__dirname, "public", "assets");
console.log("🖼️ Serving static files from:", assetsPath);
app.use("/assets", express.static(assetsPath));

/* ================================
   🚀 MongoDB Connection
================================ */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully."))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

/* ================================
   🚀 Health Check Route
================================ */
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is healthy!' });
});

/* ================================
   🚀 API Routes
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

/* ================================
   🚶‍♂️ SPA Fallback Route
================================ */
const distPath = path.join(__dirname, "../dist");
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

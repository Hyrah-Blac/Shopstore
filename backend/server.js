import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================================
   🚀 Middleware Configurations
================================ */

// Logging middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// CORS Configuration
app.use(cors({
  origin: "https://dressin-bgrnb6uac-hyrahs-projects.vercel.app ",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser middleware
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
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: false,
    useUnifiedTopology: false,
  })
  .then(() => console.log("✅ MongoDB connected successfully."))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

/* ================================
   🚀 API Routes - Must come before wildcard route
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

/* ================================
   🚶‍♂️ SPA Fallback Route - Should be last
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
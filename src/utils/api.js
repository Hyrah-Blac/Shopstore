// src/utils/api.js

// Ensure the URL ends with "/api" to work well with your backend route structure
export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "https://backend-5za1.onrender.com/api";

// Derive BACKEND_URL by removing the trailing '/api'
export const BACKEND_URL = API_URL.replace(/\/api$/, "");

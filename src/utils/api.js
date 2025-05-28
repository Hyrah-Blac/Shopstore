// src/api/api.js
export const API_URL =
  import.meta.env.VITE_API_URL || "https://backend-5za1.onrender.com/api";
export const BACKEND_URL = API_URL.replace(/\/api$/, "");

// src/utils/api.js

// Ensure the API URL is clean and ends correctly
export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "https://backend-5za1.onrender.com/api";

// Remove trailing `/api` to get the backend root URL
export const BACKEND_URL = API_URL.replace(/\/api$/, "");

// src/utils/api.js

// Base URL from .env (e.g., "https://backend-5za1.onrender.com")
const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "https://backend-5za1.onrender.com";

// API endpoints usually go under /api, but assets like /assets/... do not
export const API_URL = `${BASE_URL}/api`;
export const BACKEND_URL = BASE_URL;

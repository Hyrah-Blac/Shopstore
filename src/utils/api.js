import axios from "axios";

// Use environment variable if defined, otherwise fallback to Render URL or localhost
const API_URL =
  import.meta.env.VITE_API_URL || "https://backend-5za1.onrender.com/api"; // ✅ Update with your actual Render backend URL
const BACKEND_URL = API_URL.replace("/api", "");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔐 Ensures cookies are sent with cross-origin requests
});

export { API_URL, BACKEND_URL };
export default api;

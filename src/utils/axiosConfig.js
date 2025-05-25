// src/utils/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://dressin-backend.onrender.com/api", // ✅ Your actual Render backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔒 Required for cookie/token-based authentication
});

export default api;

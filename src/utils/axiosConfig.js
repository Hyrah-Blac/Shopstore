// src/utils/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://dressin-backend.onrender.com/api", // ✅ Your actual Render backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

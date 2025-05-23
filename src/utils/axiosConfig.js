// src/utils/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://dressin-production.up.railway.app/api", // ✅ NO trailing slash or space
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

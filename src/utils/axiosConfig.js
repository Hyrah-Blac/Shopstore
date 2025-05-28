// axiosConfig.js
import axios from "axios";

// You can reuse the same logic for baseURL or import from api.js
const API_URL =
  import.meta.env.VITE_API_URL || "https://backend-5za1.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;

import axios from "axios";

// Use VITE_API_URL environment variable if defined, otherwise fallback to hardcoded backend URL
const API_URL =
  import.meta.env.VITE_API_URL || "https://backend-5za1.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies for cross-origin requests
});

export { API_URL };
export default api;

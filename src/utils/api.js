// api.js
import axios from "axios";

// Use environment variable for API base URL if defined, else fallback to Render backend URL
const API_URL =
  import.meta.env.VITE_API_URL || "https://backend-5za1.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies/session info for cross-origin requests
});

export { API_URL };
export default api;

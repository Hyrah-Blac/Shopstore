import axios from "axios";

// ✅ Backend hosted on Render — use full API base URL
const api = axios.create({
  baseURL: "https://backend-5za1.onrender.com/api", // <-- Use your actual backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔐 Ensures cookies are sent with cross-origin requests
});

export default api;

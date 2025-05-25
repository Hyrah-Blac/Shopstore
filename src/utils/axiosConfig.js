import axios from "axios";

const api = axios.create({
  baseURL: "https://dressin-backend.onrender.com/api", // ✅ Backend hosted on Render
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔐 Ensures cookies are sent with cross-origin requests
});

export default api;

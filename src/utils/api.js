import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const BACKEND_URL = API_URL.replace("/api", "");

const api = axios.create({
  baseURL: API_URL, // Dynamic base URL from env or fallback
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies with cross-origin requests
});

export default api;

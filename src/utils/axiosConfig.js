// src/api/axiosConfig.js
import axios from "axios";
import { API_URL } from "./api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;

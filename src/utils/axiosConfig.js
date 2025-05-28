// src/utils/axiosConfig.js

import axios from "axios";
import { API_URL } from "./api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/session if needed
});

export default axiosInstance;

// src/utils/axiosConfig.js

import axios from "axios";
import { API_URL } from "./api"; // Make sure this path is correct

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Needed for sending cookies (like with auth)
});

export default axiosInstance;

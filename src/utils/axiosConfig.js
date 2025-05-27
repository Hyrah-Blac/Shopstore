import axios from "axios";

const api = axios.create({
  baseURL: "https://dressin-backend.onrender.com/api", // Backend API URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests if applicable
});

export default api;

import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Your Django API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically for authenticated requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

export default API;

// lib/axiosInstance.ts
import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000", // Set your API base URL here
  headers: {
    "Content-Type": "application/json",
  },
  // You can add other default configurations here
});

// Request interceptor to add the Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage or any other secure storage
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally here
    return Promise.reject(error);
  }
);

export default axiosInstance;

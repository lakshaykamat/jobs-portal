// lib/axiosInstance.ts
import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000", // Set your API base URL here
  headers: {
    "Content-Type": "application/json",
  },
  // You can add other default configurations here
});

export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Vite Proxy를 통해 http://localhost:8085/api 로 매핑됨
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

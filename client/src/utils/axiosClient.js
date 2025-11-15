import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Adding interceptor to include Clerk JWT
axiosClient.interceptors.request.use(async (config) => {
  try {
    const token = localStorage.getItem('clerk_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Token error:', error);
  }
  return config;
}, error => Promise.reject(error));

export default axiosClient;

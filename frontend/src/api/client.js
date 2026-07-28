import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://sellbook.onrender.com",
});

apiClient.interceptors.request.use((config) => {
  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    localStorage.removeItem("user");
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) localStorage.removeItem("user");
    return Promise.reject(error);
  }
);

export default apiClient;

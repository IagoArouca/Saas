import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

// 🔐 Interceptor de request → injeta o JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚪 Interceptor de response → logout automático se token expirar
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;

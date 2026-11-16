import axios from 'axios';

// Vite proxies /api to http://localhost:8080/api
// If running without proxy, fallback to direct backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45s timeout for Gemini LLM analysis calls
});

// Request interceptor: attach token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.response?.data || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default apiClient;

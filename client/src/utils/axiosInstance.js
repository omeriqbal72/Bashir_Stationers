import axios from 'axios';
import { refreshAccessToken } from './refereshToken';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

// Decode token utility function
const decodeToken = (token) => {
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1])); // Decode the payload
  return payload.exp * 1000; // Convert expiration to milliseconds
};

// Refresh token handling
let isRefreshing = false; // Flag to prevent multiple concurrent refresh calls
let failedQueue = []; // Queue to hold failed requests

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
      if (error) {
          prom.reject(error);
      } else {
          prom.resolve(token);
      }
  });
  failedQueue = [];
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
      const token = localStorage.getItem('token');

      // Check token expiration
      if (token && decodeToken(token) < Date.now()) {
          if (!isRefreshing) {
              isRefreshing = true;

              try {
                  const refreshToken = localStorage.getItem('refreshToken');
                  const newToken = await refreshAccessToken(refreshToken);
                  localStorage.setItem('token', newToken);
                  processQueue(null, newToken);
              } catch (err) {
                  processQueue(err, null);
                  console.error('Failed to refresh token:', err);
                  return Promise.reject(err); // Redirect to login or handle error
              } finally {
                  isRefreshing = false;
              }
          }

          return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
          }).then(token => {
              config.headers['Authorization'] = `Bearer ${token}`;
              return config;
          });
      }

      if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
  },
  (error) => {
      console.error('Request Interceptor Error:', error);
      return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
              console.error('Response Interceptor: No refresh token available.');
              return Promise.reject(error);
          }

          try {
              const newToken = await refreshAccessToken(refreshToken);
              localStorage.setItem('token', newToken);
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
          } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              return Promise.reject(refreshError); 
          }
      }

      return Promise.reject(error);
  }
);

export default axiosInstance; 
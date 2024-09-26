import axios from 'axios';
import { refreshAccessToken } from './refereshToken';
import { logoutUser } from './logoutUser'; // Import the logout function


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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
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
    const refreshToken = localStorage.getItem('refreshToken');

    if (config.url === '/login' || config.url === '/register') {
      return config;
    }

    if(!token){
      window.location.href = '/login';
    }

    if (!refreshToken) {
      // Clear any existing token from the headers
      delete config.headers['Authorization'];
      return config; // Proceed without modifying the request
    }


    if (token && decodeToken(token) < Date.now()) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken(); 
          localStorage.setItem('token', newToken);
          processQueue(null, newToken);
        } catch (err) {
          processQueue(err, null);
          console.error('Failed to refresh token:', err);
          // If refresh fails, log out the user
          await logoutUser(); 
          window.location.href = '/login';
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        config.headers['Authorization'] = `Bearer ${newToken}`;
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401) {
      const errorMessage = error.response.data.message;

      if (errorMessage === 'TokenExpired') {
        // Token expired, try to refresh
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const newToken = await refreshAccessToken(refreshToken);
          localStorage.setItem('token', newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error('Refresh failed:', err);
          // If refresh fails, log out the user via backend
          await logoutUser();
          return Promise.reject(err);
        }
      } else if (errorMessage === 'InvalidToken') {
        // Token is manipulated, log out the user via backend
        const refreshToken = localStorage.getItem('refreshToken');
        await logoutUser(); // Call the backend logout API
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from 'axios';

// Axios instance for public requests (e.g., fetching products, categories)
const publicAxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

export default publicAxiosInstance;

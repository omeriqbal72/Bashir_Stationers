// refreshToken.js
import axios from 'axios';

// Function to refresh access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post('http://localhost:8080/refresh-token', {}, {
      withCredentials: true 
    });

    const { token } = response.data;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    if (error.response?.status === 403) {
      console.log('Refresh token is invalid. Logging out...');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login'; // Redirect to login
    }
    throw error;
  }

};

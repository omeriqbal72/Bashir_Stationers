import axios from 'axios';

// Function to refresh the access token
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post('http://localhost:8080/refresh-token', { refreshToken });
    
    // Check if response contains the accessToken
    if (response.data && response.data.accessToken) {
      return response.data.accessToken;
    } else {
      throw new Error('Access token not found in response');
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error; // Let this be caught by the axios interceptor
  }
};

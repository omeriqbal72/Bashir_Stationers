import axios from 'axios';

// Function to log out the user
export const logoutUser = async () => {
  try {
    const response = await axios.post('http://localhost:8080/logout');

    if (response.status === 200) {
      // Clear tokens and user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      window.location.href = '/login'; // Redirect to login page
    } else {
      throw new Error('Failed to log out user');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Make sure tokens are cleared even if logout fails
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    window.location.href = '/login'; // Redirect to login page
  }
};

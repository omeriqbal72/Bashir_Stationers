import React, { createContext, useState, useEffect , useContext } from 'react';
import axiosInstance from '../utils/axiosInstance.js';
import { useNavigate, useLocation, replace } from 'react-router-dom';

const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email, password) => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
  
      // Get cart from local storage
      const cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
      console.log('Cart to be sent:', cart); // Log cart to verify its contents
  
      // Send login request with cart
      const response = await axiosInstance.post('/login', { email, password, cart });
      const { user, token, refreshToken, message, status } = response.data;
  
      if (status === 'unverified') {
        setError(message);
        localStorage.setItem('email', user.email);
        navigate('/verify-email');
        return;
      }
  
      if (user && user.isVerified) {
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
      } else {
        console.log('Unexpected status:', status);
        setError('Unexpected status');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Login failed');
    }
  };
  
  

  const signup = async (userData) => {
    try {
      await axiosInstance.post('/register', userData);
      localStorage.setItem('email', userData.email);
      navigate('/verify-email');
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
      console.error('Signup failed', error);
    }
  };

  // Frontend: verifyEmail function
const verifyEmail = async (code) => {
  try {
    const storedEmail = localStorage.getItem('email'); // Retrieve stored email
    if (!storedEmail) {
      throw new Error('Email is missing for verification');
    }

    const response = await axiosInstance.post('/verify-email', { email: storedEmail, code }, { withCredentials: true });
    if (response.status === 200) {
      localStorage.removeItem('email');
      navigate('/login');
    }
  } catch (error) {
    
    const errorMessage = error.response?.data?.message || 'Verification failed';
    setError(errorMessage); // Display the error message in your UI
    console.error('Verification failed:', errorMessage);
  }
};


  const requestNewCode = async () => {
    try {
      const storedEmail = localStorage.getItem('email');
      if (!storedEmail) {
        throw new Error('Email is missing for requesting a new code');
      }

      const response = await axiosInstance.post('/request-new-code', { email: storedEmail });
      if (response.status === 200) {
        // Handle success
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to request new code');
    }
  };


  const logout = async () => {
    try {
      await axiosInstance.post('/logout');
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/'); 
    } catch (error) {
      console.error('Logout failed', error);
      // Optionally set an error state to show a message to the user
      setError('Logout failed, please try again.');
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axiosInstance.post('/forgot-password', { email });
      return response.data.message;
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset password email');
      throw err;
    }
  };

  const verifyResetCode = async (email, code) => {
    try {
      const response = await axiosInstance.post('/verify-reset-code', { email, code });
      return response.data.message;  // Return success message
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset code');
      throw err;
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      const response = await axiosInstance.post('/reset-password', { email, newPassword });
      navigate('/login'); 
      return response.data.message;  // Return success message
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
      throw err;
    }
  };

  const getMe = async () => {
    if (location.pathname === '/verify-email') {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axiosInstance.get('/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Clear tokens and user state if unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setError('Unauthorized, please log in again.');
      } else {
        console.error('Fetching user failed', error);
        setError('Fetching user failed');
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (user === null) {
      getMe();
    } else {
      setLoading(false);
    }
  }, [user, location.pathname]);

  return (
    <UserContext.Provider value={{ user, login, signup, verifyEmail, requestNewCode, logout, loading, error , verifyResetCode ,forgotPassword ,resetPassword }}>
      {children}
    </UserContext.Provider>
  );
};



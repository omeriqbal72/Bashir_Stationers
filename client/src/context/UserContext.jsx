import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance.js';
import { useNavigate, useLocation } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      const { user, token, refreshToken, message, status } = response.data;

      if (status === 'unverified') {
        setError(message);
        localStorage.setItem('email', user.email); // Store email in localStorage to use during verification
        navigate('/verify-email'); // Redirect to verification page
        return;
      }

      if (user && user.isVerified) {
        setUser(user);
        localStorage.setItem('token', token);

        console.log('New token stored:', token);

        localStorage.setItem('refreshToken', refreshToken);
        
        if (user.role === 'admin') {
          console.log(user.role)
          navigate('/admin');
        } else {
          console.log(user.role)
          navigate('/');
        }
      }

      else {
        console.log('Unexpected status:', status);
        setError('Unexpected status');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (email, password) => {
    try {
      await axiosInstance.post('/register', { email, password });
      localStorage.setItem('email', email);
      navigate('/verify-email');
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
      console.error('Signup failed', error);
    }
  };

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
      setError(error.response?.data?.message || 'Verification failed');
      console.error('Verification failed', error);
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
      navigate('/'); // Redirect to login after logout
    } catch (error) {
      console.error('Logout failed', error);
      // Optionally set an error state to show a message to the user
      setError('Logout failed, please try again.');
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
    <UserContext.Provider value={{ user, login, signup, verifyEmail, requestNewCode, logout, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

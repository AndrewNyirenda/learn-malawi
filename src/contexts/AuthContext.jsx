// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 error and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Store new tokens
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Failed to parse stored user:', err);
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  // Login function

const login = async (email, password) => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken } = response.data;
    
    console.log('Login API response:', response.data);
    
    // Store tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Get user profile
    const profileResponse = await api.get('/auth/profile');
    const userData = profileResponse.data;
    
    console.log('User profile API response:', userData);
    
    // Make sure user data has role field
    if (!userData.role) {
      console.warn('User data missing role field:', userData);
      // You might need to add default role or get it from another endpoint
    }
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return { 
      success: true, 
      data: response.data,
      user: userData // Return user data for immediate use
    };
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Login failed';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};


const register = async (userData) => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await api.post('/auth/register', userData);
    const { accessToken, refreshToken } = response.data;
    
    // Store tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Get user profile
    const profileResponse = await api.get('/auth/profile');
    const userProfile = profileResponse.data;
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(userProfile));
    setUser(userProfile);
    
    return { success: true, data: response.data };
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
    
    // Handle specific validation errors
    if (err.response?.data?.error === 'Bad Request' && err.response?.data?.message) {
      // Handle "role must be one of the following values: Admin, Teacher"
      if (err.response.data.message.includes('role must be one of')) {
        setError('Please select either Admin or Teacher as your role');
      } else {
        setError(err.response.data.message);
      }
    } else {
      setError(errorMessage);
    }
    
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Clear state
      setUser(null);
      setError(null);
      setLoading(false);
      
      // Redirect to login
      window.location.href = '/login';
    }
  };

  // Get user profile
  const getProfile = async () => {
    setLoading(true);
    
    try {
      const response = await api.get('/auth/profile');
      const userData = response.data;
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, data: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to get profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Token refresh failed:', err);
      return { success: false };
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(`/users/${user?.id}`, userData);
      const updatedUser = response.data;
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, data: updatedUser };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('accessToken');
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'Admin';
  };

  // Check if user is teacher
  const isTeacher = () => {
    return user?.role === 'Teacher';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getProfile,
    refreshToken,
    updateProfile,
    clearError,
    isAuthenticated,
    hasRole,
    isAdmin,
    isTeacher,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
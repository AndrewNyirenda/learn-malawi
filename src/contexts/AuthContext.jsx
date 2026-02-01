
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});


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

// Enhanced response interceptor with auto-logout
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
        // Refresh failed, trigger auto-logout
        console.error('Token refresh failed, logging out:', refreshError);
        clearAuthData();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors that should trigger logout
    if (error.response?.status === 403 || error.response?.status === 419) {
      console.error('Authentication error, logging out:', error);
      clearAuthData();
      window.location.href = '/login';
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

  // Helper function to clear all auth data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    setUser(null);
    setError(null);
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Parse user data
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Check token expiry
          const expiryTime = localStorage.getItem('tokenExpiry');
          if (expiryTime) {
            const expiryDate = new Date(parseInt(expiryTime));
            if (expiryDate < new Date()) {
              // Token expired, logout
              console.log('Token expired, logging out...');
              clearAuthData();
              window.location.href = '/login';
            }
          }
        } catch (err) {
          console.error('Failed to parse stored user:', err);
          clearAuthData();
        }
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, [clearAuthData]);

  // Set up token expiry check interval
  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiryTime = localStorage.getItem('tokenExpiry');
      if (expiryTime) {
        const expiryDate = new Date(parseInt(expiryTime));
        if (expiryDate < new Date()) {
          console.log('Token expired, auto-logout triggered');
          handleAutoLogout();
        }
      }
    };

    // Check every minute
    const intervalId = setInterval(checkTokenExpiry, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Handle auto-logout
  const handleAutoLogout = useCallback(() => {
    console.log('Auto-logout triggered due to token expiry');
    clearAuthData();
    
    // Show notification before redirecting (optional)
    if (window.location.pathname !== '/login') {
      alert('Your session has expired. Please log in again.');
      window.location.href = '/login';
    }
  }, [clearAuthData]);

  // Login function with token expiry tracking
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, expiresIn } = response.data;
      
      console.log('Login API response:', response.data);
      
      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Calculate and store token expiry time (default to 1 hour if not provided)
      const expiryMs = expiresIn ? parseInt(expiresIn) * 1000 : 60 * 60 * 1000;
      const expiryTime = Date.now() + expiryMs;
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      
      // Get user profile
      const profileResponse = await api.get('/auth/profile');
      const userData = profileResponse.data;
      
      console.log('User profile API response:', userData);
      
      // Make sure user data has role field
      if (!userData.role) {
        console.warn('User data missing role field:', userData);
      }
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { 
        success: true, 
        data: response.data,
        user: userData
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
      const { accessToken, refreshToken, expiresIn } = response.data;
      
      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Calculate and store token expiry time
      const expiryMs = expiresIn ? parseInt(expiresIn) * 1000 : 60 * 60 * 1000;
      const expiryTime = Date.now() + expiryMs;
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      
      
      const profileResponse = await api.get('/auth/profile');
      const userProfile = profileResponse.data;
      
      
      localStorage.setItem('user', JSON.stringify(userProfile));
      setUser(userProfile);
      
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      
      if (err.response?.data?.error === 'Bad Request' && err.response?.data?.message) {
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




const logout = async () => {

  
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ refreshToken }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
      } catch (apiError) {
        console.warn('API logout failed (may be offline), proceeding with local logout:', apiError);
      }
    }
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    
    clearAuthData();
    
    console.log('User logged out successfully');
    


    window.location.replace('/login');
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
      
      // If profile fetch fails due to auth, trigger logout
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('Authentication failed while fetching profile, logging out...');
        clearAuthData();
      }
      
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
      const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
      
      
      if (expiresIn) {
        const expiryMs = parseInt(expiresIn) * 1000;
        const expiryTime = Date.now() + expiryMs;
        localStorage.setItem('tokenExpiry', expiryTime.toString());
      }
      
      return { success: true };
    } catch (err) {
      console.error('Token refresh failed:', err);
      return { success: false };
    }
  };

  
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(`/users/${user?.id}`, userData);
      const updatedUser = response.data;
      
     
     
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

  
  const clearError = () => {
    setError(null);
  };

  
  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) return false;
    
    
    const expiryTime = localStorage.getItem('tokenExpiry');
    if (expiryTime) {
      const expiryDate = new Date(parseInt(expiryTime));
      if (expiryDate < new Date()) {
        console.log('Token has expired');
        return false;
      }
    }
    
    return true;
  };


  const hasRole = (role) => {
    return user?.role === role;
  };

  
  const isAdmin = () => {
    return user?.role === 'Admin';
  };

  
  const isTeacher = () => {
    return user?.role === 'Teacher';
  };

  
  const getRemainingSessionTime = () => {
    const expiryTime = localStorage.getItem('tokenExpiry');
    if (!expiryTime) return 0;
    
    const remainingMs = parseInt(expiryTime) - Date.now();
    return Math.max(0, Math.floor(remainingMs / 1000)); 
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
    getRemainingSessionTime, // Optional: for showing session timer
    clearAuthData, // Export for emergency cleanup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
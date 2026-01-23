// src/contexts/UserContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

const UserContext = createContext();

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  // Get all users (admin only)
  const getAllUsers = async () => {
    if (!isAdmin()) {
      setError('Unauthorized: Admin access required');
      return { success: false, error: 'Unauthorized' };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch users';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get single user
  const getUserById = async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/users/${userId}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch user';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Create user (admin only)
  const createUser = async (userData) => {
    if (!isAdmin()) {
      setError('Unauthorized: Admin access required');
      return { success: false, error: 'Unauthorized' };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/users', userData);
      setUsers(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create user';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (userId, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(`/users/${userId}`, userData);
      
      // Update in local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? response.data : user
        )
      );
      
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update user';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete user (admin only)
  const deleteUser = async (userId) => {
    if (!isAdmin()) {
      setError('Unauthorized: Admin access required');
      return { success: false, error: 'Unauthorized' };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/users/${userId}`);
      
      // Remove from local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete user';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const searchUsers = async (searchTerm) => {
    setLoading(true);
    setError(null);
    
    try {
      // Note: Your backend needs to implement search endpoint
      // This is a client-side search as fallback
      const response = await api.get('/users');
      const allUsers = response.data;
      
      const filteredUsers = allUsers.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setUsers(filteredUsers);
      return { success: true, data: filteredUsers };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to search users';
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

  // Clear users
  const clearUsers = () => {
    setUsers([]);
  };

  const value = {
    users,
    loading,
    error,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    clearError,
    clearUsers,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
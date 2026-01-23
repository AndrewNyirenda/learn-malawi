// src/src/contexts/MessagesContext.jsx
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

const MessagesContext = createContext();

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Fetch all messages
  const fetchMessages = async (status = '', search = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      
      const response = await api.get(`/messages?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      setMessages(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch messages';
      setError(errorMessage);
      console.error('Error fetching messages:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch single message by ID
  const fetchMessageById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/messages/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch message';
      setError(errorMessage);
      console.error('Error fetching message by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update message status
  const updateMessageStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.patch(`/messages/${id}/status`, { status }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Update in local state
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === id ? response.data : msg
        )
      );
      
      // Update stats if they exist
      if (stats) {
        const newStats = { ...stats };
        if (status === 'read') {
          newStats.new = Math.max(0, newStats.new - 1);
          newStats.read = newStats.read + 1;
        }
        setStats(newStats);
      }
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update message status';
      setError(errorMessage);
      console.error('Error updating message status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const deleteMessage = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      await api.delete(`/messages/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Remove from local state
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== id)
      );
      
      // Update stats if they exist
      if (stats) {
        const message = messages.find(msg => msg.id === id);
        if (message) {
          const newStats = { ...stats };
          newStats.total = Math.max(0, newStats.total - 1);
          if (message.status === 'new') {
            newStats.new = Math.max(0, newStats.new - 1);
          } else if (message.status === 'read') {
            newStats.read = Math.max(0, newStats.read - 1);
          }
          setStats(newStats);
        }
      }
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete message';
      setError(errorMessage);
      console.error('Error deleting message:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/messages/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      setStats(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Return default stats if endpoint doesn't exist
      const defaultStats = {
        total: messages.length,
        new: messages.filter(m => m.status === 'new').length,
        read: messages.filter(m => m.status === 'read').length,
      };
      setStats(defaultStats);
      return defaultStats;
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const markAsRead = async (id) => {
    return updateMessageStatus(id, 'read');
  };

  // Mark as new
  const markAsNew = async (id) => {
    return updateMessageStatus(id, 'new');
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Initialize with data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          await fetchMessages();
          await fetchStats();
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const value = {
    messages,
    loading,
    error,
    stats,
    fetchMessages,
    fetchMessageById,
    updateMessageStatus,
    deleteMessage,
    fetchStats,
    markAsRead,
    markAsNew,
    clearError,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesContext;
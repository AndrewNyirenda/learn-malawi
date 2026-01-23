import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('Response error:', {
      message: errorMessage,
      status: error.response?.status,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

const CareerResourcesContext = createContext();

export const useCareerResources = () => {
  const context = useContext(CareerResourcesContext);
  if (!context) {
    throw new Error('useCareerResources must be used within a CareerResourcesProvider');
  }
  return context;
};

export const CareerResourcesProvider = ({ children }) => {
  const [careerResources, setCareerResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [resourceDetail, setResourceDetail] = useState(null);

  // Test API connection
const testConnection = async () => {
  try {
    console.log('Testing connection to career resources API...');

    const response = await api.get(`/career-resources?limit=1`, { timeout: 15000 });
    console.log('Connection successful:', response.status);
    return true;
  } catch (err) {
    console.error('Connection failed:', err.message);
    return false;
  }
};

  // Fetch all career resources
  const fetchCareerResources = async (page = 1, limit = 12, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.sort && { sort: filters.sort }),
      });

      const response = await api.get(`/career-resources?${params}`);
      
      if (response.data) {
        setCareerResources(response.data);
        return {
          data: response.data,
          total: response.data.length,
          page: page,
        };
      }
      return { data: [], total: 0, page: 1 };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch career resources';
      setError(errorMessage);
      console.error('Error fetching career resources:', {
        message: err.message,
        status: err.response?.status,
      });
      
      return { data: [], total: 0, page: 1 };
    } finally {
      setLoading(false);
    }
  };

  // Fetch single career resource by ID
  const fetchCareerResourceById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/career-resources/${id}`);
      setResourceDetail(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch career resource';
      setError(errorMessage);
      console.error('Error fetching career resource by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create career resource (admin only)
  const createCareerResource = async (resourceData, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/career-resources', resourceData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Add to local state
      setCareerResources(prevResources => [response.data, ...prevResources]);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create career resource';
      setError(errorMessage);
      console.error('Error creating career resource:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update career resource (admin only)
  const updateCareerResource = async (id, resourceData, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(`/career-resources/${id}`, resourceData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Update in local state
      setCareerResources(prevResources =>
        prevResources.map(resource =>
          resource.id === parseInt(id) ? response.data : resource
        )
      );
      
      if (resourceDetail?.id === parseInt(id)) {
        setResourceDetail(response.data);
      }
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update career resource';
      setError(errorMessage);
      console.error('Error updating career resource:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete career resource (admin only)
  const deleteCareerResource = async (id, token) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/career-resources/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Remove from local state
      setCareerResources(prevResources =>
        prevResources.filter(resource => resource.id !== parseInt(id))
      );
      
      if (resourceDetail?.id === parseInt(id)) {
        setResourceDetail(null);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete career resource';
      setError(errorMessage);
      console.error('Error deleting career resource:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats (admin only)
  const fetchStats = async (token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/career-resources/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setStats(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Return empty stats if endpoint doesn't exist
      return {
        totalResources: careerResources.length,
        lastUpdated: new Date().toISOString(),
      };
    } finally {
      setLoading(false);
    }
  };

  // Search career resources
  const searchCareerResources = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/career-resources/search?q=${encodeURIComponent(query)}`);
      setCareerResources(response.data);
      return response.data;
    } catch (err) {
      console.error('Error searching career resources:', err);
      // If search endpoint doesn't exist, filter locally
      const filtered = careerResources.filter(resource =>
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.description.toLowerCase().includes(query.toLowerCase())
      );
      setCareerResources(filtered);
      return filtered;
    } finally {
      setLoading(false);
    }
  };

  // Initialize with data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      
      // Test connection first
      const isConnected = await testConnection();
      
      if (!isConnected) {
        setError('Backend server is not running. Please start your NestJS backend on http://localhost:3000');
        setLoading(false);
        return;
      }

      try {
        await fetchCareerResources();
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const value = {
    careerResources,
    resourceDetail,
    loading,
    error,
    stats,
    fetchCareerResources,
    fetchCareerResourceById,
    createCareerResource,
    updateCareerResource,
    deleteCareerResource,
    searchCareerResources,
    fetchStats,
    testConnection,
    clearError: () => setError(null),
    clearResourceDetail: () => setResourceDetail(null),
  };

  return (
    <CareerResourcesContext.Provider value={value}>
      {children}
    </CareerResourcesContext.Provider>
  );
};

export default CareerResourcesContext;
// src/contexts/TutorialsContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

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

const TutorialsContext = createContext();

export const useTutorials = () => {
  const context = useContext(TutorialsContext);
  if (!context) {
    throw new Error('useTutorials must be used within a TutorialsProvider');
  }
  return context;
};

export const TutorialsProvider = ({ children }) => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [tutorialDetail, setTutorialDetail] = useState(null);

  // Fetch all tutorials with filters
  const fetchTutorials = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        ...(filters.level && { level: filters.level }),
        ...(filters.subject && filters.subject !== 'all' && { subject: filters.subject }),
        ...(filters.class && filters.class !== 'all' && { class: filters.class }),
      });

      const response = await api.get(`/tutorials?${params}`);
      
      if (response.data) {
        setTutorials(response.data);
        return {
          data: response.data,
          total: response.data.length,
        };
      }
      return { data: [], total: 0 };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tutorials';
      setError(errorMessage);
      console.error('Error fetching tutorials:', {
        message: err.message,
        status: err.response?.status,
      });
      
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  // Fetch single tutorial by ID
  const fetchTutorialById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/tutorials/${id}`);
      setTutorialDetail(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tutorial';
      setError(errorMessage);
      console.error('Error fetching tutorial by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch levels
  const fetchLevels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/tutorials/levels');
      setLevels(response.data.levels || []);
      return response.data.levels || [];
    } catch (err) {
      console.error('Error fetching levels:', err);
      // Return default levels if endpoint doesn't exist
      const defaultLevels = ['primary', 'secondary'];
      setLevels(defaultLevels);
      return defaultLevels;
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects
  const fetchSubjects = async (level = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (level) {
        params.append('level', level);
      }

      const response = await api.get(`/tutorials/subjects?${params}`);
      setSubjects(response.data.subjects || []);
      return response.data.subjects || [];
    } catch (err) {
      console.error('Error fetching subjects:', err);
      // Return default subjects based on level
      const defaultSubjects = level === 'primary' 
        ? ['English', 'Mathematics', 'Science', 'Chichewa']
        : ['Chemistry', 'Biology', 'Physics', 'Mathematics', 'English', 'History'];
      setSubjects(defaultSubjects);
      return defaultSubjects;
    } finally {
      setLoading(false);
    }
  };

  // Fetch classes
  const fetchClasses = async (level = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (level) {
        params.append('level', level);
      }

      const response = await api.get(`/tutorials/classes?${params}`);
      setClasses(response.data.classes || []);
      return response.data.classes || [];
    } catch (err) {
      console.error('Error fetching classes:', err);
      // Return default classes based on level
      const defaultClasses = level === 'primary' 
        ? ['Standard 5', 'Standard 6', 'Standard 7', 'Standard 8']
        : ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
      setClasses(defaultClasses);
      return defaultClasses;
    } finally {
      setLoading(false);
    }
  };

  // Create tutorial (admin/teacher only)
  const createTutorial = async (tutorialData, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/tutorials', tutorialData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Add to local state
      setTutorials(prevTutorials => [response.data, ...prevTutorials]);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create tutorial';
      setError(errorMessage);
      console.error('Error creating tutorial:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update tutorial (admin/teacher only)
  const updateTutorial = async (id, tutorialData, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(`/tutorials/${id}`, tutorialData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Update in local state
      setTutorials(prevTutorials =>
        prevTutorials.map(tutorial =>
          tutorial.id === parseInt(id) ? response.data : tutorial
        )
      );
      
      if (tutorialDetail?.id === parseInt(id)) {
        setTutorialDetail(response.data);
      }
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update tutorial';
      setError(errorMessage);
      console.error('Error updating tutorial:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete tutorial (admin/teacher only)
  const deleteTutorial = async (id, token) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/tutorials/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Remove from local state
      setTutorials(prevTutorials =>
        prevTutorials.filter(tutorial => tutorial.id !== parseInt(id))
      );
      
      if (tutorialDetail?.id === parseInt(id)) {
        setTutorialDetail(null);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete tutorial';
      setError(errorMessage);
      console.error('Error deleting tutorial:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Test API connection
  const testConnection = async () => {
    try {
      console.log('Testing connection to tutorials API...');
      const response = await axios.get(`${API_BASE_URL}/tutorials?limit=1`, { timeout: 5000 });
      console.log('Connection successful:', response.status);
      return true;
    } catch (err) {
      console.error('Connection failed:', err.message);
      return false;
    }
  };

  // Initialize with data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      
      try {
        await Promise.all([
          fetchTutorials(),
          fetchLevels(),
        ]);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const value = {
    tutorials,
    tutorialDetail,
    levels,
    subjects,
    classes,
    loading,
    error,
    fetchTutorials,
    fetchTutorialById,
    fetchLevels,
    fetchSubjects,
    fetchClasses,
    createTutorial,
    updateTutorial,
    deleteTutorial,
    testConnection,
    clearError: () => setError(null),
    clearTutorialDetail: () => setTutorialDetail(null),
  };

  return (
    <TutorialsContext.Provider value={value}>
      {children}
    </TutorialsContext.Provider>
  );
};

export default TutorialsContext;
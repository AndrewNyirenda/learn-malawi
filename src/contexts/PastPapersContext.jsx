import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

const PastPapersContext = createContext();

export const usePastPapers = () => {
  const context = useContext(PastPapersContext);
  if (!context) {
    throw new Error('usePastPapers must be used within a PastPapersProvider');
  }
  return context;
};

export const PastPapersProvider = ({ children }) => {
  const [pastPapers, setPastPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [years, setYears] = useState([]);
  const [examinationBodies, setExaminationBodies] = useState([]);
  const [latestPastPapers, setLatestPastPapers] = useState([]);
  const [stats, setStats] = useState(null);

  // Test API connection
  const testConnection = async () => {
    try {
      console.log('Testing connection to past papers API...');
      const response = await axios.get(`${API_BASE_URL}/past-papers?limit=1`, { timeout: 5000 });
      console.log('Connection successful:', response.status);
      return true;
    } catch (err) {
      console.error('Connection failed:', err.message);
      return false;
    }
  };

  // Fetch all past papers with filters
  const fetchPastPapers = async (page = 1, limit = 12, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.level && { level: filters.level }),
        ...(filters.category && filters.category !== 'all' && { category: filters.category }),
        ...(filters.class && filters.class !== 'all' && { class: filters.class }),
        ...(filters.year && filters.year !== 'all' && { year: filters.year.toString() }),
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.examinationBody && { examinationBody: filters.examinationBody }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await api.get(`/past-papers?${params}`);
      
      if (response.data && response.data.data) {
        setPastPapers(response.data.data);
        return {
          data: response.data.data,
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
        };
      }
      return { data: [], total: 0, page: 1, totalPages: 0 };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch past papers';
      setError(errorMessage);
      console.error('Error fetching past papers:', {
        message: err.message,
        code: err.code,
        config: err.config,
      });
      return { data: [], total: 0, page: 1, totalPages: 0 };
    } finally {
      setLoading(false);
    }
  };

  // Fetch single past paper
  const fetchPastPaperById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/past-papers/${id}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch past paper';
      setError(errorMessage);
      console.error('Error fetching past paper by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async (level = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (level) {
        params.append('level', level);
      }

      const response = await api.get(`/past-papers/categories?${params}`);
      setCategories(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Return default categories for development
      return [
        { category: "Agriculture", count: 2 },
        { category: "Biology", count: 2 },
        { category: "Chemistry", count: 2 },
        { category: "English", count: 3 },
        { category: "Mathematics", count: 4 },
        { category: "Chichewa", count: 2 },
        { category: "Science", count: 2 },
        { category: "Expressive Arts", count: 1 },
        { category: "Life Skills", count: 1 },
        { category: "Social Studies", count: 1 },
        { category: "Religious Studies", count: 2 },
        { category: "General", count: 2 },
      ];
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

      const response = await api.get(`/past-papers/classes?${params}`);
      setClasses(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching classes:', err);
      // Return default classes based on level
      if (level === 'primary') {
        return [
          { class: "Standard 5", count: 1 },
          { class: "Standard 6", count: 1 },
          { class: "Standard 7", count: 1 },
          { class: "Standard 8", count: 5 },
        ];
      } else {
        return [
          { class: "Form 1", count: 0 },
          { class: "Form 2", count: 0 },
          { class: "Form 3", count: 2 },
          { class: "Form 4", count: 13 },
        ];
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch years
  const fetchYears = async (level = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (level) {
        params.append('level', level);
      }

      const response = await api.get(`/past-papers/years?${params}`);
      setYears(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching years:', err);
      // Return default years
      return [
        { year: 2025, count: 10 },
        { year: 2024, count: 8 },
      ];
    } finally {
      setLoading(false);
    }
  };

  // Fetch examination bodies
  const fetchExaminationBodies = async (level = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (level) {
        params.append('level', level);
      }

      const response = await api.get(`/past-papers/examination-bodies?${params}`);
      setExaminationBodies(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching examination bodies:', err);
      return [
        { examinationBody: "MANEB", count: 2 },
        { examinationBody: "CEED", count: 8 },
      ];
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest past papers
  const fetchLatestPastPapers = async (level = null, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (level) {
        params.append('level', level);
      }

      const response = await api.get(`/past-papers/latest?${params}`);
      setLatestPastPapers(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching latest past papers:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats (admin only)
  const fetchStats = async (token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/past-papers/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setStats(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching stats:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get view URL for PDF
  const getViewUrl = async (pastPaperId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/past-papers/${pastPaperId}/view`);
      return response.data;
    } catch (err) {
      console.error('Error getting view URL:', err);
      // Fallback to direct file URL
      const pastPaper = pastPapers.find(p => p.id === pastPaperId);
      if (pastPaper && pastPaper.fileUrl) {
        return {
          viewUrl: pastPaper.fileUrl,
          fileName: pastPaper.fileName || pastPaper.title
        };
      }
      throw new Error('Could not get view URL');
    } finally {
      setLoading(false);
    }
  };

  // Get download URL for PDF
  const getDownloadUrl = async (pastPaperId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/past-papers/${pastPaperId}/download`);
      return response.data;
    } catch (err) {
      console.error('Error getting download URL:', err);
      // Fallback to direct file URL
      const pastPaper = pastPapers.find(p => p.id === pastPaperId);
      if (pastPaper && pastPaper.fileUrl) {
        return {
          downloadUrl: pastPaper.fileUrl,
          fileName: pastPaper.fileName || pastPaper.title
        };
      }
      throw new Error('Could not get download URL');
    } finally {
      setLoading(false);
    }
  };

  // Create past paper (requires authentication)
  const createPastPaper = async (pastPaperData, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/past-papers', pastPaperData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Add to local state
      setPastPapers(prevPapers => [response.data, ...prevPapers]);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create past paper';
      setError(errorMessage);
      console.error('Error creating past paper:', err);
      throw err;
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
        await Promise.all([
          fetchPastPapers(),
          fetchCategories(),
          fetchClasses(),
          fetchYears(),
          fetchLatestPastPapers(),
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
    pastPapers,
    latestPastPapers,
    categories,
    classes,
    years,
    examinationBodies,
    stats,
    loading,
    error,
    fetchPastPapers,
    fetchPastPaperById,
    fetchCategories,
    fetchClasses,
    fetchYears,
    fetchExaminationBodies,
    fetchLatestPastPapers,
    fetchStats,
    getViewUrl,
    getDownloadUrl,
    createPastPaper,
    testConnection,
    clearError: () => setError(null),
  };

  return <PastPapersContext.Provider value={value}>{children}</PastPapersContext.Provider>;
};
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

const StudyNotesContext = createContext();

export const useStudyNotes = () => {
  const context = useContext(StudyNotesContext);
  if (!context) {
    throw new Error('useStudyNotes must be used within a StudyNotesProvider');
  }
  return context;
};

export const StudyNotesProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [latestBooks, setLatestBooks] = useState([]);
  const [stats, setStats] = useState(null);

  // Test API connection
  const testConnection = async () => {
    try {
      console.log('Testing connection to books API...');
      const response = await axios.get(`${API_BASE_URL}/books?limit=1`, { timeout: 15000 });
      console.log('Connection successful:', response.status);
      return true;
    } catch (err) {
      console.error('Connection failed:', err.message);
      return false;
    }
  };

  // Fetch all books with filters
  const fetchBooks = async (page = 1, limit = 12, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.level && { level: filters.level }),
        ...(filters.category && filters.category !== 'all' && { category: filters.category }),
        ...(filters.class && filters.class !== 'all' && { class: filters.class }),
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await api.get(`/books?${params}`);
      
      if (response.data && response.data.data) {
        setBooks(response.data.data);
        return {
          data: response.data.data,
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
        };
      }
      return { data: [], total: 0, page: 1, totalPages: 0 };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch books';
      setError(errorMessage);
      console.error('Error fetching books:', {
        message: err.message,
        code: err.code,
        config: err.config,
      });
      return { data: [], total: 0, page: 1, totalPages: 0 };
    } finally {
      setLoading(false);
    }
  };

  // Fetch single book
  const fetchBookById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch book';
      setError(errorMessage);
      console.error('Error fetching book by ID:', err);
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

      const response = await api.get(`/books/categories?${params}`);
      setCategories(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Return default categories for development
      return [
        { category: "Mathematics", count: 5 },
        { category: "English", count: 4 },
        { category: "Biology", count: 3 },
        { category: "Chemistry", count: 3 },
        { category: "Physics", count: 2 },
        { category: "History", count: 2 },
        { category: "Geography", count: 2 },
        { category: "Computer", count: 1 },
        { category: "Literature", count: 3 },
        { category: "Religious Studies", count: 2 },
        { category: "Agriculture", count: 2 },
        { category: "Chichewa", count: 2 },
        { category: "Study Skills", count: 1 },
        { category: "Expressive Arts", count: 1 },
        { category: "Life Skills", count: 1 },
        { category: "Social Studies", count: 1 },
        { category: "Science", count: 2 },
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

      const response = await api.get(`/books/classes?${params}`);
      setClasses(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching classes:', err);
      // Return default classes based on level
      if (level === 'primary') {
        return [
          { class: "Standard 5", count: 1 },
          { class: "Standard 6", count: 1 },
          { class: "Standard 7", count: 4 },
          { class: "Standard 8", count: 8 },
        ];
      } else {
        return [
          { class: "Form 1", count: 1 },
          { class: "Form 2", count: 2 },
          { class: "Form 3", count: 6 },
          { class: "Form 4", count: 9 },
        ];
      }
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

      const response = await api.get(`/books/subjects?${params}`);
      setSubjects(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching subjects:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest books
  const fetchLatestBooks = async (level = null, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (level) {
        params.append('level', level);
      }

      const response = await api.get(`/books/latest?${params}`);
      setLatestBooks(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching latest books:', err);
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
      const response = await api.get('/books/stats', {
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
  const getViewUrl = async (bookId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/books/${bookId}/view`);
      return response.data;
    } catch (err) {
      console.error('Error getting view URL:', err);
      // Fallback to direct file URL
      const book = books.find(b => b.id === bookId);
      if (book && book.fileUrl) {
        return {
          viewUrl: book.fileUrl,
          fileName: book.fileName || book.title
        };
      }
      throw new Error('Could not get view URL');
    } finally {
      setLoading(false);
    }
};




const getDownloadUrl = async (bookId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/books/${bookId}/download`);
      return response.data;
    } catch (err) {
      console.error('Error getting download URL:', err);
      // Fallback to direct file URL
      const book = books.find(b => b.id === bookId);
      if (book && book.fileUrl) {
        return {
          downloadUrl: book.fileUrl,
          fileName: book.fileName || book.title
        };
      }
      throw new Error('Could not get download URL');
    } finally {
      setLoading(false);
    }
};

  // Create book (requires authentication)
  const createBook = async (bookData, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/books', bookData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Add to local state
      setBooks(prevBooks => [response.data, ...prevBooks]);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create book';
      setError(errorMessage);
      console.error('Error creating book:', err);
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
          fetchBooks(),
          fetchCategories(),
          fetchClasses(),
          fetchLatestBooks(),
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
    books,
    latestBooks,
    categories,
    classes,
    subjects,
    stats,
    loading,
    error,
    fetchBooks,
    fetchBookById,
    fetchCategories,
    fetchClasses,
    fetchSubjects,
    fetchLatestBooks,
    fetchStats,
    getViewUrl,
    getDownloadUrl,
    createBook,
    testConnection,
    clearError: () => setError(null),
  };

  return <StudyNotesContext.Provider value={value}>{children}</StudyNotesContext.Provider>;
};
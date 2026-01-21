import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Update with your actual API URL

const NewsContext = createContext();

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [latestNews, setLatestNews] = useState([]);

  // Fetch all news with pagination
  const fetchNews = async (page = 1, limit = 10, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.category && { category: filters.category }),
        ...(filters.authorId && { authorId: filters.authorId }),
        ...(filters.published !== undefined && { published: filters.published.toString() }),
      });

      const response = await axios.get(`${API_BASE_URL}/news?${params}`);
      
      if (response.data && response.data.data) {
        setNews(response.data.data);
        return {
          data: response.data.data,
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
        };
      }
      return { data: [], total: 0, page: 1, totalPages: 0 };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch news';
      setError(errorMessage);
      console.error('Error fetching news:', err);
      return { data: [], total: 0, page: 1, totalPages: 0 };
    } finally {
      setLoading(false);
    }
  };

  // Fetch single news article
  const fetchNewsById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/news/${id}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch news article';
      setError(errorMessage);
      console.error('Error fetching news by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/news/categories`);
      setCategories(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest news
  const fetchLatestNews = async (limit = 5) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/news/latest?limit=${limit}`);
      setLatestNews(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch latest news';
      setError(errorMessage);
      console.error('Error fetching latest news:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create news article (requires authentication)
  const createNews = async (newsData, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/news`, newsData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Add to local state
      setNews(prevNews => [response.data, ...prevNews]);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create news article';
      setError(errorMessage);
      console.error('Error creating news:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload image (requires authentication)
  const uploadImage = async (newsId, imageFile, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(
        `${API_BASE_URL}/news/${newsId}/image`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update local state
      setNews(prevNews =>
        prevNews.map(article =>
          article.id === newsId ? response.data : article
        )
      );

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload image';
      setError(errorMessage);
      console.error('Error uploading image:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize with data
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchNews(),
        fetchCategories(),
        fetchLatestNews(),
      ]);
    };

    initializeData();
  }, []);

  const value = {
    news,
    latestNews,
    categories,
    loading,
    error,
    fetchNews,
    fetchNewsById,
    fetchCategories,
    fetchLatestNews,
    createNews,
    uploadImage,
    setNews,
    clearError: () => setError(null),
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};
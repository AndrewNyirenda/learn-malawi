// src/components/admin-componenents/AdminNews.jsx
import React, { useState, useEffect } from 'react';
import { useNews } from '../../contexts/NewsContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaNewspaper,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendar,
  FaUser,
  FaChartLine,
  FaSync,
  FaExclamationCircle,
  FaArrowUp,
  FaArrowDown,
  FaTh,
  FaList,
  FaClock,
  FaBook,
  FaImage,
  FaGlobe,
  FaCheck,
  FaTimes,
  FaFileImage,
  FaShareAlt,
  FaBullhorn,
  FaLaptop,
  FaRunning,
  FaMusic,
  FaHeartbeat,
  FaGraduationCap,
  FaFlask,
  FaBuilding
} from 'react-icons/fa';
import '../../styles/Admin-Styles/AdminNews.css';
import NewsAddModal from './NewsAddModal';
import NewsEditModal from './NewsEditModal';
import NewsDeleteModal from './NewsDeleteModal';
import NewsPreviewModal from './NewsPreviewModal';

const AdminNews = () => {
  const {
    news,
    loading,
    error,
    fetchNews,
    fetchCategories,
    clearError
  } = useNews();

  const { user: currentAdmin, isAdmin } = useAuth();

  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedNews, setSelectedNews] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [stats, setStats] = useState({
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    totalViews: 0
  });

  // Icon mapping for categories
  const categoryIcons = {
    'Politics': <FaBuilding />,
    'Business': <FaChartLine />,
    'Technology': <FaLaptop />,
    'Sports': <FaRunning />,
    'Entertainment': <FaMusic />,
    'Health': <FaHeartbeat />,
    'Education': <FaGraduationCap />,
    'Science': <FaFlask />,
    'World': <FaGlobe />,
    'Local': <FaBullhorn />
  };

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    // Fetch categories first
    const categoriesData = await fetchCategories();
    
    // Fix categories processing - get just the category names
    let categoriesArray = [];
    if (Array.isArray(categoriesData)) {
      // Check what format the data is in
      if (categoriesData.length > 0 && categoriesData[0].category) {
        // It's an array of objects with category property
        categoriesArray = categoriesData.map(item => item.category);
      } else {
        // It's already an array of strings
        categoriesArray = categoriesData;
      }
    }
    
    setCategories(categoriesArray);

    // Calculate stats from existing news (not from API call)
    const totalNews = news.length || 0;
    const publishedNews = news.filter(n => n.isPublished).length || 0;
    const draftNews = totalNews - publishedNews;
    const totalViews = news.reduce((sum, article) => sum + (article.views || 0), 0) || 0;

    setStats({
      totalNews,
      publishedNews,
      draftNews,
      totalViews
    });
  } catch (err) {
    console.error('Error loading data:', err);
  }
};

  
  // Fetch news when filters change
useEffect(() => {
  const fetchFilteredNews = async () => {
    // Only pass valid API parameters
    const apiFilters = {};
    
    if (filters.category !== 'all') {
      apiFilters.category = filters.category;
    }
    
    // Convert 'status' to 'published' parameter that API understands
    if (filters.status !== 'all') {
      apiFilters.published = filters.status === 'published';
    }
    
    await fetchNews(1, 100, apiFilters);
    
    // Update stats after fetching
    const totalNews = news.length || 0;
    const publishedNews = news.filter(n => n.isPublished).length || 0;
    const draftNews = totalNews - publishedNews;
    const totalViews = news.reduce((sum, article) => sum + (article.views || 0), 0) || 0;

    setStats({
      totalNews,
      publishedNews,
      draftNews,
      totalViews
    });
  };
  
  fetchFilteredNews();
}, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSelectedNews([]);
  };

  // Handle news selection
  const handleSelectNews = (newsId) => {
    if (selectedNews.includes(newsId)) {
      setSelectedNews(selectedNews.filter(id => id !== newsId));
    } else {
      setSelectedNews([...selectedNews, newsId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedNews.length === news.length) {
      setSelectedNews([]);
    } else {
      setSelectedNews(news.map(article => article.id));
    }
  };

  // Handle actions
  const handleAddNews = () => {
    setShowAddModal(true);
  };

  const handleEditNews = (article) => {
    setCurrentNews(article);
    setShowEditModal(true);
  };

  const handleDeleteNews = (article) => {
    setCurrentNews(article);
    setShowDeleteModal(true);
  };

  const handlePreviewNews = (article) => {
    setCurrentNews(article);
    setShowPreviewModal(true);
  };

  const handleDeleteMultiple = () => {
    setCurrentNews(null);
    setShowDeleteModal(true);
  };

  const handlePublishNews = async (article) => {
    // Implementation would go here
    console.log('Publishing article:', article.id);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format excerpt
  const formatExcerpt = (content, length = 100) => {
    if (!content) return '';
    return content.length > length 
      ? content.substring(0, length) + '...' 
      : content;
  };

  // Handle refresh
const handleRefresh = () => {
  // Clear current filters and fetch fresh data
  setFilters({
    category: 'all',
    status: 'all',
    search: ''
  });
  
  // Fetch news without filters
  fetchNews(1, 100, {});
  
  // Refresh categories
  fetchCategories();
  
  clearError();
};

  // Clear search
  const handleClearSearch = () => {
    handleFilterChange('search', '');
  };

  // Filter news by search term
  const filteredNews = Array.isArray(news) ? news.filter(article => {
    if (!filters.search) return true;
    
    const searchTerm = filters.search.toLowerCase();
    return (
      article.title?.toLowerCase().includes(searchTerm) ||
      article.description?.toLowerCase().includes(searchTerm) ||
      article.content?.toLowerCase().includes(searchTerm) ||
      article.category?.toLowerCase().includes(searchTerm)
    );
  }) : [];

  // Apply category filter
  const categoryFilteredNews = filteredNews.filter(article => {
    if (filters.category === 'all') return true;
    return article.category === filters.category;
  });

  // Apply status filter
  const statusFilteredNews = categoryFilteredNews.filter(article => {
    if (filters.status === 'all') return true;
    if (filters.status === 'published') return article.isPublished;
    if (filters.status === 'draft') return !article.isPublished;
    return true;
  });

  // Apply sorting
  const sortedNews = [...statusFilteredNews].sort((a, b) => {
    let aValue = a[sortBy] || '';
    let bValue = b[sortBy] || '';
    
    // Handle dates
    if (sortBy.includes('At') || sortBy.includes('Date')) {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Fix: Properly handle error display
  const getErrorMessage = () => {
    if (!error) return '';
    
    if (typeof error === 'string') return error;
    
    if (error.message) return error.message;
    
    if (typeof error === 'object') {
      return JSON.stringify(error);
    }
    
    return 'An error occurred';
  };

  if (loading && news.length === 0) {
    return (
      <div className="admin-news">
        <div className="loading-news">
          <div className="spinner"></div>
          <p>Loading news articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-news">
      {/* Header */}
      <div className="news-header">
        <div className="header-left">
          <h2>News Management</h2>
          <p>Manage news articles and announcements</p>
        </div>
        <div className="header-right">
          <button 
            className="btn-refresh" 
            onClick={handleRefresh}
            title="Refresh"
          >
            <FaSync /> Refresh
          </button>
          <button 
            className="btn-add-news" 
            onClick={handleAddNews}
            disabled={!isAdmin() && currentAdmin?.role !== 'TEACHER'}
            title={isAdmin() || currentAdmin?.role === 'TEACHER' ? "Add news article" : "Admin/Teacher access required"}
          >
            <FaPlus /> Add News
          </button>
        </div>
      </div>

      {/* Error Display - FIXED */}
      {error && (
        <div className="error-message">
          <FaExclamationCircle />
          <span>{getErrorMessage()}</span>
          <button onClick={clearError} className="close-error">
            <FaTimesCircle />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="news-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaNewspaper />
          </div>
          <div className="stat-content">
            <h3>{stats.totalNews}</h3>
            <p>Total Articles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon published">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.publishedNews}</h3>
            <p>Published</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon draft">
            <FaTimesCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.draftNews}</h3>
            <p>Drafts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon views">
            <FaEye />
          </div>
          <div className="stat-content">
            <h3>{stats.totalViews}</h3>
            <p>Total Views</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="news-controls">
        {/* Search Bar */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search news by title, content, or category..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          {filters.search && (
            <button 
              className="clear-search" 
              onClick={handleClearSearch}
              title="Clear search"
            >
              <FaTimesCircle />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="filters-row">
          {/* Filter Controls */}
          <div className="filter-controls">
            <div className="filter-group">
              <FaFilter className="filter-icon" />
<select 
  value={filters.category} 
  onChange={(e) => handleFilterChange('category', e.target.value)}
  className="filter-select"
>
  <option value="all">All Categories</option>
  {Array.isArray(categories) && categories.map((category, index) => (
    <option key={index} value={category}>
      {category}
    </option>
  ))}
</select>
            </div>

            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="createdAt">Newest First</option>
                <option value="title">Title A-Z</option>
                <option value="category">Category</option>
                <option value="publishedAt">Publish Date</option>
                <option value="readTime">Read Time</option>
              </select>
              <button 
                className="sort-order" 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
              </button>
            </div>

            {/* Status Toggle */}
            <div className="status-toggle">
              <button 
                className={`status-btn ${filters.status === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'all')}
              >
                All
              </button>
              <button 
                className={`status-btn ${filters.status === 'published' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'published')}
              >
                Published
              </button>
              <button 
                className={`status-btn ${filters.status === 'draft' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 'draft')}
              >
                Drafts
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FaTh />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNews.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            <FaCheckCircle />
            <span>{selectedNews.length} article(s) selected</span>
          </div>
          <div className="action-buttons">
            <button 
              className="btn-bulk-delete" 
              onClick={handleDeleteMultiple}
              disabled={!isAdmin()}
            >
              <FaTrash /> Delete Selected
            </button>
            <button 
              className="btn-clear-selection" 
              onClick={() => setSelectedNews([])}
            >
              <FaTimesCircle /> Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* News Gallery */}
      <div className="news-gallery-container">
        {sortedNews.length === 0 ? (
          <div className="no-news">
            <FaNewspaper className="no-news-icon" />
            <h3>No news articles found</h3>
            <p>{filters.search ? 'Try a different search term' : 'Add your first news article to get started'}</p>
            <button className="btn-add-news" onClick={handleAddNews}>
              <FaPlus /> Add First Article
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="news-grid">
            {sortedNews.map(article => (
              <div 
                key={article.id} 
                className={`news-card ${selectedNews.includes(article.id) ? 'selected' : ''}`}
              >
                {/* Selection Checkbox */}
                <div className="news-select">
                  <input
                    type="checkbox"
                    checked={selectedNews.includes(article.id)}
                    onChange={() => handleSelectNews(article.id)}
                    disabled={!isAdmin()}
                  />
                </div>

                {/* News Image */}
                <div className="news-image" onClick={() => handlePreviewNews(article)}>
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} />
                  ) : (
                    <div className="image-placeholder">
                      <FaFileImage />
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="image-overlay">
                    <button className="view-btn-overlay" title="Preview Article">
                      <FaEye />
                    </button>
                  </div>
                </div>

                {/* News Info */}
                <div className="news-info">
                  <span className="news-category">
                    {categoryIcons[article.category] || <FaGlobe />}
                    {article.category}
                  </span>
                  
                  <h3 className="news-title">{article.title}</h3>
                  
                  <p className="news-excerpt">
                    {formatExcerpt(article.description || article.content, 120)}
                  </p>

                  <div className="news-meta">
                    <div className="meta-item">
                      <FaUser />
                      <span>{article.author?.firstName || 'Unknown'}</span>
                    </div>
                    <div className="meta-item">
                      <FaCalendar />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <div className="meta-item">
                      <FaClock />
                      <span>{article.readTime || 5} min read</span>
                    </div>
                  </div>

                  <div className={`status-badge ${article.isPublished ? 'published' : 'draft'}`}>
                    {article.isPublished ? (
                      <>
                        <FaCheckCircle /> Published
                      </>
                    ) : (
                      <>
                        <FaTimesCircle /> Draft
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="news-actions">
                  <button 
                    className="btn-action view"
                    onClick={() => handlePreviewNews(article)}
                    title="Preview Article"
                  >
                    <FaEye />
                  </button>
                  
                  {!article.isPublished && (
                    <button 
                      className="btn-action publish"
                      onClick={() => handlePublishNews(article)}
                      title="Publish Article"
                      disabled={!isAdmin() && article.authorId !== currentAdmin?.id}
                    >
                      <FaBullhorn />
                    </button>
                  )}
                  
                  <button 
                    className="btn-action edit"
                    onClick={() => handleEditNews(article)}
                    title="Edit Article"
                    disabled={!isAdmin() && article.authorId !== currentAdmin?.id}
                  >
                    <FaEdit />
                  </button>
                  
                  <button 
                    className="btn-action delete"
                    onClick={() => handleDeleteNews(article)}
                    title="Delete Article"
                    disabled={!isAdmin()}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="news-list">
            <table className="news-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedNews.length === sortedNews.length && sortedNews.length > 0}
                      onChange={handleSelectAll}
                      disabled={!isAdmin()}
                    />
                  </th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedNews.map(article => (
                  <tr key={article.id} className={selectedNews.includes(article.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedNews.includes(article.id)}
                        onChange={() => handleSelectNews(article.id)}
                        disabled={!isAdmin()}
                      />
                    </td>
                    <td>
                      <div className="news-title-cell">
                        <div className="news-icon">
                          <FaNewspaper />
                        </div>
                        <div>
                          <strong>{article.title}</strong>
                          <small>{formatExcerpt(article.description, 50)}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">
                        {categoryIcons[article.category] || <FaGlobe />}
                        {article.category}
                      </span>
                    </td>
                    <td>
                      <span className="author-name">
                        {article.author?.firstName || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      {article.isPublished ? (
                        <span className="status-badge published">
                          <FaCheck /> Published
                        </span>
                      ) : (
                        <span className="status-badge draft">
                          <FaTimes /> Draft
                        </span>
                      )}
                    </td>
                    <td>
                      {article.publishedAt 
                        ? formatDate(article.publishedAt)
                        : 'Not published'
                      }
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-action view"
                          onClick={() => handlePreviewNews(article)}
                          title="Preview"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn-action edit"
                          onClick={() => handleEditNews(article)}
                          title="Edit"
                          disabled={!isAdmin() && article.authorId !== currentAdmin?.id}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {sortedNews.length > 0 && (
        <div className="news-pagination">
          <div className="pagination-info">
            Showing {sortedNews.length} of {news.length} articles
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <NewsAddModal
          onClose={() => setShowAddModal(false)}
          onSave={loadData}
        />
      )}

      {showEditModal && currentNews && (
        <NewsEditModal
          article={currentNews}
          onClose={() => setShowEditModal(false)}
          onSave={loadData}
        />
      )}

      {showDeleteModal && (
        <NewsDeleteModal
          article={currentNews}
          selectedCount={currentNews ? 1 : selectedNews.length}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={loadData}
        />
      )}

      {showPreviewModal && currentNews && (
        <NewsPreviewModal
          article={currentNews}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};

export default AdminNews;
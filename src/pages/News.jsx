import React, { useState, useEffect } from "react";
import "../styles/news.css";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { useNews } from "../contexts/NewsContext";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const navigate = useNavigate();
  const {
    news,
    categories,
    loading,
    error,
    fetchNews,
    fetchCategories,
    clearError,
  } = useNews();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filters = {
      ...(categoryFilter !== "all" && { category: categoryFilter }),
    };
    fetchNews(currentPage, 12, filters);
  }, [currentPage, categoryFilter]);

  const handleCardClick = (article) => {
    navigate(`/news/${article.id}`);
  };

  const allCategories = ["all", ...new Set([
    ...categories.map(cat => cat.category),
    ...news.map(article => article.category)
  ])].filter(Boolean);

  const filteredNews = news.filter(article => {
    if (!article) return false;
    
    const matchesSearch = 
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const getAuthorName = (author) => {
    if (!author) return "Unknown Author";
    if (typeof author === 'object') {
      return `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.email || "Unknown Author";
    }
    return author;
  };

  if (loading && news.length === 0) {
    return (
      <div className="news-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading news articles...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div className="news-wrapper">
        <div className="error-container">
          <h3>Error Loading News</h3>
          <p>{error}</p>
          <button onClick={() => { clearError(); fetchNews(); }} className="retry-btn">
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="news-wrapper">
        <div className="news-header">
          <h1>Education News & Updates</h1>
          <p className="news-subtitle">
            Stay informed with the latest education news, examination updates, and policy changes from Malawi.
          </p>
        </div>

        {/* Filters Section */}
        <div className="news-filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="news-search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="news-category-select"
            >
              <option value="all">All Categories</option>
              {allCategories
                .filter(cat => cat !== "all")
                .map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              }
            </select>
          </div>
        </div>

        {/* News Grid */}
        <div className="news-grid">
          {filteredNews.length > 0 ? (
            filteredNews.map((article) => (
              <div 
                key={article.id} 
                className="news-card"
                onClick={() => handleCardClick(article)}
              >
                <div className="news-card-image">
                  <img 
                    src={article.imageUrl || "/default-news-image.jpg"} 
                    alt={article.title} 
                    onError={(e) => {
                      e.target.src = "/default-news-image.jpg";
                    }}
                  />
                  {article.category && (
                    <div className="news-card-category">{article.category}</div>
                  )}
                </div>
                <div className="news-card-content">
                  <div className="news-card-meta">
                    <span className="news-date">{formatDate(article.publishedAt || article.createdAt)}</span>
                    <span className="news-read-time">{article.readTime || '5'} min read</span>
                  </div>
                  <h3 className="news-card-title">{article.title}</h3>
                  <p className="news-card-description">{truncateText(article.description)}</p>
                  <div className="news-card-footer">
                    <span className="news-author">By {getAuthorName(article.author)}</span>
                    <button className="read-more-btn">Read Full Story →</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-news-found">
              {searchTerm || categoryFilter !== "all" ? (
                <p>No news articles found matching your search criteria.</p>
              ) : (
                <p>No news articles available at the moment.</p>
              )}
            </div>
          )}
        </div>

        {/* Article Modal - Remains if you still want modal functionality */}
        {selectedArticle && (
          <div className="article-modal-overlay" onClick={() => setSelectedArticle(null)}>
            <div className="article-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelectedArticle(null)}>
                &times;
              </button>
              
              <div className="article-modal-header">
                {selectedArticle.category && (
                  <div className="article-category">{selectedArticle.category}</div>
                )}
                <h2>{selectedArticle.title}</h2>
                <div className="article-meta">
                  <span className="article-date">
                    {formatDate(selectedArticle.publishedAt || selectedArticle.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="article-read-time">{selectedArticle.readTime || '5'} min read</span>
                  <span>•</span>
                  <span className="article-author">By {getAuthorName(selectedArticle.author)}</span>
                </div>
              </div>

              <div className="article-modal-body">
                <div className="article-image">
                  <img 
                    src={selectedArticle.imageUrl || "/default-news-image.jpg"} 
                    alt={selectedArticle.title}
                    onError={(e) => {
                      e.target.src = "/default-news-image.jpg";
                    }}
                  />
                </div>
                <div className="article-content">
                  <p className="article-description">{selectedArticle.description}</p>
                  <div className="article-full-content">
                    {selectedArticle.content?.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="article-modal-footer">
                <button className="share-btn">Share Article</button>
                <button className="close-article-btn" onClick={() => setSelectedArticle(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination - if needed */}
        {news.length > 0 && (
          <div className="news-pagination">
            <button 
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>
            <span className="pagination-info">Page {currentPage}</span>
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default News;
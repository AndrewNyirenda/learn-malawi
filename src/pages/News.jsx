import React, { useState, useEffect } from "react";
import "../styles/news.css";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { useNews } from "../contexts/NewsContext";
import Header from '../components/Header';
import PageHeader from '../components/page-header';
import Filter from '../components/Filter';
import Pagination from '../components/Pagination'; 

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // Add state for total items
  const itemsPerPage = 12;
  
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
    const loadNews = async () => {
      const filters = {
        ...(categoryFilter !== "all" && { category: categoryFilter }),
      };
      const result = await fetchNews(currentPage, itemsPerPage, filters);
      
      // Store the total items from API response
      if (result && result.total) {
        setTotalItems(result.total);
      }
    };
    
    loadNews();
  }, [currentPage, categoryFilter]);

  const handleCardClick = (article) => {
    navigate(`/news/${article.id}`);
  };

  // Prepare categories for the Filter component
  const categoryOptions = [
    ...new Set([
      ...categories.map(cat => cat.category),
      ...news.map(article => article.category)
    ])
  ]
  .filter(Boolean)
  .map(category => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1)
  }));

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
    <>
      <Header />
      <div className="news-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading news articles...</p>
        </div>
      </div> 
      <Footer /> 
    </>
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
      <Header />
      <div className="news-wrapper">
      
        <PageHeader 
          title="Education News & Updates"
          description="Stay informed with the latest education news, examination updates, and policy changes from Malawi."
        />

        {/* Filters Section - Using reusable components */}
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
          
          {/* Use the reusable Filter component for categories */}
          <div className="filter-group">
            <Filter
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
              showAllOption={true}
              allOptionLabel="All Categories"
              allOptionValue="all"
              className="news-category-filter"
              id="news-category-filter"
            />
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
                </div>
                {/* SIMPLIFIED CONTENT STRUCTURE - Strict column layout */}
                <div className="news-card-content">
                  <div className="news-card-text">
                    <h3 className="news-card-title">{article.title}</h3>
                    <p className="news-card-description">{truncateText(article.description, 120)}</p>
                  </div>
                  <button className="read-more-btn">Read Full Story →</button>
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

        {/* Article Modal */}
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

        {/* Use the reusable Pagination component */}
        {totalItems > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            showPageNumbers={true}
            showPrevNext={true}
            prevLabel="Previous"
            nextLabel="Next"
            className="news-pagination"
            maxVisiblePages={5}
            disabled={loading}
          />
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default News
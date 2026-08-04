import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaHome, FaChevronRight, FaNewspaper } from "react-icons/fa";
import "../styles/news.css";
import Footer from "../components/Footer.jsx";
import { useNews } from "../contexts/NewsContext";
import Header from '../components/Header';
import Pagination from '../components/Pagination';

// ─── Masthead (matches other pages) ──────────────────────────────
const Masthead = ({ totalItems }) => (
  <div className="page-masthead">
    <div className="masthead-inner">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><FaHome /> Home</Link>
        <FaChevronRight />
        <span className="breadcrumb-current">News</span>
      </nav>

      <div className="masthead-eyebrow">
        <span className="masthead-eyebrow-icon">
          <FaNewspaper />
        </span>
        Latest Updates
      </div>

      <h1 className="masthead-title">
        Education <span className="masthead-title-accent">News</span> &amp; Updates
      </h1>

      <p className="masthead-desc">
        Stay informed with the latest education news, examination updates, and policy changes across Malawi.
      </p>

      <div className="masthead-meta">
        <span className="masthead-meta-item">{totalItems} Articles</span>
        <span className="masthead-meta-dot" />
        <span className="masthead-meta-item">Updated Daily</span>
        <span className="masthead-meta-dot" />
        <span className="masthead-meta-item">Free Access</span>
      </div>
    </div>
  </div>
);

// ─── Main component ────────────────────────────────────────────────
const News = () => {
  const [dateSort, setDateSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;
  
  const navigate = useNavigate();
  const {
    news,
    loading,
    error,
    fetchNews,
    clearError,
  } = useNews();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
  }, [currentPage]);

  useEffect(() => {
    const loadNews = async () => {
      const filters = {
        sortBy: dateSort === 'newest' ? 'date_desc' : 'date_asc'
      };
      const result = await fetchNews(currentPage, itemsPerPage, filters);
      
      if (result && result.total) {
        setTotalItems(result.total);
      }
    };
    
    loadNews();
  }, [currentPage, dateSort]);

  const handleCardClick = useCallback((article) => {
    navigate(`/news/${article.id}`);
  }, [navigate]);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" }
  ];

  const filteredNews = useMemo(() => {
    return [...news].sort((a, b) => {
      if (dateSort === 'newest') {
        return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
      } else if (dateSort === 'oldest') {
        return new Date(a.publishedAt || a.createdAt) - new Date(b.publishedAt || b.createdAt);
      }
      return 0;
    });
  }, [news, dateSort]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return "Today";
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return "";
    }
  }, []);

  const truncateText = useCallback((text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  }, []);

  if (loading && news.length === 0) {
    return (
      <>
        <Header />
        <div className="news-wrapper">
          <Masthead totalItems={totalItems} />
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
      <>
        <Header />
        <div className="news-wrapper">
          <Masthead totalItems={totalItems} />
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Unable to Load News</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={() => { clearError(); fetchNews(); }} className="retry-btn">
                Try Again
              </button>
              <button onClick={() => navigate('/')} className="error-secondary-btn">
                Return Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="news-wrapper">
        <Masthead totalItems={totalItems} />

        <main className="news-main-content">
          {/* Results Summary - Only Sort Option */}
          <div className="results-summary">
            <div className="results-stats">
              <span className="results-count">
                Showing <strong>{filteredNews.length}</strong> of <strong>{totalItems}</strong> articles
              </span>
            </div>
            <div className="results-sort">
              <span>Sorted by: </span>
              <select 
                value={dateSort} 
                onChange={(e) => setDateSort(e.target.value)}
                className="inline-sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* News Grid */}
          <div className="news-grid-container">
            {filteredNews.length > 0 ? (
              <div className="news-grid">
                {filteredNews.map((article) => (
                  <article 
                    key={article.id} 
                    className="news-card"
                    onClick={() => handleCardClick(article)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCardClick(article)}
                  >
                    <div className="news-card-image">
                      <img 
                        src={article.imageUrl || "/api/placeholder/400/240"} 
                        alt={article.title} 
                        onError={(e) => {
                          e.target.src = "/api/placeholder/400/240";
                        }}
                      />
                    </div>
                    
                    <div className="news-card-content">
                      <h3 className="news-card-title">{article.title}</h3>
                      
                      <p className="news-card-excerpt">
                        {truncateText(article.description || article.content, 140)}
                      </p>
                      
                      <time className="news-card-date">
                        {formatDate(article.publishedAt || article.createdAt)}
                      </time>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-results-state">
                <div className="no-results-illustration">
                  📰
                </div>
                <div className="no-results-content">
                  <h3>No articles found</h3>
                  <p>
                    No news articles are currently available. Please check back soon for updates.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <div className="news-pagination-container">
              <Pagination
                currentPage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  scrollToTop();
                }}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                showPageNumbers={true}
                showPrevNext={true}
                prevLabel="Previous"
                nextLabel="Next"
                className="news-pagination"
                maxVisiblePages={5}
                disabled={loading}
                showPageSummary={true}
              />
            </div>
          )}
        </main>
      </div>
      
      <Footer />
    </>
  );
};

export default News;
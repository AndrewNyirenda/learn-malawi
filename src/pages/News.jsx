import React, { useState } from "react";
import newsData from "../Data/news";
import "../styles/news.css";
import Footer from "../components/Footer.jsx";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const allCategories = ["all", ...new Set(newsData.map(article => article.category))];

  const filteredNews = newsData.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return dateString; // Already formatted in data
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

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
              {allCategories.filter(cat => cat !== "all").map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
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
                onClick={() => setSelectedArticle(article)}
              >
                <div className="news-card-image">
                  <img src={article.imageUrl} alt={article.title} />
                  <div className="news-card-category">{article.category}</div>
                </div>
                <div className="news-card-content">
                  <div className="news-card-meta">
                    <span className="news-date">{formatDate(article.datePublished)}</span>
                    <span className="news-read-time">{article.readTime}</span>
                  </div>
                  <h3 className="news-card-title">{article.title}</h3>
                  <p className="news-card-description">{article.description}</p>
                  <div className="news-card-footer">
                    <span className="news-author">By {article.author}</span>
                    <button className="read-more-btn">Read Full Story →</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-news-found">
              <p>No news articles found matching your search criteria.</p>
            </div>
          )}
        </div>

        {/* Featured Article Banner */}
        {filteredNews.length > 0 && (
          <div className="featured-article">
            <div className="featured-content">
              <div className="featured-badge">Featured</div>
              <h2>{filteredNews[0].title}</h2>
              <p className="featured-description">
                {truncateText(filteredNews[0].content, 200)}
              </p>
              <div className="featured-meta">
                <span>{filteredNews[0].datePublished}</span>
                <span>•</span>
                <span>{filteredNews[0].readTime}</span>
                <span>•</span>
                <span>By {filteredNews[0].author}</span>
              </div>
              <button 
                className="featured-read-btn"
                onClick={() => setSelectedArticle(filteredNews[0])}
              >
                Read Featured Article
              </button>
            </div>
            <div className="featured-image">
              <img src={filteredNews[0].imageUrl} alt={filteredNews[0].title} />
            </div>
          </div>
        )}

        {/* Article Modal */}
        {selectedArticle && (
          <div className="article-modal-overlay" onClick={() => setSelectedArticle(null)}>
            <div className="article-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelectedArticle(null)}>
                &times;
              </button>
              
              <div className="article-modal-header">
                <div className="article-category">{selectedArticle.category}</div>
                <h2>{selectedArticle.title}</h2>
                <div className="article-meta">
                  <span className="article-date">{selectedArticle.datePublished}</span>
                  <span>•</span>
                  <span className="article-read-time">{selectedArticle.readTime}</span>
                  <span>•</span>
                  <span className="article-author">By {selectedArticle.author}</span>
                </div>
              </div>

              <div className="article-modal-body">
                <div className="article-image">
                  <img src={selectedArticle.imageUrl} alt={selectedArticle.title} />
                </div>
                <div className="article-content">
                  <p className="article-description">{selectedArticle.description}</p>
                  <div className="article-full-content">
                    {selectedArticle.content.split('\n').map((paragraph, index) => (
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
      </div>
      <Footer />
    </>
  );
};

export default News;
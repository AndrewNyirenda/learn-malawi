// pages/News.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChevronRight,
  FaChevronLeft,
  FaNewspaper,
  FaArrowRight,
} from "react-icons/fa";
import "../styles/news.css";
import Footer from "../components/Footer.jsx";
import { useNews } from "../contexts/NewsContext";
import Header from '../components/Header';
import Pagination from '../components/Pagination';

const HERO_SLIDE_COUNT = 5;
const HERO_INTERVAL_MS = 7000;

// ─── Hero — no stat bar, only title + blue CTA ────────────────────
const Hero = ({ articles, totalItems, loading }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const touchStartX = useRef(null);

  const slideCount = articles.length;

  useEffect(() => {
    if (activeIndex >= slideCount) setActiveIndex(0);
  }, [slideCount, activeIndex]);

  const goTo = useCallback((i) => {
    setActiveIndex(((i % slideCount) + slideCount) % slideCount);
  }, [slideCount]);

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) prev();
    else if (delta < -40) next();
    touchStartX.current = null;
  };

  if (loading && slideCount === 0) {
    return (
      <div className="news-hero news-hero--loading">
        <div className="news-hero-scrim" />
        <div className="news-hero-inner">
          <nav className="news-breadcrumb" aria-label="Breadcrumb">
            <Link to="/"><FaHome /> Home</Link>
            <FaChevronRight />
            <span className="news-breadcrumb-current">News</span>
          </nav>
          <div className="news-hero-skeleton-eyebrow" />
          <div className="news-hero-skeleton-title" />
          <div className="news-hero-skeleton-title short" />
        </div>
      </div>
    );
  }

  if (slideCount === 0) {
    return (
      <div className="news-hero news-hero--empty">
        <div className="news-hero-scrim" />
        <div className="news-hero-inner">
          <nav className="news-breadcrumb" aria-label="Breadcrumb">
            <Link to="/"><FaHome /> Home</Link>
            <FaChevronRight />
            <span className="news-breadcrumb-current">News</span>
          </nav>
          <div className="news-hero-eyebrow">
            <span className="news-hero-eyebrow-icon"><FaNewspaper /></span>
            Latest Updates
          </div>
          <h1 className="news-hero-title">
            Education <span className="news-hero-title-accent">News</span> &amp; Updates
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div
      className="news-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {articles.map((article, i) => (
        <div
          key={article.id}
          className={`news-hero-slide${i === activeIndex ? " is-active" : ""}`}
          style={{ backgroundImage: `url(${article.imageUrl || ""})` }}
          aria-hidden={i !== activeIndex}
        />
      ))}

      <div className="news-hero-scrim" />

      <div className="news-hero-inner">
        <nav className="news-breadcrumb" aria-label="Breadcrumb">
          <Link to="/"><FaHome /> Home</Link>
          <FaChevronRight />
          <span className="news-breadcrumb-current">News</span>
        </nav>

        <div className="news-hero-eyebrow">
          <span className="news-hero-eyebrow-icon"><FaNewspaper /></span>
          Featured Story
        </div>

        {/* Slide content: only title + blue CTA */}
        <div className="news-hero-content-stack">
          {articles.map((article, i) => (
            <div
              key={article.id}
              className={`news-hero-slide-content${i === activeIndex ? " is-active" : ""}`}
              aria-hidden={i !== activeIndex}
            >
              <h1 className="news-hero-title">{article.title}</h1>
              <button
                className="news-hero-cta news-hero-cta--blue"
                onClick={() => navigate(`/news/${article.id}`)}
                tabIndex={i === activeIndex ? 0 : -1}
              >
                Read Full Story <FaArrowRight />
              </button>
            </div>
          ))}
        </div>
      </div>

      {slideCount > 1 && (
        <>
          <button className="news-hero-arrow news-hero-arrow--prev" onClick={prev} aria-label="Previous story">
            <FaChevronLeft />
          </button>
          <button className="news-hero-arrow news-hero-arrow--next" onClick={next} aria-label="Next story">
            <FaChevronRight />
          </button>

          <div className="news-hero-dots" role="tablist" aria-label="Featured stories">
            {articles.map((article, i) => (
              <button
                key={article.id}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Show story: ${article.title}`}
                className={`news-hero-dot${i === activeIndex ? " is-active" : ""}`}
                onClick={() => goTo(i)}
              >
                <span className="news-hero-dot-track">
                  {i === activeIndex && (
                    <span
                      key={activeIndex}
                      className="news-hero-dot-fill"
                      style={{
                        animationDuration: `${HERO_INTERVAL_MS}ms`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                      onAnimationEnd={next}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Main component (unchanged) ────────────────────────────────────
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

  const heroArticles = useMemo(() => {
    return [...news]
      .filter((a) => a.imageUrl)
      .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
      .slice(0, HERO_SLIDE_COUNT);
  }, [news]);

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

  if (error && news.length === 0) {
    return (
      <>
        <Header />
        <div className="news-container">
          <Hero articles={[]} totalItems={totalItems} loading={false} />
          <div className="news-error-container">
            <div className="news-error-icon">⚠️</div>
            <h3>Unable to Load News</h3>
            <p>{error}</p>
            <div className="news-error-actions">
              <button onClick={() => { clearError(); fetchNews(); }} className="news-retry-btn">
                Try Again
              </button>
              <button onClick={() => navigate('/')} className="news-error-secondary-btn">
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
      <div className="news-container">
        <Hero articles={heroArticles} totalItems={totalItems} loading={loading && news.length === 0} />

        <main className="news-main-content">
          {/* Results Summary */}
          <div className="news-results-summary">
            <div className="news-results-stats">
              <span className="news-results-count">
                Showing <strong>{filteredNews.length}</strong> of <strong>{totalItems}</strong> articles
              </span>
            </div>
            <div className="news-results-sort">
              <span>Sorted by: </span>
              <select
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value)}
                className="news-inline-sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* News Grid */}
          <div className="news-grid-container">
            {loading && filteredNews.length === 0 ? (
              <div className="news-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="news-card-skeleton" key={i}>
                    <div className="news-card-skeleton-image" />
                    <div className="news-card-skeleton-line" />
                    <div className="news-card-skeleton-line short" />
                  </div>
                ))}
              </div>
            ) : filteredNews.length > 0 ? (
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
                      {article.category && (
                        <span className="news-card-category">{article.category}</span>
                      )}
                    </div>

                    <div className="news-card-content">
                      <h3 className="news-card-title">{article.title}</h3>

                      <p className="news-card-excerpt">
                        {truncateText(article.description || article.content, 140)}
                      </p>

                      <div className="news-card-footer">
                        <time className="news-card-date">
                          {formatDate(article.publishedAt || article.createdAt)}
                        </time>
                        <span className="news-card-readmore">
                          Read <FaArrowRight />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="news-no-results">
                <div className="news-no-results-illustration">
                  <FaNewspaper />
                </div>
                <div className="news-no-results-content">
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
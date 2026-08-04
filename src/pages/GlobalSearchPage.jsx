import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useStudyNotes } from "../contexts/StudyNotesContext";
import { usePastPapers } from "../contexts/PastPapersContext";
import { useCareerResources } from "../contexts/CareerResourcesContext";
import { useNews } from "../contexts/NewsContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ResourceCard from "./ResourceCard";
import "../styles/globalSearch.css";
import {
  FaSearch,
  FaTimes,
  FaHome,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "study-notes", label: "Study Notes" },
  { value: "past-papers", label: "Past Papers" },
  { value: "career-resources", label: "Career Resources" },
  { value: "news", label: "News" },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

// ─── Masthead (matches other pages) ──────────────────────────────
const Masthead = ({ query, total, onSearch, onClear, searchValue, setSearchValue }) => (
  <div className="page-masthead">
    <div className="masthead-inner">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><FaHome /> Home</Link>
        <FaChevronRight />
        <span className="breadcrumb-current">Search</span>
      </nav>

      <div className="masthead-eyebrow">
        <span className="masthead-eyebrow-icon">
          <FaSearch />
        </span>
        Global Search
      </div>

      <h1 className="masthead-title">
        Search <span className="masthead-title-accent">Results</span>
      </h1>

      <p className="masthead-desc">
        {total === 0 && !query.trim()
          ? "Search across all content — study notes, past papers, career resources, and news."
          : `${total} result${total !== 1 ? "s" : ""} found for "${query}"`}
      </p>

      <div className="masthead-meta">
        <span className="masthead-meta-item">All Content</span>
        <span className="masthead-meta-dot" />
        <span className="masthead-meta-item">Fast Results</span>
        <span className="masthead-meta-dot" />
        <span className="masthead-meta-item">Free Access</span>
      </div>

      {/* Search form inside hero */}
      <div className="search-hero-form">
        <form onSubmit={onSearch} className="search-form">
          <div className="search-field">
            <FaSearch className="search-icon-leading" />
            <input
              type="text"
              placeholder="Search across all content..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search"
            />
            {searchValue && (
              <button type="button" className="search-clear" onClick={onClear}>
                <FaTimes />
              </button>
            )}
          </div>
          <button type="submit" className="search-submit-btn">Search</button>
        </form>
      </div>
    </div>
  </div>
);

// ─── Main component ────────────────────────────────────────────────
const GlobalSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const queryParam = params.get("q") || "";
  const typeParam = params.get("type") || "all";
  const sortParam = params.get("sort") || "relevance";

  const [query, setQuery] = useState(queryParam);
  const [selectedType, setSelectedType] = useState(typeParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({ studyNotes: [], pastPapers: [], careerResources: [], news: [] });
  const [total, setTotal] = useState(0);

  // Contexts
  const { books, fetchBooks, loading: loadingBooks } = useStudyNotes();
  const { pastPapers, fetchPastPapers, loading: loadingPapers } = usePastPapers();
  const { careerResources, fetchCareerResources, loading: loadingCareer } = useCareerResources();
  const { news, fetchNews, loading: loadingNews } = useNews();

  // Fetch all data when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults({ studyNotes: [], pastPapers: [], careerResources: [], news: [] });
      setTotal(0);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      let studyNotesData = [];
      let pastPapersData = [];
      let careerResourcesData = [];
      let newsData = [];

      try {
        await Promise.all([
          fetchBooks(1, 100, {}),
          fetchPastPapers(1, 100, {}),
          fetchCareerResources(),
          fetchNews(1, 100, {}),
        ]);

        const q = query.toLowerCase().trim();
        studyNotesData = books.filter(b => b.title?.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q));
        pastPapersData = pastPapers.filter(p => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
        careerResourcesData = careerResources.filter(c => c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
        newsData = news.filter(n => n.title?.toLowerCase().includes(q) || n.description?.toLowerCase().includes(q));
      } catch (err) {
        console.error("Search error:", err);
      }

      setResults({
        studyNotes: studyNotesData,
        pastPapers: pastPapersData,
        careerResources: careerResourcesData,
        news: newsData,
      });
      const totalCount = studyNotesData.length + pastPapersData.length + careerResourcesData.length + newsData.length;
      setTotal(totalCount);
      setLoading(false);
    };

    loadData();
  }, [query]);

  // Combine and filter by type
  const filteredResults = useMemo(() => {
    let combined = [];
    if (selectedType === "all" || selectedType === "study-notes") {
      combined = combined.concat(results.studyNotes.map(item => ({ ...item, _type: "study-notes" })));
    }
    if (selectedType === "all" || selectedType === "past-papers") {
      combined = combined.concat(results.pastPapers.map(item => ({ ...item, _type: "past-papers" })));
    }
    if (selectedType === "all" || selectedType === "career-resources") {
      combined = combined.concat(results.careerResources.map(item => ({ ...item, _type: "career-resources" })));
    }
    if (selectedType === "all" || selectedType === "news") {
      combined = combined.concat(results.news.map(item => ({ ...item, _type: "news" })));
    }

    // Sort
    if (sortBy === "newest") {
      combined.sort((a, b) => new Date(b.createdAt || b.publishedAt) - new Date(a.createdAt || a.publishedAt));
    } else if (sortBy === "oldest") {
      combined.sort((a, b) => new Date(a.createdAt || a.publishedAt) - new Date(b.createdAt || b.publishedAt));
    }

    return combined;
  }, [results, selectedType, sortBy]);

  // Update URL when filters change
  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set("q", query);
    if (selectedType && selectedType !== "all") searchParams.set("type", selectedType);
    if (sortBy && sortBy !== "relevance") searchParams.set("sort", sortBy);
    navigate(`/search?${searchParams.toString()}`, { replace: true });
  }, [query, selectedType, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setQuery("");
    setResults({ studyNotes: [], pastPapers: [], careerResources: [], news: [] });
    setTotal(0);
  };

  const renderCard = (item) => {
    const type = item._type;
    if (type === "study-notes" || type === "past-papers" || type === "career-resources") {
      return (
        <ResourceCard
          key={item.id}
          title={item.title}
          type="book"
          thumbnail={item.thumbnailUrl}
          category={item.category}
          class={item.class}
          year={item.year}
          onView={() => window.open(item.link || "#", "_blank")}
          onDownload={() => {}}
        />
      );
    } else if (type === "news") {
      return (
        <article
          key={item.id}
          className="news-card search-news-card"
          onClick={() => navigate(`/news/${item.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate(`/news/${item.id}`)}
        >
          <div className="news-card-image">
            <img src={item.imageUrl || "/api/placeholder/400/240"} alt={item.title} />
          </div>
          <div className="news-card-content">
            <h3 className="news-card-title">{item.title}</h3>
            <p className="news-card-excerpt">{item.description?.substring(0, 140)}...</p>
            <time className="news-card-date">{new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</time>
          </div>
        </article>
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <div className="search-page-wrapper">
        {/* Hero */}
        <Masthead
          query={query}
          total={total}
          onSearch={handleSearch}
          onClear={clearSearch}
          searchValue={query}
          setSearchValue={setQuery}
        />

        {/* Toolbar */}
        <div className="toolbar-panel">
          <div className="toolbar-row">
            <div className="filter-group">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                {TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {total > 0 && (
              <span className="results-count">{total} results</span>
            )}
          </div>
        </div>

        {/* Results */}
        <section className="search-results-section">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Searching...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="empty">
              <FaSearch size={48} className="empty-icon" />
              <h3>No results found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="search-results-grid">
              {filteredResults.map(item => renderCard(item))}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </>
  );
};

export default GlobalSearchPage;
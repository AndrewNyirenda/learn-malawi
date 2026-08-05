// pages/GlobalSearchPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaSearch,
  FaTimes,
  FaHome,
  FaChevronRight,
  FaEye,
  FaDownload,
  FaBookOpen,   
} from "react-icons/fa";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useStudyNotes } from "../contexts/StudyNotesContext";
import { usePastPapers } from "../contexts/PastPapersContext";
import { useCareerResources } from "../contexts/CareerResourcesContext";
import { useNews } from "../contexts/NewsContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ResourceCard from "./ResourceCard";
import "../styles/globalSearch.css";
import "../styles/modal.css"; 

  

// ─── Masthead (matches other pages) ──────────────────────────────
const Masthead = ({ query, total, onSearch, onClear, searchValue, setSearchValue }) => (
  <div className="search-page-masthead">
    <div className="search-masthead-inner">
      <nav className="search-breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><FaHome /> Home</Link>
        <FaChevronRight />
        <span className="search-breadcrumb-current">Search</span>
      </nav>

      <div className="search-masthead-eyebrow">
        <span className="search-masthead-eyebrow-icon">
          <FaSearch />
        </span>
        Global Search
      </div>

      <h1 className="search-masthead-title">
        Search <span className="search-masthead-title-accent">Results</span>
      </h1>

      <p className="search-masthead-desc">
        {total === 0 && !query.trim()
          ? "Search across all content — study notes, past papers, career resources, and news."
          : `${total} result${total !== 1 ? "s" : ""} found for "${query}"`}
      </p>

      <div className="search-masthead-meta">
        <span className="search-masthead-meta-item">All Content</span>
        <span className="search-masthead-meta-item">Fast Results</span>
        <span className="search-masthead-meta-item">Free Access</span>
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

  const [query, setQuery] = useState(queryParam);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({ studyNotes: [], pastPapers: [], careerResources: [], news: [] });
  const [total, setTotal] = useState(0);

  // Modal state
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceType, setResourceType] = useState(null); // 'study-notes', 'past-papers', 'career-resources'

  // Contexts
  const { books, fetchBooks, getViewUrl: getStudyNoteViewUrl, getDownloadUrl: getStudyNoteDownloadUrl } = useStudyNotes();
  const { pastPapers, fetchPastPapers, getViewUrl: getPastPaperViewUrl, getDownloadUrl: getPastPaperDownloadUrl } = usePastPapers();
  const { careerResources, fetchCareerResources } = useCareerResources();
  const { news, fetchNews } = useNews();

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

  // Combine all results (no filtering/sorting)
  const combinedResults = useMemo(() => {
    let combined = [];
    combined = combined.concat(results.studyNotes.map(item => ({ ...item, _type: "study-notes" })));
    combined = combined.concat(results.pastPapers.map(item => ({ ...item, _type: "past-papers" })));
    combined = combined.concat(results.careerResources.map(item => ({ ...item, _type: "career-resources" })));
    combined = combined.concat(results.news.map(item => ({ ...item, _type: "news" })));
    return combined;
  }, [results]);

  // Update URL when query changes
  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set("q", query);
    navigate(`/search?${searchParams.toString()}`, { replace: true });
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setQuery("");
    setResults({ studyNotes: [], pastPapers: [], careerResources: [], news: [] });
    setTotal(0);
  };

  // ── Modal handlers ──
  const handleCardClick = (item, type) => {
    setSelectedResource(item);
    setResourceType(type);
  };

  const closeModal = () => {
    setSelectedResource(null);
    setResourceType(null);
  };

  const handleViewResource = async () => {
    if (!selectedResource) return;
    let viewUrl = "";
    if (resourceType === "study-notes") {
      const { viewUrl: url } = await getStudyNoteViewUrl(selectedResource.id);
      viewUrl = url;
    } else if (resourceType === "past-papers") {
      const { viewUrl: url } = await getPastPaperViewUrl(selectedResource.id);
      viewUrl = url;
    } else if (resourceType === "career-resources") {
      viewUrl = selectedResource.link || "#";
    }
    if (viewUrl) window.open(viewUrl, "_blank");
  };

  const handleDownloadResource = async () => {
    if (!selectedResource) return;
    if (resourceType === "study-notes") {
      const { downloadUrl, fileName } = await getStudyNoteDownloadUrl(selectedResource.id);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName || selectedResource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (resourceType === "past-papers") {
      const { downloadUrl, fileName } = await getPastPaperDownloadUrl(selectedResource.id);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName || selectedResource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (resourceType === "career-resources") {
      // Career resources often just have a link
      window.open(selectedResource.link || "#", "_blank");
    }
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
          onClick={() => handleCardClick(item, type)}
        />
      );
    } else if (type === "news") {
      return (
        <article
          key={item.id}
          className="search-news-card"
          onClick={() => navigate(`/news/${item.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate(`/news/${item.id}`)}
        >
          <div className="search-news-image">
            <img src={item.imageUrl || "/api/placeholder/400/240"} alt={item.title} />
          </div>
          <div className="search-news-content">
            <h3 className="search-news-title">{item.title}</h3>
            <p className="search-news-excerpt">{item.description?.substring(0, 140)}...</p>
            <time className="search-news-date">{new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</time>
          </div>
        </article>
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <div className="search-container">
        <Masthead
          query={query}
          total={total}
          onSearch={handleSearch}
          onClear={clearSearch}
          searchValue={query}
          setSearchValue={setQuery}
        />

        {/* Results count */}
        {total > 0 && (
          <div className="search-results-count-wrapper">
            <span className="search-results-count">{total} results</span>
          </div>
        )}

        {/* Results */}
        <section className="search-results-section">
          {loading ? (
            <div className="search-loading-container">
              <div className="search-loading-spinner" />
              <p>Searching...</p>
            </div>
          ) : combinedResults.length === 0 ? (
            <div className="search-empty">
              <FaSearch size={48} className="search-empty-icon" />
              <h3>No results found</h3>
              <p>Try adjusting your search.</p>
            </div>
          ) : (
            <div className="search-results-grid">
              {combinedResults.map(item => renderCard(item))}
            </div>
          )}
        </section>
      </div>

      {/* ─── Modal (same as StudyNotes) ──────────────────────────── */}
      {selectedResource && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>

            <div className="modal-image">
              {selectedResource.thumbnailUrl ? (
                <img src={selectedResource.thumbnailUrl} alt={selectedResource.title} />
              ) : (
                <FaBookOpen className="modal-fallback-icon" />
              )}
            </div>

            <h2 className="modal-title">{selectedResource.title}</h2>

            <div className="modal-meta">
              {selectedResource.category && (
                <span className="modal-meta-item">{selectedResource.category}</span>
              )}
              {selectedResource.class && (
                <span className="modal-meta-item">{selectedResource.class}</span>
              )}
              {selectedResource.year && (
                <span className="modal-meta-item">{selectedResource.year}</span>
              )}
            </div>

            <div className="modal-actions">
              <button className="modal-btn modal-view" onClick={handleViewResource}>
                <FaEye /> View
              </button>
              <button className="modal-btn modal-download" onClick={handleDownloadResource}>
                <FaDownload /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default GlobalSearchPage;
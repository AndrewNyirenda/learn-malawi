// pages/StudyNotes.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import ResourceCard from "./ResourceCard";
import "../styles/studyNotes.css";
import "../styles/modal.css"; // optional – we'll keep modal consistent
import Footer from "../components/Footer.jsx";
import { useStudyNotes } from "../contexts/StudyNotesContext";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";
import {
  FaSearch,
  FaTimes,
  FaHome,
  FaChevronRight,
  FaBookOpen,
  FaEye,
  FaDownload,
} from "react-icons/fa";

// ─── Skeleton ────────────────────────────────────────────────────────
const SkeletonGrid = ({ count = 12 }) => (
  <div className="study-notes-materials-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div className="study-notes-skeleton-card" key={i}>
        <div className="study-notes-skeleton-cover" />
        <div className="study-notes-skeleton-line" />
        <div className="study-notes-skeleton-line short" />
      </div>
    ))}
  </div>
);

const useDebouncedValue = (value, delay = 250) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

// ─── Masthead (identical to Past Papers, with FaBookOpen) ──────
const Masthead = () => (
  <div className="study-notes-page-masthead">
    <div className="study-notes-masthead-inner">
      <nav className="study-notes-breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><FaHome /> Home</Link>
        <FaChevronRight />
        <span className="study-notes-breadcrumb-current">Study Notes</span>
      </nav>

      <div className="study-notes-masthead-eyebrow">
        <span className="study-notes-masthead-eyebrow-icon">
          <FaBookOpen />
        </span>
        Resource Library
      </div>

      <h1 className="study-notes-masthead-title">
        Study Notes &amp; <span className="study-notes-masthead-title-accent">Resources</span>
      </h1>

      <p className="study-notes-masthead-desc">
        Curated academic materials for Primary and Secondary levels —
        organised by subject and class, built for focused, distraction‑free
        learning.
      </p>

      <div className="study-notes-masthead-meta">
        <span className="study-notes-masthead-meta-item">Primary &amp; Secondary</span>
        <span className="study-notes-masthead-meta-item">Updated Regularly</span>
        <span className="study-notes-masthead-meta-item">Free to Download</span>
      </div>
    </div>
  </div>
);

// ─── Toolbar with prefixed filter classes ──────────────────────
const Toolbar = ({
  level,
  setLevel,
  category,
  setCategory,
  classFilter,
  setClassFilter,
  searchInput,
  onSearchChange,
  onSearchClear,
  onSearchKeyDown,
  hasActiveFilters,
  clearAll,
  categories,
  classes,
}) => {
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...(categories || []).map((c) => ({ value: c.category, label: c.category })),
  ];
  const classOptions = [
    { value: "all", label: "All Classes" },
    ...(classes || []).map((c) => ({ value: c.class, label: c.class })),
  ];

  return (
    <div className="study-notes-toolbar-panel">
      <div className="study-notes-toolbar-row">
        <div className="study-notes-level-switch" data-level={level}>
          <button
            className={level === "primary" ? "active" : ""}
            onClick={() => setLevel("primary")}
          >
            Primary Level
          </button>
          <button
            className={level === "secondary" ? "active" : ""}
            onClick={() => setLevel("secondary")}
          >
            Secondary Level
          </button>
        </div>

        <div className="study-notes-filter-group">
          <label className="study-notes-filter-label" htmlFor="study-notes-category">Category:</label>
          <Filter
            id="study-notes-category"
            className="study-notes-filter-select"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            showAllOption={false}
            placeholder="Select category"
          />
        </div>

        <div className="study-notes-filter-group">
          <label className="study-notes-filter-label" htmlFor="study-notes-class">Class:</label>
          <Filter
            id="study-notes-class"
            className="study-notes-filter-select"
            value={classFilter}
            onChange={setClassFilter}
            options={classOptions}
            showAllOption={false}
            placeholder="Select class"
          />
        </div>

        <div className="study-notes-search-field">
          <FaSearch className="study-notes-search-icon-leading" />
          <input
            type="text"
            placeholder="Search by title…"
            value={searchInput}
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown}
            aria-label="Search study notes by title"
          />
          {searchInput && (
            <button className="study-notes-search-clear" onClick={onSearchClear} aria-label="Clear search">
              <FaTimes />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button className="study-notes-toolbar-clear" onClick={clearAll}>
            Clear
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="study-notes-active-chips">
          {category !== "all" && (
            <span className="study-notes-chip">
              {category}
              <button onClick={() => setCategory("all")} aria-label="Remove category filter">
                <FaTimes />
              </button>
            </span>
          )}
          {classFilter !== "all" && (
            <span className="study-notes-chip">
              {classFilter}
              <button onClick={() => setClassFilter("all")} aria-label="Remove class filter">
                <FaTimes />
              </button>
            </span>
          )}
          {searchInput.trim() !== "" && (
            <span className="study-notes-chip">
              "{searchInput.trim()}"
              <button onClick={onSearchClear} aria-label="Clear search term">
                <FaTimes />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────
const StudyNotes = () => {
  const [level, setLevel] = useState("secondary");
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput, 150);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  // Modal state
  const [selectedResource, setSelectedResource] = useState(null);

  const {
    books,
    categories,
    classes,
    loading,
    error,
    fetchBooks,
    fetchCategories,
    fetchClasses,
    getViewUrl,
    getDownloadUrl,
    clearError,
  } = useStudyNotes();

  useEffect(() => {
    const levelEnum = level === "primary" ? "primary" : "secondary";
    fetchCategories(levelEnum);
    fetchClasses(levelEnum);
  }, [level]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadBooks = async () => {
      const filters = {
        level,
        ...(category !== "all" && { category }),
        ...(classFilter !== "all" && { class: classFilter }),
      };
      const result = await fetchBooks(currentPage, itemsPerPage, filters);
      if (result?.total) setTotalItems(result.total);
    };
    loadBooks();
  }, [level, category, classFilter, currentPage]);

  useEffect(() => {
    setCategory("all");
    setClassFilter("all");
    setCurrentPage(1);
  }, [level]);

  const handleSearchChange = useCallback((e) => {
    setSearchInput(e.target.value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchInput("");
  }, []);

  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === "Escape" && searchInput) setSearchInput("");
  }, [searchInput]);

  const clearAll = useCallback(() => {
    setCategory("all");
    setClassFilter("all");
    setSearchInput("");
    setCurrentPage(1);
  }, []);

  const visibleBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const q = searchQuery.trim().toLowerCase();
    return books.filter((b) => b.title?.toLowerCase().includes(q));
  }, [books, searchQuery]);

  const isSearchFiltering =
    searchQuery.trim() !== "" && visibleBooks.length === 0 && books.length > 0;
  const hasActiveFilters =
    category !== "all" || classFilter !== "all" || searchInput.trim() !== "";

  const handleViewResource = async (resource) => {
    const { viewUrl } = await getViewUrl(resource.id);
    window.open(viewUrl, "_blank");
  };

  const handleDownloadResource = async (resource) => {
    const { downloadUrl, fileName } = await getDownloadUrl(resource.id);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName || resource.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCardClick = (resource) => {
    setSelectedResource(resource);
  };

  const closeModal = () => {
    setSelectedResource(null);
  };

  if (loading && books.length === 0) {
    return (
      <>
        <Header />
        <div className="study-notes-container">
          <Masthead />
          <Toolbar
            level={level}
            setLevel={setLevel}
            category={category}
            setCategory={setCategory}
            classFilter={classFilter}
            setClassFilter={setClassFilter}
            searchInput={searchInput}
            onSearchChange={handleSearchChange}
            onSearchClear={handleSearchClear}
            onSearchKeyDown={handleSearchKeyDown}
            hasActiveFilters={hasActiveFilters}
            clearAll={clearAll}
            categories={categories}
            classes={classes}
          />
          <SkeletonGrid count={itemsPerPage} />
        </div>
        <Footer />
      </>
    );
  }

  if (error && books.length === 0) {
    return (
      <>
        <Header />
        <div className="study-notes-container">
          <Masthead />
          <div className="study-notes-state-box">
            <h3>Unable to load resources</h3>
            <p>{error}</p>
            <button onClick={() => { clearError(); fetchBooks(); }}>Try again</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="study-notes-container">
        <Masthead />
        <Toolbar
          level={level}
          setLevel={setLevel}
          category={category}
          setCategory={setCategory}
          classFilter={classFilter}
          setClassFilter={setClassFilter}
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
          onSearchKeyDown={handleSearchKeyDown}
          hasActiveFilters={hasActiveFilters}
          clearAll={clearAll}
          categories={categories}
          classes={classes}
        />

        <section className="study-notes-materials">
          <div className="study-notes-materials-grid">
            {visibleBooks.length > 0 ? (
              visibleBooks.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  title={resource.title}
                  type="book"
                  thumbnail={resource.thumbnailUrl}
                  category={resource.category}
                  class={resource.class}
                  year={resource.year}
                  onClick={() => handleCardClick(resource)}
                />
              ))
            ) : isSearchFiltering ? (
              <div className="study-notes-empty">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="#94a3b8">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14z" />
                  <path d="M7 9h10v2H7zm0 4h8v2H7z" />
                </svg>
                <h3>No matches for "{searchInput.trim()}"</h3>
                <p>Try a different title, or clear your search to browse everything in this category.</p>
                <button onClick={() => setSearchInput("")}>Clear search</button>
              </div>
            ) : (
              <div className="study-notes-empty">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="#94a3b8">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14z" />
                  <path d="M7 9h10v2H7zm0 4h8v2H7z" />
                </svg>
                <h3>No materials match your filters</h3>
                <p>Try a different category or class.</p>
                <button onClick={clearAll}>Clear filters</button>
              </div>
            )}
          </div>
        </section>

        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            showPrevNext
            disabled={loading}
          />
        )}

        <div className="study-notes-status" role="status" aria-live="polite">
          Showing {visibleBooks.length}{" "}
          {visibleBooks.length === 1 ? "resource" : "resources"}
          {loading && " · loading"}
        </div>
      </div>

      {/* ─── Modal (identical to Past Papers) ──────────────────── */}
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
              <button
                className="modal-btn modal-view"
                onClick={() => handleViewResource(selectedResource)}
              >
                <FaEye /> View
              </button>
              <button
                className="modal-btn modal-download"
                onClick={() => handleDownloadResource(selectedResource)}
              >
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

export default StudyNotes;
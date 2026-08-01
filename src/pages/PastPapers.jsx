// pages/PastPapers.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import ResourceCard from "./ResourceCard";
import "../styles/pastPapers.css";
import Footer from "../components/Footer.jsx";
import { usePastPapers } from "../contexts/PastPapersContext";
import Header from "../components/Header";
import PageHeader from "../components/page-header";
import Pagination from "../components/Pagination";
import { FaSearch, FaTimes, FaHome, FaChevronRight } from "react-icons/fa";

const SkeletonGrid = ({ count = 12 }) => (
  <div className="materials-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div className="skeleton-card" key={i}>
        <div className="skeleton-cover" />
        <div className="skeleton-line" />
        <div className="skeleton-line short" />
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

const PastPapers = () => {
  const [level, setLevel] = useState("secondary");
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput, 250);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  const {
    pastPapers,
    categories,
    classes,
    years,
    loading,
    error,
    fetchPastPapers,
    fetchCategories,
    fetchClasses,
    fetchYears,
    getViewUrl,
    getDownloadUrl,
    clearError,
  } = usePastPapers();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const levelEnum = level === "primary" ? "primary" : "secondary";
    fetchCategories(levelEnum);
    fetchClasses(levelEnum);
    fetchYears(levelEnum);
  }, [level]);

  useEffect(() => {
    const loadPastPapers = async () => {
      const levelEnum = level === "primary" ? "primary" : "secondary";
      const filters = {
        level: levelEnum,
        ...(category !== "all" && { category }),
        ...(classFilter !== "all" && { class: classFilter }),
        ...(yearFilter !== "all" && { year: parseInt(yearFilter) }),
      };
      const result = await fetchPastPapers(currentPage, itemsPerPage, filters);
      if (result?.total) setTotalItems(result.total);
    };
    loadPastPapers();
  }, [level, category, classFilter, yearFilter, currentPage]);

  useEffect(() => {
    setCategory("all");
    setClassFilter("all");
    setYearFilter("all");
    setCurrentPage(1);
  }, [level]);

  const visiblePapers = useMemo(() => {
    if (!searchQuery.trim()) return pastPapers;
    const q = searchQuery.trim().toLowerCase();
    return pastPapers.filter((p) => p.title?.toLowerCase().includes(q));
  }, [pastPapers, searchQuery]);

  const isSearchFiltering = searchQuery.trim() !== "" && visiblePapers.length === 0 && pastPapers.length > 0;

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

  const hasActiveFilters =
    category !== "all" || classFilter !== "all" || yearFilter !== "all" || searchInput.trim() !== "";

  const clearAll = () => {
    setCategory("all");
    setClassFilter("all");
    setYearFilter("all");
    setSearchInput("");
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape" && searchInput) setSearchInput("");
  };

  const Masthead = () => (
    <div className="page-masthead">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><FaHome /> Home</Link>
        <FaChevronRight />
        <span className="breadcrumb-current">Past Papers</span>
      </nav>
      <PageHeader
        title="Past Papers & Reviews"
        description="Access a curated collection of past papers and reviews to support your primary and secondary school studies."
      />
    </div>
  );

  const Toolbar = () => (
    <div className="toolbar-panel">
      <div className="toolbar-row">
        <div className="search-field">
          <FaSearch className="search-icon-leading" />
          <input
            type="text"
            placeholder="Search by title…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            aria-label="Search past papers by title"
          />
          {searchInput && (
            <button className="search-clear" onClick={() => setSearchInput("")} aria-label="Clear search">
              <FaTimes />
            </button>
          )}
        </div>

        <div className="level-switch">
          <button className={level === "primary" ? "active" : ""} onClick={() => setLevel("primary")}>
            Primary
          </button>
          <button className={level === "secondary" ? "active" : ""} onClick={() => setLevel("secondary")}>
            Secondary
          </button>
        </div>

        <select
          className="filter-select"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.category}>{cat.category}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={classFilter}
          onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}
          aria-label="Filter by class"
        >
          <option value="all">All Classes</option>
          {classes.map((cls, i) => (
            <option key={i} value={cls.class}>{cls.class}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={yearFilter}
          onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
          aria-label="Filter by year"
        >
          <option value="all">All Years</option>
          {years.map((y, i) => (
            <option key={i} value={y.year}>{y.year}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button className="toolbar-clear" onClick={clearAll}>Clear</button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="active-chips">
          {category !== "all" && (
            <span className="chip">
              {category}
              <button onClick={() => setCategory("all")} aria-label="Remove category filter"><FaTimes /></button>
            </span>
          )}
          {classFilter !== "all" && (
            <span className="chip">
              {classFilter}
              <button onClick={() => setClassFilter("all")} aria-label="Remove class filter"><FaTimes /></button>
            </span>
          )}
          {yearFilter !== "all" && (
            <span className="chip">
              {yearFilter}
              <button onClick={() => setYearFilter("all")} aria-label="Remove year filter"><FaTimes /></button>
            </span>
          )}
          {searchInput.trim() !== "" && (
            <span className="chip">
              "{searchInput.trim()}"
              <button onClick={() => setSearchInput("")} aria-label="Clear search term"><FaTimes /></button>
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (loading && pastPapers.length === 0) {
    return (
      <>
        <Header />
        <div className="past-papers-container">
          <Masthead />
          <Toolbar />
          <SkeletonGrid count={itemsPerPage} />
        </div>
        <Footer />
      </>
    );
  }

  if (error && pastPapers.length === 0) {
    return (
      <>
        <Header />
        <div className="past-papers-container">
          <Masthead />
          <div className="state-box">
            <h3>Error Loading Past Papers</h3>
            <p>{error}</p>
            <button onClick={() => { clearError(); fetchPastPapers(); }}>
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="past-papers-container">
        <Masthead />
        <Toolbar />

        <section className="materials">
          <div className="materials-grid">
            {visiblePapers.length > 0 ? (
              visiblePapers.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  title={resource.title}
                  type="book"
                  thumbnail={resource.thumbnailUrl}
                  category={resource.category}
                  class={resource.class}
                  year={resource.year}
                  onView={() => handleViewResource(resource)}
                  onDownload={() => handleDownloadResource(resource)}
                />
              ))
            ) : isSearchFiltering ? (
              <div className="empty">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="#94a3b8">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14z" />
                  <path d="M7 9h10v2H7zm0 4h8v2H7z" />
                </svg>
                <h3>No matches for "{searchInput.trim()}"</h3>
                <p>Try a different title, or clear your search to browse everything in this category.</p>
                <button onClick={() => setSearchInput("")}>Clear search</button>
              </div>
            ) : (
              <div className="empty">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="#94a3b8">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14z" />
                  <path d="M7 9h10v2H7zm0 4h8v2H7z" />
                </svg>
                <h3>No Past Papers Available</h3>
                <p>No past papers found for the selected filters. Try a different category, class, or year.</p>
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

        <div className="status" role="status" aria-live="polite">
          Showing {visiblePapers.length}{" "}
          {visiblePapers.length === 1 ? "past paper" : "past papers"}
          {loading && " · loading"}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PastPapers;
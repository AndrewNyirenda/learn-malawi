// pages/StudyNotes.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import ResourceCard from "./ResourceCard";
import "../styles/studyNotes.css";
import Footer from "../components/Footer.jsx";
import { useStudyNotes } from "../contexts/StudyNotesContext";
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

const StudyNotes = () => {
  const [level, setLevel] = useState("secondary");
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput, 250);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  const {
    books, categories, classes, loading, error,
    fetchBooks, fetchCategories, fetchClasses,
    getViewUrl, getDownloadUrl, clearError
  } = useStudyNotes();

  useEffect(() => {
    const levelEnum = level === "primary" ? "primary" : "secondary";
    fetchCategories(levelEnum);
    fetchClasses(levelEnum);
  }, [level]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const loadBooks = async () => {
      const filters = {
        level,
        ...(category !== "all" && { category }),
        ...(classFilter !== "all" && { class: classFilter })
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

  const visibleBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const q = searchQuery.trim().toLowerCase();
    return books.filter((b) => b.title?.toLowerCase().includes(q));
  }, [books, searchQuery]);

  const isSearchFiltering = searchQuery.trim() !== "" && visibleBooks.length === 0 && books.length > 0;

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

  const hasActiveFilters = category !== "all" || classFilter !== "all" || searchInput.trim() !== "";

  const clearAll = () => {
    setCategory("all");
    setClassFilter("all");
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
        <span className="breadcrumb-current">Study Notes</span>
      </nav>
      <PageHeader
        title="Study Notes & References"
        description="Curated academic materials to support focused learning."
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
            aria-label="Search study notes by title"
          />
          {searchInput && (
            <button className="search-clear" onClick={() => setSearchInput("")} aria-label="Clear search">
              <FaTimes />
            </button>
          )}
        </div>

        <div className="level-switch">
          <button className={level === "primary" ? "active" : ""} onClick={() => setLevel("primary")}>Primary</button>
          <button className={level === "secondary" ? "active" : ""} onClick={() => setLevel("secondary")}>Secondary</button>
        </div>

        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.category}>{c.category}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          aria-label="Filter by class"
        >
          <option value="all">All Classes</option>
          {classes.map((c, i) => (
            <option key={i} value={c.class}>{c.class}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button className="toolbar-clear" onClick={clearAll}>Clear</button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="active-chips">
          {category !== "all" && (
            <span className="chip">{category}<button onClick={() => setCategory("all")} aria-label="Remove category filter"><FaTimes /></button></span>
          )}
          {classFilter !== "all" && (
            <span className="chip">{classFilter}<button onClick={() => setClassFilter("all")} aria-label="Remove class filter"><FaTimes /></button></span>
          )}
          {searchInput.trim() !== "" && (
            <span className="chip">"{searchInput.trim()}"<button onClick={() => setSearchInput("")} aria-label="Clear search term"><FaTimes /></button></span>
          )}
        </div>
      )}
    </div>
  );

  if (loading && books.length === 0) {
    return (
      <>
        <Header />
        <main className="study-page">
          <Masthead />
          <Toolbar />
          <SkeletonGrid count={itemsPerPage} />
        </main>
        <Footer />
      </>
    );
  }

  if (error && books.length === 0) {
    return (
      <>
        <Header />
        <main className="study-page">
          <Masthead />
          <div className="state-box">
            <h3>Unable to load resources</h3>
            <p>{error}</p>
            <button onClick={() => { clearError(); fetchBooks(); }}>Try again</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="study-page">
        <Masthead />
        <Toolbar />

        <section className="materials">
          {visibleBooks.length > 0 ? (
            <div className="materials-grid">
              {visibleBooks.map((resource, index) => (   // <-- added index
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
                  style={{ animationDelay: `${index * 0.05}s` }}  // <-- staggered animation
                />
              ))}
            </div>
          ) : isSearchFiltering ? (
            <div className="empty">
              <h3>No matches for "{searchInput.trim()}"</h3>
              <p>Try a different title, or clear your search to browse everything in this category.</p>
              <button onClick={() => setSearchInput("")}>Clear search</button>
            </div>
          ) : (
            <div className="empty">
              <h3>No materials match your filters</h3>
              <p>Try a different category or class.</p>
              <button onClick={clearAll}>Clear filters</button>
            </div>
          )}
        </section>

        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        )}

        <div className="status" role="status" aria-live="polite">
          Showing {visibleBooks.length} resources {loading && "· loading"}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StudyNotes;
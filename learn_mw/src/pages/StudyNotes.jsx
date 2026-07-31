import React, { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import "../styles/global.css";
import "../styles/studyNotes.css";
import Footer from "../components/Footer.jsx";
import { useStudyNotes } from "../contexts/StudyNotesContext";
import Header from "../components/Header";
import PageHeader from "../components/page-header";
import Pagination from "../components/Pagination";
import { FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";

const StudyNotes = () => {
  const [level, setLevel] = useState("secondary");
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

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
    clearError
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
    setSearchQuery("");
  }, [level]);

  const handleViewResource = async resource => {
    const { viewUrl } = await getViewUrl(resource.id);
    window.open(viewUrl, "_blank");
  };

  const handleDownloadResource = async resource => {
    const { downloadUrl, fileName } = await getDownloadUrl(resource.id);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName || resource.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setCategory("all");
    setClassFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = category !== "all" || classFilter !== "all" || searchQuery;

  const filteredBooks = searchQuery
    ? books.filter(b => b.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : books;

  if (loading && books.length === 0) {
    return (
      <>
        <Header />
        <main className="lm-page">
          <PageHeader
            title="Study Notes & References"
            description="Curated academic materials to support focused learning across all levels."
          />
          <div className="state-box">
            <span className="spinner" />
            <p>Loading materials…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error && books.length === 0) {
    return (
      <>
        <Header />
        <main className="lm-page">
          <PageHeader title="Study Notes & References" />
          <div className="state-box">
            <h3>Unable to load resources</h3>
            <p>{error}</p>
            <button onClick={() => { clearError(); fetchBooks(); }}>Try Again</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="lm-page">
        <PageHeader
          title="Study Notes & References"
          description="Curated academic materials to support focused learning across all levels."
        />

        {/* Level Toggle */}
        <div className="level-switch">
          <button className={level === "primary" ? "active" : ""} onClick={() => setLevel("primary")}>
            Primary Level
          </button>
          <button className={level === "secondary" ? "active" : ""} onClick={() => setLevel("secondary")}>
            Secondary Level
          </button>
        </div>

        {/* Professional Filter Bar */}
        <div className="filter-bar" style={{ margin: '0 auto 1.5rem', maxWidth: 'var(--container-max)', width: 'calc(100% - 2*var(--container-pad))' }}>
          <div className="filter-bar-label">
            <FaSlidersH className="filter-icon" />
            Filters
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              className="filter-select"
              value={category}
              onChange={e => { setCategory(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.category}>{c.category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Class</label>
            <select
              className="filter-select"
              value={classFilter}
              onChange={e => { setClassFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All Classes</option>
              {classes.map((c, i) => (
                <option key={i} value={c.class}>{c.class}</option>
              ))}
            </select>
          </div>

          {/* Search within filter bar */}
          <div className="filter-group" style={{ maxWidth: '260px' }}>
            <label className="filter-label">Search</label>
            <div className="search-bar">
              <div className="search-bar-inner" style={{ padding: '0.52rem 0.9rem', borderRadius: '6px' }}>
                <FaSearch className="search-bar-icon" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="search-bar-clear" onClick={() => setSearchQuery("")}>
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button className="filter-reset-btn" onClick={resetFilters}>
              <FaTimes style={{ fontSize: '0.7rem' }} />
              Clear
            </button>
          )}
        </div>

        {/* Results */}
        <section className="materials">
          {filteredBooks.length > 0 ? (
            <div className="materials-grid">
              {filteredBooks.map(resource => (
                <ResourceCard
                  key={resource.id}
                  title={resource.title}
                  type="book"
                  thumbnail={resource.thumbnailUrl || "/images/pdf.png"}
                  category={resource.category}
                  class={resource.class}
                  year={resource.year}
                  onView={() => handleViewResource(resource)}
                  onDownload={() => handleDownloadResource(resource)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No Materials Found</h3>
              <p>No materials match your current filters. Try adjusting your search or category.</p>
            </div>
          )}
        </section>

        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            showPrevNext
          />
        )}

        <div className="status-bar">
          <span className="dot"></span>
          Showing {filteredBooks.length} of {totalItems} resources
          {loading && " · refreshing…"}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StudyNotes;

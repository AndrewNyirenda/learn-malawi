import React, { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import "../styles/global.css";
import "../styles/pastPapers.css";
import Footer from "../components/Footer.jsx";
import { usePastPapers } from "../contexts/PastPapersContext";
import Header from "../components/Header";
import PageHeader from "../components/page-header";
import Pagination from "../components/Pagination";
import { FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";

const PastPapers = () => {
  const [level, setLevel] = useState("secondary");
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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

  useEffect(() => { window.scrollTo(0, 0); }, []);

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
    setSearchQuery("");
  }, [level]);

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

  const resetFilters = () => {
    setCategory("all");
    setClassFilter("all");
    setYearFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = category !== "all" || classFilter !== "all" || yearFilter !== "all" || searchQuery;

  const filteredPapers = searchQuery
    ? pastPapers.filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : pastPapers;

  if (loading && pastPapers.length === 0) {
    return (
      <>
        <Header />
        <main className="lm-page">
          <PageHeader
            title="Past Papers & Examinations"
            description="Access a comprehensive archive of past papers and examination reviews."
          />
          <div className="state-box">
            <span className="spinner" />
            <p>Loading past papers…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error && pastPapers.length === 0) {
    return (
      <>
        <Header />
        <main className="lm-page">
          <PageHeader title="Past Papers & Examinations" />
          <div className="state-box">
            <h3>Error Loading Papers</h3>
            <p>{error}</p>
            <button onClick={() => { clearError(); fetchPastPapers(); }}>Retry</button>
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
          title="Past Papers & Examinations"
          description="Access a comprehensive archive of past papers and examination reviews for primary and secondary levels."
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
              {categories.map(cat => (
                <option key={cat.id} value={cat.category}>{cat.category}</option>
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
              {classes.map((cls, i) => (
                <option key={i} value={cls.class}>{cls.class}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Year</label>
            <select
              className="filter-select"
              value={yearFilter}
              onChange={e => { setYearFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All Years</option>
              {years.map((y, i) => (
                <option key={i} value={y.year}>{y.year}</option>
              ))}
            </select>
          </div>

          <div className="filter-group" style={{ maxWidth: '240px' }}>
            <label className="filter-label">Search</label>
            <div className="search-bar">
              <div className="search-bar-inner" style={{ padding: '0.52rem 0.9rem', borderRadius: '6px' }}>
                <FaSearch className="search-bar-icon" />
                <input
                  type="text"
                  placeholder="Search papers..."
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

        <section className="materials">
          <div className="materials-grid">
            {filteredPapers.length > 0 ? (
              filteredPapers.map(resource => (
                <ResourceCard
                  key={resource.id}
                  {...resource}
                  type="book"
                  onView={() => handleViewResource(resource)}
                  onDownload={() => handleDownloadResource(resource)}
                />
              ))
            ) : (
              <div className="empty-state">
                <h3>No Past Papers Found</h3>
                <p>No past papers match your selected filters. Please try a different combination.</p>
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

        <div className="status-bar">
          <span className="dot"></span>
          Showing {filteredPapers.length} of {totalItems} papers
          {loading && " · refreshing…"}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PastPapers;

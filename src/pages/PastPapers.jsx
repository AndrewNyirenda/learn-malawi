import React, { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import "../styles/pastPapers.css";
import Footer from "../components/Footer.jsx";
import { usePastPapers } from "../contexts/PastPapersContext";
import Header from "../components/Header";
import PageHeader from "../components/page-header";
import Pagination from "../components/Pagination";

const PastPapers = () => {
  const [level, setLevel] = useState("secondary");
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
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

  if (loading && pastPapers.length === 0) {
    return (
      <>
        <Header />
        <div className="past-papers-container">
          <PageHeader
            title="Past Papers & Reviews"
            description="Access a curated collection of past papers and reviews to support your primary and secondary school studies."
          />
          <div className="papers-loading-state">
            <div className="papers-loading-spinner"></div>
            <p>Loading past papers...</p>
          </div>
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
          <div className="papers-error-state">
            <h3 className="papers-error-title">Error Loading Past Papers</h3>
            <p className="papers-error-message">{error}</p>
            <button
              className="papers-retry-button"
              onClick={() => {
                clearError();
                fetchPastPapers();
              }}
            >
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
        <PageHeader
          title="Past Papers & Reviews"
          description="Access a curated collection of past papers and reviews to support your primary and secondary school studies."
        />

        <div className="papers-level-tabs">
          <button
            className={level === "primary" ? "active" : ""}
            onClick={() => setLevel("primary")}
          >
            Primary
          </button>
          <button
            className={level === "secondary" ? "active" : ""}
            onClick={() => setLevel("secondary")}
          >
            Secondary
          </button>
        </div>

        <div className="papers-filters-section">
          <div className="papers-filter-group">
            <label className="papers-filter-label">Category</label>
            <div className="papers-filter-container">
              <select
                className="papers-filter-select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="papers-filter-group">
            <label className="papers-filter-label">Class</label>
            <div className="papers-filter-container">
              <select
                className="papers-filter-select"
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Classes</option>
                {classes.map((cls, i) => (
                  <option key={i} value={cls.class}>
                    {cls.class}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="papers-filter-group">
            <label className="papers-filter-label">Year</label>
            <div className="papers-filter-container">
              <select
                className="papers-filter-select"
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Years</option>
                {years.map((y, i) => (
                  <option key={i} value={y.year}>
                    {y.year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <section className="papers-section">

          <div className="papers-grid">
            {pastPapers.length > 0 ? (
              pastPapers.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  {...resource}
                  onView={() => handleViewResource(resource)}
                  onDownload={() => handleDownloadResource(resource)}
                />
              ))
            ) : (
              <div className="papers-empty-state">
                <div className="papers-empty-message">No Past Papers Available</div>
                <div className="papers-empty-hint">
                  No past papers found for the selected filters. Please try different category, class, or year.
                </div>
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

        <div className="papers-connection-status">
          <small>
            Showing {pastPapers.length} past papers
            {loading && " (loading more...)"}
          </small>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PastPapers;
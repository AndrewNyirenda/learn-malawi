import React, { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import "../styles/pastPapers.css";
import Footer from "../components/Footer.jsx";
import { usePastPapers } from "../contexts/PastPapersContext";
import Header from '../components/Header';
import PageHeader from '../components/page-header';
import Pagination from '../components/Pagination';

const PastPapers = () => {
  const [level, setLevel] = useState("secondary");
  const [searchTerm, setSearchTerm] = useState("");
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
    const levelEnum = level === 'primary' ? 'primary' : 'secondary';
    fetchCategories(levelEnum);
    fetchClasses(levelEnum);
    fetchYears(levelEnum);
  }, [level]);

  useEffect(() => {
    const loadPastPapers = async () => {
      const levelEnum = level === 'primary' ? 'primary' : 'secondary';
      
      const filters = {
        level: levelEnum,
        ...(category !== 'all' && { category }),
        ...(classFilter !== 'all' && { class: classFilter }),
        ...(yearFilter !== 'all' && { year: parseInt(yearFilter) }),
        ...(searchTerm && { search: searchTerm }),
      };
      
      const result = await fetchPastPapers(currentPage, itemsPerPage, filters);
      
      if (result && result.total) {
        setTotalItems(result.total);
      }
    };
    
    loadPastPapers();
  }, [level, category, classFilter, yearFilter, searchTerm, currentPage]);

  useEffect(() => {
    setCategory("all");
    setClassFilter("all");
    setYearFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  }, [level]);

  const getAvailableClasses = () => {
    return classes.map(cls => cls.class);
  };

  const getAvailableYears = () => {
    return years.map(year => year.year);
  };

  const handleViewResource = async (resource) => {
    try {
      const { viewUrl } = await getViewUrl(resource.id);
      window.open(viewUrl, '_blank');
    } catch (err) {
      console.error('Error viewing resource:', err);
      alert('Could not open the PDF. Please try downloading instead.');
    }
  };

  const handleDownloadResource = async (resource) => {
    try {
      const { downloadUrl, fileName } = await getDownloadUrl(resource.id);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading resource:', err);
      alert('Failed to download the file. Please try again.');
    }
  };

  const clearCategoryFilter = () => {
    setCategory("all");
    setCurrentPage(1);
  };

  const clearClassFilter = () => {
    setClassFilter("all");
    setCurrentPage(1);
  };

  const clearYearFilter = () => {
    setYearFilter("all");
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
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
            <button onClick={() => { clearError(); fetchPastPapers(); }} className="papers-retry-button">
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

        {/* Papers Level Tabs */}
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

        {/* Search Section */}
        <div className="papers-search-section">
          <div className="papers-search-container">
            <input
              type="text"
              placeholder="Search past papers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="papers-search-input"
            />
            {searchTerm && (
              <button
                className="papers-filter-clear"
                onClick={clearSearch}
                title="Clear search"
                type="button"
                style={{ right: '20px' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Papers Filters Section */}
        <div className="papers-filters-section">
          {/* Category Filter */}
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
                disabled={categories.length === 0}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
              {category !== 'all' && (
                <button
                  className="papers-filter-clear"
                  onClick={clearCategoryFilter}
                  title="Clear category filter"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Class Filter */}
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
                disabled={classes.length === 0}
              >
                <option value="all">All Classes</option>
                {getAvailableClasses().map((cls, index) => (
                  <option key={index} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              {classFilter !== 'all' && (
                <button
                  className="papers-filter-clear"
                  onClick={clearClassFilter}
                  title="Clear class filter"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Year Filter */}
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
                disabled={years.length === 0}
              >
                <option value="all">All Years</option>
                {getAvailableYears().map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {yearFilter !== 'all' && (
                <button
                  className="papers-filter-clear"
                  onClick={clearYearFilter}
                  title="Clear year filter"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Papers Section */}
        <section className="papers-section">
          <h2 className="papers-section-title">Past Papers</h2>
          <div className="papers-grid">
            {pastPapers.length > 0 ? (
              pastPapers.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  thumbnail={resource.thumbnailUrl || "/images/pdf.png"}
                  downloadLink={resource.fileUrl}
                  downloadName={resource.fileName || resource.title}
                  category={resource.category}
                  class={resource.class}
                  level={resource.level}
                  year={resource.year}
                  subject={resource.subject}
                  examinationBody={resource.examinationBody}
                  paperNumber={resource.paperNumber}
                  paperType={resource.paperType}
                  onView={() => handleViewResource(resource)}
                  onDownload={() => handleDownloadResource(resource)}
                />
              ))
            ) : (
              <div className="papers-empty-state">
                <p className="papers-empty-message">
                  No past papers found matching your filters. Try adjusting your search criteria.
                </p>
                <p className="papers-empty-hint">
                  Note: The backend API might not have any past papers uploaded yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Pagination */}
        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            showPageNumbers={false}
            showPrevNext={true}
            prevLabel="Previous"
            nextLabel="Next"
            className="papers-pagination"
            disabled={loading}
          />
        )}

        {/* Connection Status */}
        <div className="papers-connection-status">
          <small>
            Showing {pastPapers.length} past papers from backend API
            {loading && ' (loading more...)'}
          </small>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default PastPapers;
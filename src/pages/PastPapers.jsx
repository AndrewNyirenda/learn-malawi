import React, { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import "../styles/pastPapers.css";
import Footer from "../components/Footer.jsx";
import { usePastPapers } from "../contexts/PastPapersContext";

const PastPapers = () => {
  const [level, setLevel] = useState("secondary");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [viewingResource, setViewingResource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    pastPapers,
    categories,
    classes,
    years,
    examinationBodies,
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

  // Load data when level changes
  useEffect(() => {
    const levelEnum = level === 'primary' ? 'primary' : 'secondary';
    
    fetchCategories(levelEnum);
    fetchClasses(levelEnum);
    fetchYears(levelEnum);
  }, [level]);

  // Fetch past papers when filters change
  useEffect(() => {
    const levelEnum = level === 'primary' ? 'primary' : 'secondary';
    
    const filters = {
      level: levelEnum,
      ...(category !== 'all' && { category }),
      ...(classFilter !== 'all' && { class: classFilter }),
      ...(yearFilter !== 'all' && { year: parseInt(yearFilter) }),
      ...(searchTerm && { search: searchTerm }),
    };
    
    fetchPastPapers(currentPage, 12, filters);
  }, [level, category, classFilter, yearFilter, searchTerm, currentPage]);

  // Reset filters when level changes
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

  const closeViewer = () => setViewingResource(null);

  const handleViewResource = async (resource) => {
    try {
      // Open PDF in new tab
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
      
      // Create a temporary link to trigger download
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

  const allCategories = ["all", ...categories.map(cat => cat.category)].filter(Boolean);
  const availableClasses = ["all", ...getAvailableClasses()].filter(Boolean);
  const availableYears = ["all", ...getAvailableYears()].filter(Boolean);

  const getAuthorName = (uploadedBy) => {
    if (!uploadedBy) return "Unknown";
    if (typeof uploadedBy === 'object') {
      return `${uploadedBy.firstName || ''} ${uploadedBy.lastName || ''}`.trim() || "Unknown";
    }
    return uploadedBy;
  };

  if (loading && pastPapers.length === 0) {
    return (
      <div className="pastpapers-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading past papers...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && pastPapers.length === 0) {
    return (
      <div className="pastpapers-wrapper">
        <div className="error-container">
          <h3>Error Loading Past Papers</h3>
          <p>{error}</p>
          <button onClick={() => { clearError(); fetchPastPapers(); }} className="retry-btn">
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="pastpapers-wrapper">
        <h1>Past Papers & Reviews</h1>
        <p className="description-text">
          Access a curated collection of past papers and reviews to support your primary and secondary school studies. 
          Use the filters below to quickly find the resources you need.
        </p>

        {/* Level Tabs */}
        <div className="level-tabs">
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

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search past papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filters Container */}
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="filter-select"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="class">Class / Form</label>
            <select
              id="class"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="filter-select"
            >
              {availableClasses.map(cls => (
                <option key={cls} value={cls}>
                  {cls === 'all' ? 'All Classes' : cls}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="year">Year</label>
            <select
              id="year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="filter-select"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year === 'all' ? 'All Years' : year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Past Papers Section */}
        <section>
          <h2>Past Papers & Reviews</h2>
          <div className="grid-container">
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
                  author={resource.author}
                  uploadedBy={getAuthorName(resource.uploadedBy)}
                  viewCount={resource.viewCount}
                  downloadCount={resource.downloadCount}
                  onView={() => handleViewResource(resource)}
                  onDownload={() => handleDownloadResource(resource)}
                />
              ))
            ) : (
              <div className="no-results-container">
                <p className="no-results">
                  No past papers found matching your filters. Try adjusting your search criteria.
                </p>
                <p className="no-results-hint">
                  Note: The backend API might not have any past papers uploaded yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Pagination */}
        {pastPapers.length > 0 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>
            <span className="pagination-info">Page {currentPage}</span>
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        )}

        {/* Connection Status */}
        <div className="connection-status">
          <small>
            Showing {pastPapers.length} past papers from backend API
            {loading && ' (loading more...)'}
          </small>
        </div>

        {/* Modal */}
        {viewingResource && (
          <div className="modal-overlay" onClick={closeViewer}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={closeViewer}>
                &times;
              </button>
              <h2>{viewingResource.title}</h2>
              <iframe
                src={viewingResource.downloadLink}
                title={viewingResource.title}
                width="100%"
                height="600px"
                style={{ border: "none" }}
              />
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default PastPapers;
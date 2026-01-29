import React, { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import "../styles/pastPapers.css";
import Footer from "../components/Footer.jsx";
import { usePastPapers } from "../contexts/PastPapersContext";
import Header from '../components/Header';
import PageHeader from '../components/page-header';
import Filter from '../components/Filter'; // Import reusable Filter
import Pagination from '../components/Pagination'; // Import reusable Pagination

const PastPapers = () => {
  const [level, setLevel] = useState("secondary");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [viewingResource, setViewingResource] = useState(null);
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

  // Load data when level changes
  useEffect(() => {
    const levelEnum = level === 'primary' ? 'primary' : 'secondary';
    
    fetchCategories(levelEnum);
    fetchClasses(levelEnum);
    fetchYears(levelEnum);
  }, [level]);

  // Fetch past papers when filters change
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
      
      // Store total items from API response
      if (result && result.total) {
        setTotalItems(result.total);
      }
    };
    
    loadPastPapers();
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

  // Prepare options for Filter components
  const categoryOptions = ["all", ...categories.map(cat => cat.category)]
    .filter(Boolean)
    .map(category => ({
      value: category,
      label: category === 'all' ? 'All Categories' : category
    }));

  const classOptions = ["all", ...getAvailableClasses()]
    .filter(Boolean)
    .map(cls => ({
      value: cls,
      label: cls === 'all' ? 'All Classes' : cls
    }));

  const yearOptions = ["all", ...getAvailableYears()]
    .filter(Boolean)
    .map(year => ({
      value: year,
      label: year === 'all' ? 'All Years' : year.toString()
    }));

  if (loading && pastPapers.length === 0) {
    return (
      <>
        <Header />
        <div className="pastpapers-wrapper">
          <PageHeader 
            title="Past Papers & Reviews"
            description="Access a curated collection of past papers and reviews to support your primary and secondary school studies."
          />
          <div className="loading-container">
            <div className="loading-spinner"></div>
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
        <div className="pastpapers-wrapper">
          <div className="error-container">
            <h3>Error Loading Past Papers</h3>
            <p>{error}</p>
            <button onClick={() => { clearError(); fetchPastPapers(); }} className="retry-btn">
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
      <div className="pastpapers-wrapper">
        <PageHeader 
          title="Past Papers & Reviews"
          description="Access a curated collection of past papers and reviews to support your primary and secondary school studies."
        />

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

        {/* Filters Container - Using reusable Filter components */}
        <div className="filters-container">
          <div className="filter-group">
            <Filter
              id="category"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              showAllOption={false}
              className="pastpapers-filter"
              placeholder="Select category"
            />
          </div>

          <div className="filter-group">
            <Filter
              id="class"
              value={classFilter}
              onChange={setClassFilter}
              options={classOptions}
              showAllOption={false}
              className="pastpapers-filter"
              placeholder="Select class"
            />
          </div>

          <div className="filter-group">
            <Filter
              id="year"
              value={yearFilter}
              onChange={setYearFilter}
              options={yearOptions}
              showAllOption={false}
              className="pastpapers-filter"
              placeholder="Select year"
            />
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

        {/* Use reusable Pagination component */}
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
            className="pagination"
            disabled={loading}
          />
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
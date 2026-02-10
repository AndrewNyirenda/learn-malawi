import React, { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import "../styles/studyNotes.css";
import Footer from "../components/Footer.jsx";
import { useStudyNotes } from "../contexts/StudyNotesContext";
import Header from '../components/Header';
import PageHeader from '../components/page-header';
import Pagination from '../components/Pagination';

const StudyNotes = () => {
  const [level, setLevel] = useState("secondary");
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
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
    clearError,
  } = useStudyNotes();

  useEffect(() => {
    const levelEnum = level === 'primary' ? 'primary' : 'secondary';
    fetchCategories(levelEnum);
    fetchClasses(levelEnum);
  }, [level]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadBooks = async () => {
      const levelEnum = level === 'primary' ? 'primary' : 'secondary';
      const filters = {
        level: levelEnum,
        ...(category !== 'all' && { category }),
        ...(classFilter !== 'all' && { class: classFilter }),
      };
      
      const result = await fetchBooks(currentPage, itemsPerPage, filters);
      if (result && result.total) {
        setTotalItems(result.total);
      }
    };
    
    loadBooks();
  }, [level, category, classFilter, currentPage]);

  useEffect(() => {
    setCategory("all");
    setClassFilter("all");
    setCurrentPage(1);
  }, [level]);

  const getAvailableClasses = () => {
    return classes.map(cls => cls.class);
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

  if (loading && books.length === 0) {
    return (
      <>
        <Header />
        <div className="study-materials-container">
          <PageHeader 
            title="Study Notes & References"
            description="Access a curated collection of books and reference materials to support your studies."
          />
          <div className="study-loading-state">
            <div className="study-loading-spinner"></div>
            <p>Loading study materials...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error && books.length === 0) {
    return (
      <>
        <Header />
        <div className="study-materials-container">
          <div className="study-error-state">
            <h3 className="study-error-title">Error Loading Study Materials</h3>
            <p className="study-error-message">{error}</p>
            <button onClick={() => { clearError(); fetchBooks(); }} className="study-retry-button">
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
      <div className="study-materials-container">
        <PageHeader 
          title="Study Notes & References"
          description="Access a curated collection of books and reference materials to support your studies."
        />

        {/* Education Level Tabs */}
        <div className="education-level-tabs">
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

        {/* Study Filters Section */}
        <div className="study-filters-section">
          {/* Category Filter */}
          <div className="study-filter-group">
            <label className="materials-filter-label">Category</label>
            <div className="materials-filter-container">
              <select
                className="materials-filter-select"
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
                  className="materials-filter-clear"
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
          <div className="study-filter-group">
            <label className="materials-filter-label">Class</label>
            <div className="materials-filter-container">
              <select
                className="materials-filter-select"
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
                  className="materials-filter-clear"
                  onClick={clearClassFilter}
                  title="Clear class filter"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Materials Section */}
        <section className="materials-section">
          <h2 className="materials-section-title">Study Materials</h2>
          <div className="materials-grid">
            {books.length > 0 ? (
              books.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  thumbnail={resource.thumbnailUrl || "/images/pdf.png"}
                  downloadLink={resource.fileUrl}
                  downloadName={resource.fileName || resource.title}
                  category={resource.category}
                  class={resource.class}
                  year={resource.year}
                  onView={() => handleViewResource(resource)}
                  onDownload={() => handleDownloadResource(resource)}
                />
              ))
            ) : (
              <div className="study-empty-state">
                <p className="empty-state-message">
                  No study materials found matching your filters. Try adjusting your search criteria.
                </p>
                <p className="empty-state-hint">
                  Note: The backend API might not have any books uploaded yet.
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
            className="study-pagination"
            disabled={loading}
          />
        )}

        {/* Connection Status */}
        <div className="study-connection-status">
          <small>
            Showing {books.length} books from backend API
            {loading && ' (loading more...)'}
          </small>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default StudyNotes;
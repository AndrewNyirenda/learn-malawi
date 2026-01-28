import React, { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import "../styles/studyNotes.css";
import Footer from "../components/Footer.jsx";
import { useStudyNotes } from "../contexts/StudyNotesContext";
import Header from '../components/Header';
import PageHeader from '../components/page-header'; // Add this import

const StudyNotes = () => {
  const [level, setLevel] = useState("secondary"); // primary or secondary
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [viewingResource, setViewingResource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Load data when level changes
  useEffect(() => {
    const levelEnum = level === 'primary' ? 'primary' : 'secondary';
    
    fetchCategories(levelEnum);
    fetchClasses(levelEnum);
  }, [level]);

  // Fetch books when filters change
  useEffect(() => {
    const levelEnum = level === 'primary' ? 'primary' : 'secondary';
    
    const filters = {
      level: levelEnum,
      ...(category !== 'all' && { category }),
      ...(classFilter !== 'all' && { class: classFilter }),
    };
    
    fetchBooks(currentPage, 12, filters);
  }, [level, category, classFilter, currentPage]);

  // Reset filters when level changes
  useEffect(() => {
    setCategory("all");
    setClassFilter("all");
    setCurrentPage(1);
  }, [level]);

  const getAvailableClasses = () => {
    return classes.map(cls => cls.class);
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

  if (loading && books.length === 0) {
    return (
      <div className="study-notes-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading study materials...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && books.length === 0) {
    return (
      <div className="study-notes-wrapper">
        <div className="error-container">
          <h3>Error Loading Study Materials</h3>
          <p>{error}</p>
          <button onClick={() => { clearError(); fetchBooks(); }} className="retry-btn">
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="study-notes-wrapper">
        {/* Use PageHeader component */}
        <PageHeader 
          title="Study Notes & References"
          description="Access a curated collection of books and reference materials to support your studies."
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
        </div>

        {/* Books Section */}
        <section>
          <h2>Books and Reference Material</h2>
          <div className="grid-container">
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
              <div className="no-results-container">
                <p className="no-results">
                  No study materials found matching your filters. Try adjusting your search criteria.
                </p>
                <p className="no-results-hint">
                  Note: The backend API might not have any books uploaded yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Pagination */}
        {books.length > 0 && (
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
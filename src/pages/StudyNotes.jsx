import React, { useState, useEffect } from "react";
import studyResources from "../Data/studyResources";
import ResourceCard from "./ResourceCard";
import "../styles/studyNotes.css";
import Footer from "../components/Footer.jsx";

const StudyNotes = () => {
  const [level, setLevel] = useState("primary");
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [viewingResource, setViewingResource] = useState(null);

  // Get available classes based on current level
  const getAvailableClasses = () => {
    const allResources = studyResources[level].books;
    
    const classes = [...new Set(allResources.map(resource => resource.class))];
    return classes.sort((a, b) => {
      const aNum = parseInt(a.replace(/\D/g, ''));
      const bNum = parseInt(b.replace(/\D/g, ''));
      return aNum - bNum;
    });
  };

  const filterResources = (resources) => {
    return resources.filter(({ title, category: resourceCategory, class: resourceClass }) => {
      const matchesCategory = category === "all" || resourceCategory === category;
      const matchesClass = classFilter === "all" || resourceClass === classFilter;
      
      return matchesCategory && matchesClass;
    });
  };

  // Reset filters when level changes
  useEffect(() => {
    setCategory("all");
    setClassFilter("all");
  }, [level]);

  const filteredBooks = filterResources(studyResources[level].books);

  const allCategories = [
    ...new Set(studyResources[level].books.map((b) => b.category)),
  ];

  const closeViewer = () => setViewingResource(null);

  const availableClasses = getAvailableClasses();

  return (
    <>
      <div className="study-notes-wrapper">
        <h1>Study Notes & References</h1>
        <p className="description-text">
          Access a curated collection of books and reference materials to support your studies.
          <br />
          <br />
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
              <option value="all">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
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
              <option value="all">All Classes</option>
              {availableClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Books Section */}
        <section>
          <h2>Books and Reference Material</h2>
          <div className="grid-container">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  {...resource}
                  onView={() => setViewingResource(resource)}
                />
              ))
            ) : (
              <p className="no-results">No study materials found matching your filters. Try adjusting your search criteria.</p>
            )}
          </div>
        </section>

        {/* PDF Modal Viewer */}
        {viewingResource && (
          <div className="modal-overlay" onClick={closeViewer}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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

export default StudyNotes;
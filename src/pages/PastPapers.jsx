import React, { useState, useEffect } from "react";
import studyResources from "../Data/studyResources";
import ResourceCard from "./ResourceCard";
import "../styles/pastPapers.css";
import Footer from "../components/Footer.jsx";

const PastPapers = () => {
  const [level, setLevel] = useState("primary");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [viewingResource, setViewingResource] = useState(null); 

  // Get available classes based on current level
  const getAvailableClasses = () => {
    const allResources = studyResources[level].pastPapers;
    
    const classes = [...new Set(allResources.map(resource => resource.class))];
    return classes.sort((a, b) => {
      const aNum = parseInt(a.replace(/\D/g, ''));
      const bNum = parseInt(b.replace(/\D/g, ''));
      return aNum - bNum;
    });
  };

  const getAvailableYears = () => {
    const allResources = studyResources[level].pastPapers;
    const years = [...new Set(allResources
      .filter(resource => resource.year)
      .map(resource => resource.year)
    )];
    return years.sort((a, b) => b - a); // Sort descending (newest first)
  };

  const filterResources = (resources) => {
    return resources.filter(({ title, category: resourceCategory, class: resourceClass, year }) => {
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === "all" || resourceCategory === category;
      const matchesClass = classFilter === "all" || resourceClass === classFilter;
      const matchesYear = yearFilter === "all" || year == yearFilter;
      
      return matchesSearch && matchesCategory && matchesClass && matchesYear;
    });
  };

  // Reset filters when level changes
  useEffect(() => {
    setCategory("all");
    setClassFilter("all");
    setYearFilter("all");
  }, [level]);

  const filteredPastPapers = filterResources(studyResources[level].pastPapers);

  const allCategories = [
    ...new Set(studyResources[level].pastPapers.map(p => p.category))
  ];

  const closeViewer = () => setViewingResource(null);

  const availableClasses = getAvailableClasses();
  const availableYears = getAvailableYears();

  return (
    <>
      <div className="pastpapers-wrapper">
        <h1>Past Papers & Reviews</h1>
        <p className="description-text">
          Access a curated collection of past papers and reviews to support your primary and secondary school studies. 
          Use the filters below to quickly find the resources you need.
        </p>

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
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
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

          <div className="filter-group">
            <label htmlFor="year">Year</label>
            <select
              id="year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Past Papers Section */}
        <section>
          <h2>Past Papers & Reviews</h2>
          <div className="grid-container">
            {filteredPastPapers.length > 0 ? (
              filteredPastPapers.map(resource => (
                <ResourceCard
                  key={resource.id}
                  {...resource}
                  onView={() => setViewingResource(resource)}
                />
              ))
            ) : (
              <p className="no-results">No past papers found matching your filters. Try adjusting your search criteria.</p>
            )}
          </div>
        </section>

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
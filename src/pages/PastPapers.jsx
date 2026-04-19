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
<div className="state-box">
<span className="spinner" />
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
<div className="state-box">
<h3>Error Loading Past Papers</h3>
<p>{error}</p>
<button
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

    <div className="level-switch">
      <button
        className={level === "primary" ? "active" : ""}
        onClick={() => setLevel("primary")}
      >
        Primary Level
      </button>
      <button
        className={level === "secondary" ? "active" : ""}
        onClick={() => setLevel("secondary")}
      >
        Secondary Level
      </button>
    </div>

    <div className="pp-filters">
      <select
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

      <select
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

      <select
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

    <section className="materials">
      <div className="materials-grid">
        {pastPapers.length > 0 ? (
          pastPapers.map((resource) => (
<ResourceCard
  key={resource.id}
  {...resource}
  type="book"  // Add this line to show book image for all past papers
  onView={() => handleViewResource(resource)}
  onDownload={() => handleDownloadResource(resource)}
/>
          ))
        ) : (
          <div className="empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="#94a3b8">
              <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14z"/>
              <path d="M7 9h10v2H7zm0 4h8v2H7z"/>
            </svg>
            <h3>No Past Papers Available</h3>
            <p>No past papers found for the selected filters. Please try different category, class, or year.</p>
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

    <div className="status">
      Showing {pastPapers.length}{" "}
      {pastPapers.length === 1 ? "past paper" : "past papers"}
      {loading && " · loading"}
    </div>
  </div>
  <Footer />
</>

);
};

export default PastPapers;
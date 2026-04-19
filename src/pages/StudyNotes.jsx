import React, { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import "../styles/studyNotes.css";
import Footer from "../components/Footer.jsx";
import { useStudyNotes } from "../contexts/StudyNotesContext";
import Header from "../components/Header";
import PageHeader from "../components/page-header";
import Pagination from "../components/Pagination";

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
    clearError
  } = useStudyNotes();

  useEffect(() => {
    const levelEnum = level === "primary" ? "primary" : "secondary";
    fetchCategories(levelEnum);
    fetchClasses(levelEnum);
  }, [level]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadBooks = async () => {
      const filters = {
        level,
        ...(category !== "all" && { category }),
        ...(classFilter !== "all" && { class: classFilter })
      };
      const result = await fetchBooks(currentPage, itemsPerPage, filters);
      if (result?.total) setTotalItems(result.total);
    };
    loadBooks();
  }, [level, category, classFilter, currentPage]);

  useEffect(() => {
    setCategory("all");
    setClassFilter("all");
    setCurrentPage(1);
  }, [level]);

  const handleViewResource = async resource => {
    const { viewUrl } = await getViewUrl(resource.id);
    window.open(viewUrl, "_blank");
  };

  const handleDownloadResource = async resource => {
    const { downloadUrl, fileName } = await getDownloadUrl(resource.id);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName || resource.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && books.length === 0) {
    return (
      <>
        <Header />
        <main className="study-page">
          <PageHeader
            title="Study Notes & References"
            description="Curated academic materials to support focused learning."
          />
          <div className="state-box">
            <span className="spinner" />
            <p>Loading materials</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error && books.length === 0) {
    return (
      <>
        <Header />
        <main className="study-page">
          <div className="state-box">
            <h3>Unable to load resources</h3>
            <p>{error}</p>
            <button onClick={() => { clearError(); fetchBooks(); }}>
              Try again
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="study-page">
        <PageHeader
          title="Study Notes & References"
          description="Curated academic materials to support focused learning."
        />

        <div className="level-switch">
          <button className={level === "primary" ? "active" : ""} onClick={() => setLevel("primary")}>
            Primary Level
          </button>
          <button className={level === "secondary" ? "active" : ""} onClick={() => setLevel("secondary")}>
            Secondary Level
          </button>
        </div>

        <div className="filters">
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.category}>{c.category}</option>
            ))}
          </select>

          <select value={classFilter} onChange={e => setClassFilter(e.target.value)}>
            <option value="all">All Classes</option>
            {classes.map((c, i) => (
              <option key={i} value={c.class}>{c.class}</option>
            ))}
          </select>
        </div>

        <section className="materials">
          {books.length > 0 ? (
            <div className="materials-grid">
              {books.map(resource => (
<ResourceCard
  key={resource.id}
  title={resource.title}
  type="book"  // Add this line to show the book image
  thumbnail={resource.thumbnailUrl || "/images/pdf.png"}
  category={resource.category}
  class={resource.class}
  year={resource.year}
  onView={() => handleViewResource(resource)}
  onDownload={() => handleDownloadResource(resource)}
/>
              ))}
            </div>
          ) : (
            <div className="empty">
              <p>No materials match your filters.</p>
            </div>
          )}
        </section>

        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        )}

        <div className="status">
          Showing {books.length} resources {loading && "· loading"}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StudyNotes;
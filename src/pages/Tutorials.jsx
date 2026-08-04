// pages/Tutorials.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTutorials } from "../contexts/TutorialsContext";
import "../styles/tutorials.css";
import "../styles/modal.css"; // shared modal styles
import Footer from "../components/Footer.jsx";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";
import {
  FaHome,
  FaChevronRight,
  FaVideo,
  FaEye,
  FaDownload,
  FaTimes,
} from "react-icons/fa";

// ─── Skeleton (matching PastPapers) ────────────────────────────────
const SkeletonGrid = ({ count = 12 }) => (
  <div className="tutorials-materials-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div className="tutorials-skeleton-card" key={i}>
        <div className="tutorials-skeleton-cover" />
        <div className="tutorials-skeleton-line" />
        <div className="tutorials-skeleton-line short" />
      </div>
    ))}
  </div>
);

// ─── Masthead (identical to PastPapers, with FaVideo) ─────────────
const Masthead = () => (
  <div className="tutorials-page-masthead">
    <div className="tutorials-masthead-inner">
      <nav className="tutorials-breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><FaHome /> Home</Link>
        <FaChevronRight />
        <span className="tutorials-breadcrumb-current">Tutorials</span>
      </nav>

      <div className="tutorials-masthead-eyebrow">
        <span className="tutorials-masthead-eyebrow-icon">
          <FaVideo />
        </span>
        Video Resources
      </div>

      <h1 className="tutorials-masthead-title">
        Educational <span className="tutorials-masthead-title-accent">Tutorials</span>
      </h1>

      <p className="tutorials-masthead-desc">
        Access comprehensive video tutorials covering various subjects for both Primary and Secondary levels.
      </p>

      <div className="tutorials-masthead-meta">
        <span className="tutorials-masthead-meta-item">Primary &amp; Secondary</span>
        <span className="tutorials-masthead-meta-item">Subject‑based</span>
        <span className="tutorials-masthead-meta-item">Free Access</span>
      </div>
    </div>
  </div>
);

// ─── Toolbar with prefixed classes ──────────────────────────────────
const Toolbar = ({
  level,
  setLevel,
  subjectFilter,
  setSubjectFilter,
  classFilter,
  setClassFilter,
  subjects,
  classes,
}) => {
  const subjectOptions = [
    { value: "all", label: "All Subjects" },
    ...(subjects || []).map((s) => ({ value: s, label: s })),
  ];
  const classOptions = [
    { value: "all", label: "All Classes" },
    ...(classes || [])
      .sort((a, b) => {
        const aNum = parseInt(a.replace(/\D/g, ""));
        const bNum = parseInt(b.replace(/\D/g, ""));
        return aNum - bNum;
      })
      .map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="tutorials-toolbar-panel">
      <div className="tutorials-toolbar-row">
        <div className="tutorials-level-switch" data-level={level}>
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

        <div className="tutorials-filter-group">
          <label className="tutorials-filter-label" htmlFor="tutorials-subject">Subject:</label>
          <Filter
            id="tutorials-subject"
            className="tutorials-filter-select"
            value={subjectFilter}
            onChange={setSubjectFilter}
            options={subjectOptions}
            showAllOption={false}
            placeholder="Select subject"
          />
        </div>

        <div className="tutorials-filter-group">
          <label className="tutorials-filter-label" htmlFor="tutorials-class">Class:</label>
          <Filter
            id="tutorials-class"
            className="tutorials-filter-select"
            value={classFilter}
            onChange={setClassFilter}
            options={classOptions}
            showAllOption={false}
            placeholder="Select class"
          />
        </div>
      </div>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────
const Tutorials = () => {
  const [level, setLevel] = useState("secondary");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;
  const [videoErrors, setVideoErrors] = useState({});

  // Modal state
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const {
    tutorials,
    subjects,
    classes,
    loading,
    error,
    fetchTutorials,
    fetchSubjects,
    fetchClasses,
    clearError,
  } = useTutorials();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const filters = {
        level,
        ...(subjectFilter !== "all" && { subject: subjectFilter }),
        ...(classFilter !== "all" && { class: classFilter }),
      };

      const result = await fetchTutorials(currentPage, itemsPerPage, filters);
      if (result?.total) setTotalItems(result.total);

      await Promise.all([fetchSubjects(level), fetchClasses(level)]);
    };
    loadData();
  }, [level, subjectFilter, classFilter, currentPage]);

  useEffect(() => {
    setSubjectFilter("all");
    setClassFilter("all");
    setCurrentPage(1);
  }, [level]);

  const handleVideoError = useCallback((tutorialId) => {
    setVideoErrors((prev) => ({
      ...prev,
      [tutorialId]: true,
    }));
  }, []);

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const isYouTubeUrl = (url) => {
    return url?.includes("youtube.com") || url?.includes("youtu.be");
  };

  const handleSetLevel = useCallback((newLevel) => {
    setLevel(newLevel);
    setCurrentPage(1);
  }, []);

  const handleSubjectChange = useCallback((value) => {
    setSubjectFilter(value);
    setCurrentPage(1);
  }, []);

  const handleClassChange = useCallback((value) => {
    setClassFilter(value);
    setCurrentPage(1);
  }, []);

  // ── Card click → open modal ──
  const handleCardClick = (tutorial) => {
    setSelectedTutorial(tutorial);
  };

  const closeModal = () => {
    setSelectedTutorial(null);
  };

  if (loading && tutorials.length === 0) {
    return (
      <>
        <Header />
        <div className="tutorials-container">
          <Masthead />
          <Toolbar
            level={level}
            setLevel={handleSetLevel}
            subjectFilter={subjectFilter}
            setSubjectFilter={handleSubjectChange}
            classFilter={classFilter}
            setClassFilter={handleClassChange}
            subjects={subjects}
            classes={classes}
          />
          <SkeletonGrid count={itemsPerPage} />
        </div>
        <Footer />
      </>
    );
  }

  if (error && tutorials.length === 0) {
    return (
      <>
        <Header />
        <div className="tutorials-container">
          <Masthead />
          <div className="tutorials-state-box">
            <h3>Error Loading Tutorials</h3>
            <p>{error}</p>
            <button
              onClick={() => {
                clearError();
                fetchTutorials(currentPage, itemsPerPage, { level });
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
      <div className="tutorials-container">
        <Masthead />
        <Toolbar
          level={level}
          setLevel={handleSetLevel}
          subjectFilter={subjectFilter}
          setSubjectFilter={handleSubjectChange}
          classFilter={classFilter}
          setClassFilter={handleClassChange}
          subjects={subjects}
          classes={classes}
        />

        <section className="tutorials-materials">
          {tutorials.length > 0 ? (
            <div className="tutorials-materials-grid">
              {tutorials.map((tut, index) => {
                const isYouTube = isYouTubeUrl(tut.videoUrl);
                const embedUrl = getYouTubeEmbedUrl(tut.videoUrl);
                const thumbnail = isYouTube
                  ? `https://img.youtube.com/vi/${extractYouTubeId(
                      tut.videoUrl
                    )}/hqdefault.jpg`
                  : "/images/video-placeholder.jpg";

                return (
                  <div
                    className="tutorials-card clickable"
                    key={tut.id}
                    onClick={() => handleCardClick(tut)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleCardClick(tut)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="tutorials-card-accent" />
                    <div className="tutorials-card-media">
                      {videoErrors[tut.id] ? (
                        <div className="tutorials-media-error">
                          <span>Video unavailable</span>
                        </div>
                      ) : isYouTube ? (
                        <>
                          <img
                            src={thumbnail}
                            alt={tut.title}
                            className="tutorials-card-thumbnail"
                            loading="lazy"
                          />
                          <iframe
                            src={embedUrl}
                            title={tut.title}
                            allowFullScreen
                            frameBorder="0"
                            className="tutorials-video-iframe"
                            onError={() => handleVideoError(tut.id)}
                          />
                        </>
                      ) : tut.videoUrl?.endsWith(".mp4") ? (
                        <video controls className="tutorials-video-player">
                          <source src={tut.videoUrl} type="video/mp4" />
                        </video>
                      ) : (
                        <div className="tutorials-media-error">
                          <span>Format not supported</span>
                        </div>
                      )}
                    </div>

                    <div className="tutorials-card-body">
                      <div className="tutorials-title-container">
                        <h3 className="tutorials-card-title">{tut.title}</h3>
                      </div>
                      <div className="tutorials-card-meta">
                        {tut.subject && (
                          <span className="tutorials-meta-item tutorials-meta-subject">
                            {tut.subject}
                          </span>
                        )}
                        {tut.class && (
                          <span className="tutorials-meta-item tutorials-meta-class">
                            Class {tut.class}
                          </span>
                        )}
                      </div>
                      {tut.description && (
                        <p className="tutorials-card-description">
                          {tut.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="tutorials-empty">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="#94a3b8">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14z" />
                <path d="M7 9h10v2H7zm0 4h8v2H7z" />
              </svg>
              <h3>No Tutorials Available</h3>
              <p>
                No tutorials found for the selected filters. Please try a
                different subject or class.
              </p>
            </div>
          )}
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

        <div className="tutorials-status" role="status" aria-live="polite">
          Showing {tutorials.length}{" "}
          {tutorials.length === 1 ? "tutorial" : "tutorials"}
          {loading && " · loading"}
        </div>
      </div>

      {/* ─── Modal (same as PastPapers) ──────────────────────────── */}
      {selectedTutorial && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>

            <div className="modal-image">
              {selectedTutorial.videoUrl && isYouTubeUrl(selectedTutorial.videoUrl) ? (
                <img
                  src={`https://img.youtube.com/vi/${extractYouTubeId(
                    selectedTutorial.videoUrl
                  )}/hqdefault.jpg`}
                  alt={selectedTutorial.title}
                />
              ) : (
                <FaVideo className="modal-fallback-icon" />
              )}
            </div>

            <h2 className="modal-title">{selectedTutorial.title}</h2>

            <div className="modal-meta">
              {selectedTutorial.subject && (
                <span className="modal-meta-item">{selectedTutorial.subject}</span>
              )}
              {selectedTutorial.class && (
                <span className="modal-meta-item">Class {selectedTutorial.class}</span>
              )}
            </div>

            {selectedTutorial.description && (
              <p className="modal-description">{selectedTutorial.description}</p>
            )}

            <div className="modal-actions">
              <a
                href={selectedTutorial.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-btn modal-view"
              >
                <FaEye /> Watch
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Tutorials;
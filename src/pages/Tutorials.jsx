import React, { useState, useEffect } from "react";
import { useTutorials } from "../contexts/TutorialsContext";
import "../styles/tutorials.css";
import Footer from "../components/Footer.jsx";
import Header from '../components/Header';
import PageHeader from '../components/page-header';
import Filter from '../components/Filter';
import Pagination from "../components/Pagination";

const Tutorials = () => {
  const [level, setLevel] = useState("secondary");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;
  const [videoErrors, setVideoErrors] = useState({});

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
        ...(subjectFilter !== 'all' && { subject: subjectFilter }),
        ...(classFilter !== 'all' && { class: classFilter }),
      };

      const result = await fetchTutorials(currentPage, itemsPerPage, filters);
      
      if (result?.total) {
        setTotalItems(result.total);
      }

      await Promise.all([
        fetchSubjects(level),
        fetchClasses(level),
      ]);
    };

    loadData();
  }, [level, subjectFilter, classFilter, currentPage]);

  useEffect(() => {
    setSubjectFilter("all");
    setClassFilter("all");
    setCurrentPage(1);
  }, [level]);

  const handleVideoError = (tutorialId) => {
    setVideoErrors(prev => ({
      ...prev,
      [tutorialId]: true
    }));
  };

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
    return url?.includes('youtube.com') || url?.includes('youtu.be');
  };

  const getSortedClasses = () => {
    if (!classes || !Array.isArray(classes)) return [];
    return [...classes].sort((a, b) => {
      const aNum = parseInt(a.replace(/\D/g, ''));
      const bNum = parseInt(b.replace(/\D/g, ''));
      return aNum - bNum;
    });
  };

  const subjectOptions = ["all", ...(subjects || [])].map(subject => ({
    value: subject,
    label: subject === "all" ? "All Subjects" : subject
  }));

  const classOptions = ["all", ...getSortedClasses()].map(cls => ({
    value: cls,
    label: cls === "all" ? "All Classes" : cls
  }));

  if (loading && tutorials.length === 0) {
    return (
      <>
        <Header />
        <main className="tutorials-page">
          <PageHeader 
            title="Educational Tutorials"
            description="Access comprehensive video tutorials covering various subjects for both Primary and Secondary levels."
          />
          <div className="state-box">
            <span className="spinner" />
            <p>Loading tutorials...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error && tutorials.length === 0) {
    return (
      <>
        <Header />
        <main className="tutorials-page">
          <div className="state-box">
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
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="tutorials-page">
        <PageHeader 
          title="Educational Tutorials"
          description="Access comprehensive video tutorials covering various subjects for both Primary and Secondary levels."
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

        <div className="filters">
          <div className="filter-group">
            <Filter
              id="subject"
              value={subjectFilter}
              onChange={setSubjectFilter}
              options={subjectOptions}
              showAllOption={false}
              className="tutorials-filter"
              placeholder="Select subject"
            />
          </div>

          <div className="filter-group">
            <Filter
              id="class"
              value={classFilter}
              onChange={setClassFilter}
              options={classOptions}
              showAllOption={false}
              className="tutorials-filter"
              placeholder="Select class"
            />
          </div>
        </div>

        <section className="materials">
          {tutorials.length > 0 ? (
            <div className="materials-grid">
              {tutorials.map((tut) => {
                const isYouTube = isYouTubeUrl(tut.videoUrl);
                const embedUrl = getYouTubeEmbedUrl(tut.videoUrl);
                const thumbnail = isYouTube 
                  ? `https://img.youtube.com/vi/${extractYouTubeId(tut.videoUrl)}/hqdefault.jpg`
                  : '/images/video-placeholder.jpg';

                return (
                  <div className="tutorial-card" key={tut.id}>
                    <div className="card-media">
                      {videoErrors[tut.id] ? (
                        <div className="media-error">
                          <svg className="error-icon" viewBox="0 0 24 24" width="48" height="48">
                            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                          </svg>
                          <span>Video unavailable</span>
                        </div>
                      ) : isYouTube ? (
                        <>
                          <img 
                            src={thumbnail} 
                            alt={tut.title}
                            className="card-thumbnail"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/video-placeholder.jpg';
                            }}
                          />
                          <div className="play-button">
                            <svg viewBox="0 0 24 24" width="48" height="48">
                              <path fill="currentColor" d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                          <iframe
                            src={embedUrl}
                            title={tut.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            frameBorder="0"
                            className="video-iframe"
                            onError={() => handleVideoError(tut.id)}
                          ></iframe>
                        </>
                      ) : tut.videoUrl?.endsWith('.mp4') ? (
                        <div className="custom-video-player">
                          <video
                            controls
                            className="video-player"
                            preload="metadata"
                          >
                            <source src={tut.videoUrl} type="video/mp4" />
                          </video>
                        </div>
                      ) : (
                        <div className="media-error">
                          <svg className="error-icon" viewBox="0 0 24 24" width="48" height="48">
                            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                          </svg>
                          <span>Format not supported</span>
                        </div>
                      )}
                    </div>

                    <div className="card-content">
                      <h3 className="card-title">{tut.title}</h3>
                      
                      <div className="card-meta">
                        <span className="badge subject">{tut.subject}</span>
                        <span className="badge class">Class {tut.class}</span>
                      </div>

                      {tut.description && (
                        <p className="card-description">{tut.description}</p>
                      )}
                    </div>

                    <div className="card-footer">
                      <a 
                        href={tut.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="action-link primary"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path fill="currentColor" d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                        </svg>
                        Open Video
                      </a>
                      {isYouTube && (
                        <a 
                          href={tut.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="action-link youtube"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M10 15l5.19-3L10 9v6zM21.56 7.17c-.25-.94-.98-1.68-1.92-1.94C18.21 4.96 12 4.96 12 4.96s-6.21 0-7.64.27c-.94.25-1.68.99-1.92 1.94C4.17 8.61 4.17 12 4.17 12s0 3.39.27 4.83c.25.94.98 1.68 1.92 1.94 1.43.27 7.64.27 7.64.27s6.21 0 7.64-.27c.94-.25 1.68-.99 1.92-1.94.27-1.44.27-4.83.27-4.83s0-3.39-.27-4.83z"/>
                          </svg>
                          YouTube
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#94a3b8">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14z"/>
                <path d="M7 9h10v2H7zm0 4h8v2H7z"/>
              </svg>
              <h3>No Tutorials Available</h3>
              <p>No tutorials found for the selected filters. Please try different subject or class selection.</p>
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
          Showing {tutorials.length} {tutorials.length === 1 ? 'tutorial' : 'tutorials'} 
          {loading && " · loading"}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Tutorials;
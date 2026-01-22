// src/components/Tutorials.jsx
import React, { useState, useEffect } from "react";
import { useTutorials } from "../contexts/TutorialsContext";
import "../styles/tutorials.css";
import Footer from "../components/Footer.jsx";

const Tutorials = () => {
  const [level, setLevel] = useState("secondary"); 
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
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

  // Load tutorials and filters when level changes
  useEffect(() => {
    const loadData = async () => {
      const filters = {
        level,
        ...(subjectFilter !== 'all' && { subject: subjectFilter }),
        ...(classFilter !== 'all' && { class: classFilter }),
      };
      
      await Promise.all([
        fetchTutorials(filters),
        fetchSubjects(level),
        fetchClasses(level),
      ]);
    };

    loadData();
  }, [level, subjectFilter, classFilter]);

  // Reset filters when level changes
  useEffect(() => {
    setSubjectFilter("all");
    setClassFilter("all");
  }, [level]);

  // Function to handle YouTube embed errors
  const handleVideoError = (tutorialId) => {
    setVideoErrors(prev => ({
      ...prev,
      [tutorialId]: true
    }));
  };

  // Function to check if URL is a YouTube embed
  const isYouTubeUrl = (url) => {
    return url.includes('youtube.com/embed') || url.includes('youtu.be');
  };

  // Sort classes numerically
  const getSortedClasses = () => {
    return [...classes].sort((a, b) => {
      const aNum = parseInt(a.replace(/\D/g, ''));
      const bNum = parseInt(b.replace(/\D/g, ''));
      return aNum - bNum;
    });
  };

  const allSubjects = ["all", ...subjects];
  const availableClasses = getSortedClasses();

  if (loading && tutorials.length === 0) {
    return (
      <>
        <div className="tutorials-wrapper">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading tutorials...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error && tutorials.length === 0) {
    return (
      <>
        <div className="tutorials-wrapper">
          <div className="error-container">
            <h3>Error Loading Tutorials</h3>
            <p>{error}</p>
            <button 
              onClick={() => { 
                clearError(); 
                fetchTutorials({ level }); 
              }} 
              className="retry-btn"
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
    <div className="tutorials-wrapper">
      <h1 className="tutorials-title">Educational Tutorials</h1>
      
      {/* Added description below the title */}
      <p className="tutorials-description">
        Access comprehensive video tutorials covering various subjects for both Primary and Secondary levels. 
        Filter by subject and class to find the most relevant educational content for your studies.
      </p>

      <div className="level-tabs">
        <button
          className={level === "primary" ? "active" : ""}
          onClick={() => {
            setLevel("primary");
          }}
        >
          Primary
        </button>
        <button
          className={level === "secondary" ? "active" : ""}
          onClick={() => {
            setLevel("secondary");
          }}
        >
          Secondary
        </button>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="filter-select"
          >
            {allSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject === "all" ? "All Subjects" : subject}
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

      <div className="tutorials-grid">
        {tutorials.length > 0 ? (
          tutorials.map((tut) => (
            <div className="tutorial-card" key={tut.id}>
              <h3>{tut.title}</h3>
              <div className="tutorial-meta">
                <span className="tutorial-subject">{tut.subject}</span>
                <span className="tutorial-class">{tut.class}</span>
              </div>
              
              <div className="video-wrapper">
                {videoErrors[tut.id] ? (
                  <div className="video-error">
                    <p>Video unavailable</p>
                    <a 
                      href={tut.videoUrl.replace('embed/', 'watch?v=')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="external-link"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                ) : isYouTubeUrl(tut.videoUrl) ? (
                  <iframe
                    src={tut.videoUrl}
                    title={tut.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                    className="tutorial-iframe"
                    onError={() => handleVideoError(tut.id)}
                  ></iframe>
                ) : tut.videoUrl.endsWith('.mp4') ? (
                  <video
                    controls
                    className="tutorial-video"
                  >
                    <source src={tut.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : tut.videoUrl.endsWith('.mp3') ? (
                  <audio
                    controls
                    className="tutorial-audio"
                  >
                    <source src={tut.videoUrl} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                ) : (
                  <div className="video-error">
                    <p>Unsupported video format</p>
                    <a 
                      href={tut.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="external-link"
                    >
                      Open video
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No tutorials available for this selection.</p>
        )}
      
      </div>
    </div>
    
      <Footer />
    </>
  );
};

export default Tutorials;
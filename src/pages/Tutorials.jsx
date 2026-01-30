import React, { useState, useEffect } from "react";
import { useTutorials } from "../contexts/TutorialsContext";
import "../styles/tutorials.css";
import Footer from "../components/Footer.jsx";
import Header from '../components/Header';
import PageHeader from '../components/page-header';
import Filter from '../components/Filter'; // Import reusable Filter

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
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getSortedClasses = () => {
    return [...classes].sort((a, b) => {
      const aNum = parseInt(a.replace(/\D/g, ''));
      const bNum = parseInt(b.replace(/\D/g, ''));
      return aNum - bNum;
    });
  };

  // Prepare options for Filter components
  const subjectOptions = ["all", ...subjects]
    .map(subject => ({
      value: subject,
      label: subject === "all" ? "All Subjects" : subject
    }));

  const classOptions = ["all", ...getSortedClasses()]
    .map(cls => ({
      value: cls,
      label: cls === "all" ? "All Classes" : cls
    }));

  if (loading && tutorials.length === 0) {
    return (
      <>
        <Header />
        <div className="tutorials-wrapper">
          <PageHeader 
            title="Educational Tutorials"
            description="Access comprehensive video tutorials covering various subjects for both Primary and Secondary levels."
          />
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
        <Header />
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
      <Header />
      <div className="tutorials-wrapper">
        <PageHeader 
          title="Educational Tutorials"
          description="Access comprehensive video tutorials covering various subjects for both Primary and Secondary levels."
        />

        {/* Level Tabs */}
        <section className="tutorials-level-section">
          <div className="level-tabs">
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
        </section>

        {/* Filters Section - Using reusable Filter components */}
        <section className="tutorials-filters-section">
          <div className="filters-container">
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
        </section>

        {/* Tutorials Grid */}
        <section className="tutorials-content-section">
          {tutorials.length > 0 ? (
            <div className="tutorials-grid">
              {tutorials.map((tut) => {
                const isYouTube = isYouTubeUrl(tut.videoUrl);
                const embedUrl = getYouTubeEmbedUrl(tut.videoUrl);
                
                return (
                  <div className="tutorial-card" key={tut.id}>
                    {/* Video Container */}
                    <div className="video-container">
                      {videoErrors[tut.id] ? (
                        <div className="video-error">
                          <p>Video content is currently unavailable</p>
                          <a 
                            href={tut.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="external-link"
                          >
                            Watch on YouTube
                          </a>
                        </div>
                      ) : isYouTube ? (
                        <iframe
                          src={embedUrl}
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
                            Open video link
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Tutorial Content */}
                    <div className="tutorial-content">
                      <h3 className="tutorial-title">{tut.title}</h3>
                      
                      <div className="tutorial-meta">
                        <span className="tutorial-subject">{tut.subject}</span>
                        <span className="tutorial-class">{tut.class}</span>
                      </div>
                      
                      {tut.description && (
                        <p className="tutorial-description">{tut.description}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="tutorial-actions">
                      <a 
                        href={tut.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="direct-link"
                      >
                        Open in New Tab
                      </a>
                      {isYouTube && (
                        <a 
                          href={tut.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="external-link"
                        >
                          Watch on YouTube
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-results">
              <h3>No Tutorials Available</h3>
              <p>No tutorials found for the selected filters. Please try different subject or class selection.</p>
            </div>
          )}
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default Tutorials;
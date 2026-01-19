import React, { useState, useEffect } from "react";
import { tutorials } from "../Data/tutorials";
import "../styles/tutorials.css";
import Footer from "../components/Footer.jsx";

const Tutorials = () => {
  const [level, setLevel] = useState("secondary"); 
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [videoErrors, setVideoErrors] = useState({});

  const filteredByLevel = tutorials.filter((tut) => tut.level === level);

  const allSubjects = ["all", ...new Set(filteredByLevel.map((tut) => tut.subject))];
  
  // Get available classes for current level
  const getAvailableClasses = () => {
    const classes = [...new Set(filteredByLevel.map(tut => tut.class))];
    return classes.sort((a, b) => {
      const aNum = parseInt(a.replace(/\D/g, ''));
      const bNum = parseInt(b.replace(/\D/g, ''));
      return aNum - bNum;
    });
  };

  const filtered =
    subjectFilter === "all"
      ? filteredByLevel
      : filteredByLevel.filter((tut) => tut.subject === subjectFilter);

  const finalFiltered = 
    classFilter === "all"
      ? filtered
      : filtered.filter((tut) => tut.class === classFilter);

  // Reset filters when level changes
  useEffect(() => {
    setSubjectFilter("all");
    setClassFilter("all");
  }, [level]);

  const availableClasses = getAvailableClasses();

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

  // Function to get YouTube thumbnail
  const getYouTubeThumbnail = (url) => {
    if (url.includes('youtube.com/embed/')) {
      const videoId = url.split('/embed/')[1];
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return null;
  };

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
        {finalFiltered.length > 0 ? (
          finalFiltered.map((tut) => (
            <div className="tutorial-card" key={tut.id}>
              <h3>{tut.title}</h3>
              <div className="tutorial-meta">
                <span className="tutorial-subject">{tut.subject}</span>
                <span className="tutorial-class">{tut.class}</span>
              </div>
              <p className="tutorial-description">{tut.description}</p>

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
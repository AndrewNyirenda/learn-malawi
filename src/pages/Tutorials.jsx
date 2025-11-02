import React, { useState } from "react";
import { tutorials } from "../Data/tutorials";
import "../styles/tutorials.css";

const Tutorials = () => {
  const [level, setLevel] = useState("secondary"); 
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [videoErrors, setVideoErrors] = useState({});

  const filteredByLevel = tutorials.filter((tut) => tut.level === level);

  const allSubjects = ["all", ...new Set(filteredByLevel.map((tut) => tut.subject))];

  const filtered =
    subjectFilter === "all"
      ? filteredByLevel
      : filteredByLevel.filter((tut) => tut.subject === subjectFilter);

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
    <div className="tutorials-wrapper">
      <h1 className="tutorials-title">Educational Tutorials</h1>

      <div className="level-tabs">
        <button
          className={level === "primary" ? "active" : ""}
          onClick={() => {
            setLevel("primary");
            setSubjectFilter("all");
          }}
        >
          Primary
        </button>
        <button
          className={level === "secondary" ? "active" : ""}
          onClick={() => {
            setLevel("secondary");
            setSubjectFilter("all");
          }}
        >
          Secondary
        </button>
      </div>

      <div className="tutorials-filter">
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="subject-select"
        >
          {allSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject === "all" ? "All Subjects" : subject}
            </option>
          ))}
        </select>
      </div>

      <div className="tutorials-grid">
        {filtered.length > 0 ? (
          filtered.map((tut) => (
            <div className="tutorial-card" key={tut.id}>
              <h3>{tut.title}</h3>
              <p className="tutorial-subject">{tut.subject} • {tut.level}</p>
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

              {tut.attachments && tut.attachments.length > 0 && (
                <div className="attachments">
                  <h4>Study Materials:</h4>
                  <ul>
                    {tut.attachments.map((file, idx) => (
                      <li key={idx}>
                        <a
                          href={file.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="attachment-link"
                        >
                          📎 {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-results">No tutorials available for this selection.</p>
        )}
      </div>
    </div>
  );
};

export default Tutorials;
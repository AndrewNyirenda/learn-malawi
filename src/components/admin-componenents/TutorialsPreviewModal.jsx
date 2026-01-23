// src/components/admin-componenents/TutorialsPreviewModal.jsx
import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaPlay,
  FaBook,
  FaGraduationCap,
  FaUserGraduate,
  FaCalendar,
  FaExternalLinkAlt,
  FaYoutube,
  FaVideo,
  FaEye,
  FaDownload,
  FaUser,
  FaArrowLeft,
  FaArrowRight,
  FaCopy,
  FaCheckCircle
} from 'react-icons/fa';
import '../../styles/Admin-Styles/TutorialsAdminModal.css';

const TutorialsPreviewModal = ({ tutorial, onClose }) => {
  const [videoError, setVideoError] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [copied, setCopied] = useState(false);
  const [embedUrl, setEmbedUrl] = useState(null);
  const [isYouTube, setIsYouTube] = useState(false);

  // Update embed URL when tutorial changes
  useEffect(() => {
    if (tutorial?.videoUrl) {
      const videoId = extractYouTubeId(tutorial.videoUrl);
      const youtubeDetected = !!videoId;
      
      setIsYouTube(youtubeDetected);
      
      if (youtubeDetected && videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`);
      } else {
        setEmbedUrl(null);
      }
    }
  }, [tutorial]);

  if (!tutorial) return null;

  // Improved YouTube video ID extraction
  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    // Handle various YouTube URL formats
    const patterns = [
      // youtu.be/vCJVXYmXkzM?si=...
      /youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?/,
      // youtube.com/watch?v=vCJVXYmXkzM
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      // youtube.com/embed/vCJVXYmXkzM
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      // youtube.com/v/vCJVXYmXkzM
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      // youtu.be/VIDEO_ID (no parameters)
      /youtu\.be\/([a-zA-Z0-9_-]{11})$/,
    ];
    
    console.log(`Extracting YouTube ID from: ${url}`);
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        console.log(`Found YouTube ID: ${match[1]} using pattern: ${pattern}`);
        return match[1];
      }
    }
    
    console.log(`No YouTube ID found in URL: ${url}`);
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tutorial.videoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link to clipboard');
    }
  };

  const renderVideoSection = () => {
    if (isYouTube && embedUrl) {
      return (
        <div className="video-embed">
          <iframe
            src={embedUrl}
            title={tutorial.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={() => {
              console.error(`Failed to load YouTube embed: ${embedUrl}`);
              setVideoError(true);
            }}
            onLoad={() => {
              console.log(`YouTube embed loaded successfully: ${embedUrl}`);
              setVideoError(false);
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="video-preview">
          <div className="video-preview-placeholder">
            <FaVideo style={{ fontSize: '3rem', color: '#4a90e2', marginBottom: '10px' }} />
            <p>Direct Video Link</p>
            <p className="video-url-preview">
              <small>{tutorial.videoUrl}</small>
            </p>
            <a 
              href={tutorial.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="preview-video-link"
              style={{ marginTop: '15px' }}
            >
              <FaExternalLinkAlt /> Open Video in New Tab
            </a>
          </div>
        </div>
      );
    }
  };



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaPlay /> Tutorial Preview: {tutorial.title}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="tutorial-preview-container">

          {/* Tutorial Tabs */}
          <div className="preview-tabs">
            <button 
              className={`preview-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              <FaEye /> Preview
            </button>
            <button 
              className={`preview-tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <FaBook /> Details
            </button>
            <button 
              className={`preview-tab ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <FaDownload /> Statistics
            </button>
          </div>

          {activeTab === 'preview' && (
            <div className="preview-content">
              {/* Tutorial Info Header */}
              <div className="preview-header">
                <div>
                  <h4 className="preview-tutorial-title">{tutorial.title}</h4>
                  <div className="preview-meta">
                    <span className="preview-meta-item level">
                      {tutorial.level === 'primary' ? <FaGraduationCap /> : <FaUserGraduate />}
                      {tutorial.level === 'primary' ? 'Primary' : 'Secondary'} - {tutorial.class}
                    </span>
                    <span className="preview-meta-item subject">
                      <FaBook /> {tutorial.subject}
                    </span>
                    <span className="preview-meta-item date">
                      <FaCalendar /> Added: {formatDate(tutorial.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Player Section */}
              <div className="video-section">
                <h5>
                  Video Content 
                  <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: isYouTube ? '#36b37e' : '#ffab00' }}>
                    ({isYouTube ? 'YouTube Video' : 'Direct Link'})
                  </span>
                </h5>
                {renderVideoSection()}
                
                {videoError && (
                  <div className="video-error">
                    <p>Could not load video. Please check the video URL.</p>
                    <p><small>URL: {tutorial.videoUrl}</small></p>
                  </div>
                )}
                
                <div className="video-actions">
                  <a 
                    href={tutorial.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="preview-video-link"
                  >
                    {isYouTube ? <FaYoutube /> : <FaExternalLinkAlt />}
                    {isYouTube ? ' Watch on YouTube' : ' Open Video Link'}
                  </a>
                  <button 
                    className="copy-link-btn" 
                    onClick={handleCopyLink}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {copied ? <FaCheckCircle /> : <FaCopy />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>

              {/* Description Section */}
              <div className="description-section">
                <h5>Description</h5>
                <div className="description-content">
                  {tutorial.description || 'No description available.'}
                </div>
              </div>

              {/* Author Info */}
              {tutorial.uploadedBy && (
                <div className="author-section">
                  <h5>Uploaded By</h5>
                  <div className="author-info">
                    <div className="author-avatar">
                      <FaUser />
                    </div>
                    <div className="author-details">
                      <div className="author-name">
                        {tutorial.uploadedBy.firstName} {tutorial.uploadedBy.lastName}
                      </div>
                      <div className="author-email">
                        {tutorial.uploadedBy.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="details-content">
              <div className="detail-grid">
                <div className="detail-row">
                  <span className="detail-label">Title:</span>
                  <span className="detail-value">{tutorial.title}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Subject:</span>
                  <span className="detail-value">{tutorial.subject}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Level:</span>
                  <span className="detail-value">
                    {tutorial.level === 'primary' ? 'Primary' : 'Secondary'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Class/Form:</span>
                  <span className="detail-value">{tutorial.class}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Video URL:</span>
                  <span className="detail-value">
                    <a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                      {tutorial.videoUrl}
                    </a>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">URL Type:</span>
                  <span className="detail-value">
                    <span className={`url-type-badge ${isYouTube ? 'youtube' : 'direct'}`}>
                      {isYouTube ? 'YouTube' : 'Direct Link'}
                    </span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">{formatDate(tutorial.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{formatDate(tutorial.updatedAt)}</span>
                </div>
                {tutorial.viewCount !== undefined && (
                  <div className="detail-row">
                    <span className="detail-label">Views:</span>
                    <span className="detail-value">{tutorial.viewCount || 0}</span>
                  </div>
                )}
              </div>
              
              {/* URL Analysis */}
              <div className="url-analysis" style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                <h6>URL Analysis</h6>
                <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
                  <li>YouTube Detected: {isYouTube ? '✅ Yes' : '❌ No'}</li>
                  <li>Video ID: {extractYouTubeId(tutorial.videoUrl) || 'Not found'}</li>
                  <li>Valid Embed URL: {embedUrl ? '✅ Yes' : '❌ No'}</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-content">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon views">
                    <FaEye />
                  </div>
                  <div className="stat-content">
                    <h3>{tutorial.viewCount || 0}</h3>
                    <p>Total Views</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon uploads">
                    <FaDownload />
                  </div>
                  <div className="stat-content">
                    <h3>{tutorial.downloadCount || 0}</h3>
                    <p>Downloads</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon completion">
                    <FaPlay />
                  </div>
                  <div className="stat-content">
                    <h3>{tutorial.completionRate || 'N/A'}</h3>
                    <p>Completion Rate</p>
                  </div>
                </div>
              </div>
              
              <div className="analytics-section">
                <h5>Analytics Overview</h5>
                <div className="analytics-info">
                  <p>
                    This tutorial has been viewed <strong>{tutorial.viewCount || 0} times</strong> 
                    and is part of the {tutorial.level} level curriculum.
                  </p>
                  <p>
                    It's designed for {tutorial.class} students studying {tutorial.subject}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="preview-footer">
            <button className="btn-secondary" onClick={onClose}>
              <FaArrowLeft /> Back to List
            </button>
            <div className="preview-actions">
              <a 
                href={tutorial.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <FaPlay /> Watch Tutorial
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialsPreviewModal;
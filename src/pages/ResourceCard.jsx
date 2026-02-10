import React, { useState, useEffect } from "react";
import { FaBookmark, FaRegBookmark, FaEye, FaDownload } from "react-icons/fa";
import "../styles/resource-card.css";

const ResourceCard = ({ 
  id,
  title, 
  thumbnail, 
  downloadLink, 
  downloadName, 
  onView, 
  onDownload,
  category, 
  class: resourceClass,
  year
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(prev => !prev);
    
    const bookmarks = JSON.parse(localStorage.getItem('studyBookmarks') || '[]');
    if (!isBookmarked) {
      const bookmark = {
        id,
        title,
        category,
        class: resourceClass,
        date: new Date().toISOString()
      };
      const newBookmarks = [...bookmarks, bookmark];
      localStorage.setItem('studyBookmarks', JSON.stringify(newBookmarks));
    } else {
      const newBookmarks = bookmarks.filter(b => b.id !== id);
      localStorage.setItem('studyBookmarks', JSON.stringify(newBookmarks));
    }
  };

  const handleView = (e) => {
    e.preventDefault();
    if (onView) onView();
  };

  const handleDownload = (e) => {
    e.preventDefault();
    if (onDownload) onDownload();
  };

  const handleImageError = (e) => {
    e.target.src = "/images/pdf.png";
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('studyBookmarks') || '[]');
    const isAlreadyBookmarked = bookmarks.some(b => b.id === id);
    setIsBookmarked(isAlreadyBookmarked);
  }, [id]);

  return (
    <div className="resource-card">
      {/* Card Header with Bookmark Button */}
      <div className="card-header">
        <button
          onClick={toggleBookmark}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '14px',
            color: isBookmarked ? '#2f5fa8' : '#94a3b8'
          }}
          title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      {/* Thumbnail */}
      <div className="thumbnail-container">
        <div className="book-cover">
          <div className={`cover-inner ${imageLoaded ? 'loaded' : ''}`}>
            <img
              src={thumbnail || "/images/pdf.png"}
              alt={title}
              className="thumbnail"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            <div className="cover-gloss"></div>
          </div>
          <div className="book-spine"></div>
          <div className="book-shadow"></div>
        </div>
        {!imageLoaded && <div className="image-placeholder"></div>}
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="resource-title">{title}</h3>
        
        <div className="resource-tags">
          {category && <span className="badge category-badge">{category}</span>}
          {resourceClass && <span className="badge class-badge">{resourceClass}</span>}
          {year && <span className="badge year-badge">{year}</span>}
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        {onView && (
          <button 
            className="action-btn view-btn"
            onClick={handleView}
          >
            <FaEye className="btn-icon" />
            <span>Preview</span>
          </button>
        )}
        
        {onDownload && (
          <button 
            className="action-btn download-btn"
            onClick={handleDownload}
          >
            <FaDownload className="btn-icon" />
            <span>Download</span>
          </button>
        )}
        
        {!onView && !onDownload && downloadLink && (
          <a
            href={downloadLink}
            download={downloadName}
            className="action-btn download-btn"
          >
            <FaDownload className="btn-icon" />
            <span>Download</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
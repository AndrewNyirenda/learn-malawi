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
    
    // Save to localStorage
    const bookmarks = JSON.parse(localStorage.getItem('studyBookmarks') || '[]');
    if (!isBookmarked) {
      // Add to bookmarks
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
      // Remove from bookmarks
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

  // Check if already bookmarked on mount
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('studyBookmarks') || '[]');
    const isAlreadyBookmarked = bookmarks.some(b => b.id === id);
    setIsBookmarked(isAlreadyBookmarked);
  }, [id]);

  return (
    <div className="resource-card">
      {/* Card Header with only Bookmark Button */}
      <div className="card-header">
        <div className="header-badges">
          {/* Tags moved to content area below */}
        </div>
        
     
      </div>

      {/* Enhanced Thumbnail with Book Cover Effect */}
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
            
            
            
            <span>Download PDF</span>
          </button>
        )}
        
        {!onView && !onDownload && downloadLink && (
          <a
            href={downloadLink}
            download={downloadName}
            className="action-btn download-btn"
          >

            <span>Download PDF</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
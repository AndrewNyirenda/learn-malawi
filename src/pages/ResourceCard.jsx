import React, { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

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
  };

  // Check if already bookmarked on mount
  React.useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('studyBookmarks') || '[]');
    const isAlreadyBookmarked = bookmarks.some(b => b.id === id);
    setIsBookmarked(isAlreadyBookmarked);
  }, [id]);

  return (
    <div className="resource-card">
      {/* Card Header with Category, Class, and Bookmark */}
      <div className="card-header">
        <div className="header-left">
          {category && <span className="resource-category">{category}</span>}
          {resourceClass && <span className="resource-class">{resourceClass}</span>}
        </div>
        <button 
          className="bookmark-btn" 
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked ? (
            <FaBookmark className="bookmark-icon filled" />
          ) : (
            <FaRegBookmark className="bookmark-icon" />
          )}
        </button>
      </div>

      {/* Thumbnail */}
      <div className="thumbnail-container">
        <img
          src={thumbnail || "/images/pdf.png"}
          alt={title}
          className="thumbnail"
          onError={handleImageError}
        />
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="resource-title">{title}</h3>
        
        {/* Year Information */}
        {year && (
          <div className="year-info">
            <span className="year-label">Year:</span>
            <span className="year-value">{year}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="card-footer">
        {onView && (
          <button 
            className="action-btn view-btn"
            onClick={handleView}
          >
            View PDF
          </button>
        )}
        
        {onDownload && (
          <button 
            className="action-btn download-btn"
            onClick={handleDownload}
          >
            Download
          </button>
        )}
        
        {!onView && !onDownload && downloadLink && (
          <a
            href={downloadLink}
            download={downloadName}
            className="action-btn download-btn"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
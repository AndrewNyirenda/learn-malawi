import React, { useState } from "react";
import { FaEye, FaDownload } from "react-icons/fa";
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
  const [imageLoaded, setImageLoaded] = useState(false);

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

  return (
    <div className="resource-card">
      {/* Thumbnail */}
      <div className="thumbnail-container">
        <div className="book-cover">
          <div className={`cover-inner ${imageLoaded ? 'loaded' : ''}`}>
            <img
              src={thumbnail || "/images/pdf3.png"}
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
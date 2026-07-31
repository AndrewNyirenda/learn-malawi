import React from "react";
import { FaEye, FaDownload, FaFilePdf, FaFileAlt, FaBookOpen } from "react-icons/fa";
import "../styles/global.css";
import "../styles/resource-card.css";
import bookPng from "../images/book.png"; 

const ResourceCard = ({ 
  id,
  title, 
  downloadLink, 
  downloadName, 
  onView, 
  onDownload,
  category, 
  class: resourceClass,
  year,
  subject,
  type = "PDF",
  customImage = null
}) => {
  const handleView = (e) => {
    e.preventDefault();
    if (onView) onView();
  };

  const handleDownload = (e) => {
    e.preventDefault();
    if (onDownload) onDownload();
  };

  // Determine which image to show
  const getImageSrc = () => {
    if (customImage) return customImage;
    if (type?.toLowerCase() === 'book') return bookPng;
    return null;
  };

  const imageSrc = getImageSrc();

  // Truncate title if too long
  const truncateTitle = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="resource-card">
      <div className="card-inner">
        {/* Top Accent Bar */}
        <div className="card-accent"></div>
        
        {/* Resource Image Section - Shows for book type or when custom image provided */}
        {imageSrc && (
          <div className="card-image-container">
            <img 
              src={imageSrc} 
              alt={title || 'Resource cover'}
              className="resource-image"
            />
          </div>
        )}
        
        {/* Card Header with Title */}
        <div className="card-header">
          <div className="title-container">
            {!imageSrc && (
              <span className="resource-icon">
                {type?.toLowerCase() === 'pdf' ? <FaFilePdf /> : <FaFileAlt />}
              </span>
            )}
            <h3 className="resource-title">{truncateTitle(title)}</h3>
          </div>
        </div>

        {/* Tags Section - Professional Tagged Look */}
        <div className="card-tags">
          {category && (
            <div className="tag-wrapper">
              <span className="tag tag-category">
                <span className="tag-label">Category</span>
                <span className="tag-value">{category}</span>
              </span>
            </div>
          )}
          
          {resourceClass && (
            <div className="tag-wrapper">
              <span className="tag tag-class">
                <span className="tag-label">Class</span>
                <span className="tag-value">{resourceClass}</span>
              </span>
            </div>
          )}
          
          {year && (
            <div className="tag-wrapper">
              <span className="tag tag-year">
                <span className="tag-label">Year</span>
                <span className="tag-value">{year}</span>
              </span>
            </div>
          )}
        </div>

        {/* Decorative Divider */}
        <div className="card-divider">
          <span className="divider-line"></span>
          <span className="divider-diamond">◆</span>
          <span className="divider-line"></span>
        </div>

        {/* Action Buttons */}
        <div className="card-actions">
          {onView && (
            <button 
              className="action-btn view-btn"
              onClick={handleView}
              aria-label="Preview resource"
            >
              <FaEye className="btn-icon" />
              <span>Read</span>
            </button>
          )}
          
          {onDownload && (
            <button 
              className="action-btn download-btn"
              onClick={handleDownload}
              aria-label="Download resource"
            >
              <FaDownload className="btn-icon" />
              <span>Download</span>
            </button>
          )}
          
          {!onView && !onDownload && downloadLink && (
            <a
              href={downloadLink}
              download={downloadName}
              className="action-btn download-btn full-width"
              aria-label="Download resource"
            >
              <FaDownload className="btn-icon" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
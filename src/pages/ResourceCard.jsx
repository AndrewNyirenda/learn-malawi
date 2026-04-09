import React from "react";
import { FaEye, FaDownload, FaFilePdf, FaFileAlt, FaBookOpen } from "react-icons/fa";
import "../styles/resource-card.css";

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
  type = "PDF"
}) => {
  const handleView = (e) => {
    e.preventDefault();
    if (onView) onView();
  };

  const handleDownload = (e) => {
    e.preventDefault();
    if (onDownload) onDownload();
  };

  // Get icon based on resource type
  const getResourceIcon = () => {
    switch(type?.toLowerCase()) {
      case 'pdf':
        return <FaFilePdf />;
      case 'document':
        return <FaFileAlt />;
      case 'book':
        return <FaBookOpen />;
      default:
        return <FaFilePdf />;
    }
  };

  // Truncate title if too long
  const truncateTitle = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="resource-card">
      {/* Professional Blue & Gold Card Design */}
      <div className="card-inner">
        {/* Top Accent Bar */}
        <div className="card-accent"></div>
        
        {/* Card Header with Title */}
        <div className="card-header">
          <div className="title-container">
            <span className="resource-icon">{getResourceIcon()}</span>
            <h3 className="resource-title">{truncateTitle(title)}</h3>
          </div>
        </div>

        {/* Resource Type Badge */}
        <div className="resource-type-badge">
          <span>{type}</span>
        </div>

        {/* Metadata Section */}
        <div className="card-metadata">
          {category && (
            <div className="metadata-item">
              <span className="metadata-label">Category</span>
              <span className="metadata-value">{category}</span>
            </div>
          )}
          
          {resourceClass && (
            <div className="metadata-item">
              <span className="metadata-label">Class</span>
              <span className="metadata-value">{resourceClass}</span>
            </div>
          )}
          
          {subject && (
            <div className="metadata-item">
              <span className="metadata-label">Subject</span>
              <span className="metadata-value">{subject}</span>
            </div>
          )}
          
          {year && (
            <div className="metadata-item">
              <span className="metadata-label">Year</span>
              <span className="metadata-value">{year}</span>
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
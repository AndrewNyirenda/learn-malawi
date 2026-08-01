// pages/ResourceCard.jsx
import React from "react";
import { FaEye, FaDownload, FaFilePdf, FaFileAlt, FaSearch } from "react-icons/fa";
import "../styles/resource-card.css";
import bookPng from "../images/book.png";

const ResourceCard = ({
  title,
  thumbnail,
  downloadLink,
  downloadName,
  onView,
  onDownload,
  category,
  class: resourceClass,
  year,
  type = "PDF",
  customImage = null,
  free = true
}) => {
  const handleView = (e) => {
    e.preventDefault();
    if (onView) onView();
  };

  const handleDownload = (e) => {
    e.preventDefault();
    if (onDownload) onDownload();
  };

  const getImageSrc = () => {
    if (thumbnail) return thumbnail;
    if (customImage) return customImage;
    if (type?.toLowerCase() === "book") return bookPng;
    return null;
  };

  const imageSrc = getImageSrc();

  const truncateTitle = (text, maxLength = 60) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "…";
  };

  const metaItems = [category, resourceClass, year].filter(Boolean);

  return (
    <div className="resource-card">
      <div className="card-accent" />

      <div className="card-image-container">
        
        {imageSrc ? (
          <img src={imageSrc} alt={title || "Resource cover"} className="resource-image" />
        ) : (
          <span className="resource-icon" style={{ fontSize: "2.5rem" }}>
            {type?.toLowerCase() === "pdf" ? <FaFilePdf /> : <FaFileAlt />}
          </span>
        )}
        <div className="card-quick-view" aria-hidden="true">
          <FaSearch style={{ color: "#fff", fontSize: "1.1rem" }} />
        </div>
      </div>

      <div className="card-body">
        <div className="title-container">
          <h3 className="resource-title">{truncateTitle(title)}</h3>
        </div>

        {metaItems.length > 0 && (
          <div className="card-meta">
            {category && <span className="meta-item meta-category">{category}</span>}
            {resourceClass && (
              <>
                {category && <span className="meta-sep">·</span>}
                <span className="meta-item">{resourceClass}</span>
              </>
            )}
            {year && (
              <>
                {(category || resourceClass) && <span className="meta-sep">·</span>}
                <span className="meta-item">{year}</span>
              </>
            )}
          </div>
        )}

        <div className="card-actions">
          {onView && (
            <button className="action-btn view-btn" onClick={handleView} aria-label="Preview resource">
              <FaEye className="btn-icon" />
              <span>Read</span>
            </button>
          )}

          {onDownload && (
            <button className="action-btn download-btn" onClick={handleDownload} aria-label="Download resource">
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
// pages/ResourceCard.jsx
import React from "react";
import { FaFilePdf, FaFileAlt } from "react-icons/fa";
import "../styles/resource-card.css";
import bookPng from "../images/book.png";

const ResourceCard = ({
  title,
  thumbnail,
  category,
  class: resourceClass,
  year,
  type = "PDF",
  customImage = null,
  onClick, // 👈 new prop
}) => {
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
    <div 
      className="resource-card clickable" 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="card-accent" />

      <div className="card-image-container">
        {imageSrc ? (
          <img src={imageSrc} alt={title || "Resource cover"} className="resource-image" />
        ) : (
          <span className="resource-icon" style={{ fontSize: "2.5rem" }}>
            {type?.toLowerCase() === "pdf" ? <FaFilePdf /> : <FaFileAlt />}
          </span>
        )}
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
      </div>
    </div>
  );
};

export default ResourceCard;
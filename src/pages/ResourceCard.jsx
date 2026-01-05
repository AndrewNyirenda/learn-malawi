import React, { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const ResourceCard = ({ title, thumbnail, downloadLink, downloadName, onView, category, class: resourceClass, year }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => setIsBookmarked(prev => !prev);

  return (
    <div className="resource-card">
      


      {/* Thumbnail */}
      <img
        src={thumbnail || "https://via.placeholder.com/200x140?text=Book"}
        alt={title}
      />

      {/* Title */}
      <h3>{title}</h3>

      {/* Resource Meta Information */}
      <div className="resource-meta">
        {category && <span className="resource-category">{category}</span>}
        {resourceClass && <span className="resource-class">{resourceClass}</span>}
        {year && <span className="resource-year">{year}</span>}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <a
          href={downloadLink}
          download={downloadName}
        >
          Download
        </a>

        {onView && (
          <button onClick={onView}>
            View
          </button>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
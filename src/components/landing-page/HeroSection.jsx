// components/landing-page/HeroSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSlideshow from "../Heroslideshow.jsx";
import "../../styles/landing-page/hero-section.css";

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-eyebrow">A Free Learning Resources Initiative</span>
          <h1 className="hero-title">Learn Smart</h1>
          <p className="hero-subtitle">Free Educational Resources</p>

          <p className="hero-description">
            Digital learning resources designed to support every Malawian
            student, from secondary school to tertiary education.
          </p>

          {/* Search bar replaces the old button */}
          <form className="hero-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search for resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button type="submit" className="hero-search-btn">
              Search
            </button>
          </form>
        </div>

        <div className="hero-slideshow-container">
          <div className="hero-media">
            <HeroSlideshow />
          </div>
          <p className="hero-caption">Students and learners across Malawi</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
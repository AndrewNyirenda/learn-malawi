// components/landing-page/HeroSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import HeroSlideshow from "../Heroslideshow.jsx";
import "../../styles/landing-page/hero-section.css";

const HeroSection = () => {
  const navigate = useNavigate();

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

          <button className="hero-button" onClick={() => navigate("/study-notes")}>
            Explore Resources
          </button>
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
import React from "react";
import { useNavigate } from "react-router-dom";
import Heroslideshow from "../Heroslideshow";
import "../../styles/landing-page/hero-section.css";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-container">

        <div className="hero-text">
          <h1 className="hero-title">Learn Malawi</h1>
          <p className="hero-subtitle">
            Free Educational Resources
          </p>

          <p className="hero-description">
            Digital learning resources designed to support
            every Malawian student, from secondary school
            to tertiary education.
          </p>

          <button
            className="hero-button"
            onClick={() => navigate("/study-notes")}
          >
            Explore Resources
          </button>
        </div>

        <div className="hero-media">
          <Heroslideshow />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
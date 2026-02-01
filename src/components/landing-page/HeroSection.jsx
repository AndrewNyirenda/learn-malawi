import React from 'react';
import { useNavigate } from "react-router-dom";
import Heroslideshow from "../Heroslideshow";
import "../../styles/landing-page/hero-section.css";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-title-section">
          <div className="hero-main-title">
            <h1>Learn Malawi</h1>
            <p className="mission-statement">
              Free Educational Resources
            </p>
          </div>
        </div>
        
        <div className="hero-image-container">
          <Heroslideshow />
        </div>
        
        <div className="hero-content-section">
          <div className="hero-description">
            <p>
              Digital learning resources 
              for every Malawian student.
            </p>
          </div>
          
          <div className="hero-cta">
            <button 
              className="cta-button"
              onClick={() => navigate("/study-notes")}
            >
              Explore Resources
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
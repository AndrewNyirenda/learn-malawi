// pages/CareerResources.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaExternalLinkAlt,
  FaBullseye,
  FaFileAlt,
  FaComments,
  FaUsers,
  FaClock,
  FaCompass,
  FaRocket,
  FaLink,
  FaGraduationCap,
  FaBriefcase,
  FaUserTie,
  FaLightbulb,
  FaChartLine,
  FaHandshake,
  FaHome,
  FaChevronRight,
} from 'react-icons/fa';
import { useCareerResources } from '../contexts/CareerResourcesContext';
import '../styles/careerResources.css';
import Footer from '../components/Footer';
import Header from '../components/Header';

// Import images from figures folder
import OprahImage from '../images/figures/oprah.webp';
import ElonImage from '../images/figures/elon.jpg';
import MalalaImage from '../images/figures/Malala.webp';
import SteveImage from '../images/figures/steve.jpg';

// ─── Masthead (matches PastPapers / Tutorials) ──────────────────
const Masthead = () => (
  <div className="career-resources-page-masthead">
    <div className="career-resources-masthead-inner">
      <nav className="career-resources-breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><FaHome /> Home</Link>
        <FaChevronRight />
        <span className="career-resources-breadcrumb-current">Career Resources</span>
      </nav>

      <div className="career-resources-masthead-eyebrow">
        <span className="career-resources-masthead-eyebrow-icon">
          <FaCompass />
        </span>
        Career Development
      </div>

      <h1 className="career-resources-masthead-title">
        Career <span className="career-resources-masthead-title-accent">Guidance</span> Resources
      </h1>

      <p className="career-resources-masthead-desc">
        Comprehensive career development resources designed to help Malawian students explore opportunities, develop skills, and plan successful career pathways aligned with national development goals.
      </p>

      <div className="career-resources-masthead-meta">
        <span className="career-resources-masthead-meta-item">Career Planning</span>
        <span className="career-resources-masthead-meta-item">Free Access</span>
        <span className="career-resources-masthead-meta-item">Updated Regularly</span>
      </div>
    </div>
  </div>
);

// ─── Main component ────────────────────────────────────────────────
const CareerResources = () => {
  const {
    careerResources,
    loading,
    error,
    fetchCareerResources,
    clearError,
  } = useCareerResources();

  // ── Carousel state ──
  const [figureIndex, setFigureIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const autoPlayRef = useRef(null);
  const figures = [
    {
      id: 'oprah',
      name: 'Oprah Winfrey',
      description: 'From a troubled childhood to becoming a media mogul and philanthropist, Oprah\'s journey demonstrates the power of resilience and self-belief.',
      tag: 'Media & Philanthropy',
      image: OprahImage,
      icon: FaUserTie,
    },
    {
      id: 'elon',
      name: 'Elon Musk',
      description: 'Founder of Tesla and SpaceX, Elon Musk continues to push technological boundaries through relentless innovation and perseverance.',
      tag: 'Technology & Innovation',
      image: ElonImage,
      icon: FaLightbulb,
    },
    {
      id: 'malala',
      name: 'Malala Yousafzai',
      description: 'Nobel Peace Prize winner and advocate for girls\' education, Malala\'s courage and determination have inspired millions worldwide.',
      tag: 'Education & Activism',
      image: MalalaImage,
      icon: FaGraduationCap,
    },
    {
      id: 'steve',
      name: 'Steve Jobs',
      description: 'Co-founder of Apple Inc., Steve Jobs revolutionized personal technology through his commitment to innovation and excellence.',
      tag: 'Technology & Design',
      image: SteveImage,
      icon: FaChartLine,
    },
  ];

  // ── Detect mobile ──
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Auto‑play carousel ──
  useEffect(() => {
    if (isMobile) {
      autoPlayRef.current = setInterval(() => {
        setFigureIndex((prev) => (prev + 1) % figures.length);
      }, 5000);
    } else {
      clearInterval(autoPlayRef.current);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isMobile, figures.length]);

  // ── Reset index when switching to desktop ──
  useEffect(() => {
    if (!isMobile) {
      setFigureIndex(0);
    }
  }, [isMobile]);

  // ── Pause on hover ──
  const handleMouseEnter = () => {
    if (isMobile) {
      clearInterval(autoPlayRef.current);
    }
  };
  const handleMouseLeave = () => {
    if (isMobile) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setFigureIndex((prev) => (prev + 1) % figures.length);
      }, 5000);
    }
  };

  // ── Scroll to top ──
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ── Fetch resources ──
  useEffect(() => {
    const loadResources = async () => {
      await fetchCareerResources();
    };
    loadResources();
  }, []);

  const getIcon = (iconName) => {
    const iconMap = {
      'FaBullseye': FaBullseye,
      'FaFileAlt': FaFileAlt,
      'FaComments': FaComments,
      'FaUsers': FaUsers,
      'FaClock': FaClock,
      'FaCompass': FaCompass,
      'FaRocket': FaRocket,
      'FaGraduationCap': FaGraduationCap,
      'FaBriefcase': FaBriefcase,
      'FaUserTie': FaUserTie,
      'FaLightbulb': FaLightbulb,
      'FaChartLine': FaChartLine,
      'FaHandshake': FaHandshake,
      'default': FaLink,
    };
    const IconComponent = iconMap[iconName] || iconMap.default;
    return <IconComponent />;
  };

  if (loading && careerResources.length === 0) {
    return (
      <>
        <Header />
        <div className="career-resources-container">
          <Masthead />
          <div className="career-resources-loading-container">
            <div className="career-resources-loading-spinner"></div>
            <p>Loading career resources...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error && careerResources.length === 0) {
    return (
      <>
        <Header />
        <div className="career-resources-container">
          <Masthead />
          <div className="career-resources-error-container">
            <h3>Error Loading Resources</h3>
            <p>{error}</p>
            <button
              onClick={() => { clearError(); fetchCareerResources(); }}
              className="career-resources-retry-btn"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="career-resources-container">
        <Masthead />

        {/* ===== RESOURCES GRID ===== */}
        <section className="career-resources-resources-section">
          <div className="career-resources-resources-grid">
            {careerResources.length > 0 ? (
              careerResources.map((resource) => (
                <div key={resource.id} className="career-resources-resource-card">
                  <div className="career-resources-resource-icon">
                    {getIcon(resource.icon)}
                  </div>
                  <h3 className="career-resources-resource-title">{resource.title}</h3>
                  <p className="career-resources-resource-description">{resource.description}</p>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="career-resources-resource-link"
                  >
                    <FaExternalLinkAlt className="career-resources-link-icon" />
                    Access Resource
                  </a>
                </div>
              ))
            ) : (
              <div className="career-resources-no-resources">
                <div className="career-resources-no-resources-icon">
                  <FaFileAlt />
                </div>
                <h3>No career resources available yet</h3>
                <p>Check back soon for career guidance materials</p>
              </div>
            )}
          </div>
        </section>

        {/* ===== MOTIVATIONAL FIGURES ===== */}
        <section className="career-resources-motivation-section">
          <div className="career-resources-section-header">
            <h2>Inspirational Figures</h2>
            <div className="career-resources-section-divider"></div>
            <p className="career-resources-section-subtitle">Global leaders who exemplify perseverance and achievement</p>
          </div>

          <div className="career-resources-figures-wrapper">
            {isMobile ? (
              <div
                className="career-resources-figures-carousel"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="career-resources-figures-track"
                  style={{ transform: `translateX(-${figureIndex * 100}%)` }}
                >
                  {figures.map((figure) => (
                    <div key={figure.id} className="career-resources-figure-card">
                      <div className="career-resources-figure-image-container">
                        <img
                          src={figure.image}
                          alt={figure.name}
                          className="career-resources-figure-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML =
                              `<div className="career-resources-figure-icon"><${figure.icon.name} /></div>`;
                          }}
                        />
                      </div>
                      <h3 className="career-resources-figure-title">{figure.name}</h3>
                      <p className="career-resources-figure-description">{figure.description}</p>
                      <div className="career-resources-figure-tag">{figure.tag}</div>
                    </div>
                  ))}
                </div>
                <div className="career-resources-carousel-dots">
                  {figures.map((_, idx) => (
                    <button
                      key={idx}
                      className={`career-resources-dot ${idx === figureIndex ? 'active' : ''}`}
                      onClick={() => setFigureIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="career-resources-figures-grid">
                {figures.map((figure) => (
                  <div key={figure.id} className="career-resources-figure-card">
                    <div className="career-resources-figure-image-container">
                      <img
                        src={figure.image}
                        alt={figure.name}
                        className="career-resources-figure-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML =
                            `<div className="career-resources-figure-icon"><${figure.icon.name} /></div>`;
                        }}
                      />
                    </div>
                    <h3 className="career-resources-figure-title">{figure.name}</h3>
                    <p className="career-resources-figure-description">{figure.description}</p>
                    <div className="career-resources-figure-tag">{figure.tag}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===== CAREER PLANNING TIPS ===== */}
        <section className="career-resources-tips-section">
          <div className="career-resources-section-header">
            <h2>Career Planning Strategies</h2>
            <div className="career-resources-section-divider"></div>
            <p className="career-resources-section-subtitle">Practical steps for career development</p>
          </div>

          <div className="career-resources-tips-container">
            <div className="career-resources-tip-card">
              <div className="career-resources-tip-number">01</div>
              <h3 className="career-resources-tip-title">Self-Assessment</h3>
              <p className="career-resources-tip-description">Identify your strengths, interests, values, and skills to align with suitable career paths.</p>
            </div>
            <div className="career-resources-tip-card">
              <div className="career-resources-tip-number">02</div>
              <h3 className="career-resources-tip-title">Research Careers</h3>
              <p className="career-resources-tip-description">Explore different professions, job requirements, and growth opportunities in various sectors.</p>
            </div>
            <div className="career-resources-tip-card">
              <div className="career-resources-tip-number">03</div>
              <h3 className="career-resources-tip-title">Skill Development</h3>
              <p className="career-resources-tip-description">Acquire relevant skills through education, training, and practical experience.</p>
            </div>
            <div className="career-resources-tip-card">
              <div className="career-resources-tip-number">04</div>
              <h3 className="career-resources-tip-title">Networking</h3>
              <p className="career-resources-tip-description">Build professional connections through mentors, internships, and industry events.</p>
            </div>
          </div>
        </section>

        

      </div>

      <Footer />
    </>
  );
};

export default CareerResources;
import React, { useEffect } from 'react';
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
  <div className="page-masthead">
    <div className="masthead-inner">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><FaHome /> Home</Link>
        <FaChevronRight />
        <span className="breadcrumb-current">Career Resources</span>
      </nav>

      <div className="masthead-eyebrow">
        <span className="masthead-eyebrow-icon">
          <FaCompass />
        </span>
        Career Development
      </div>

      <h1 className="masthead-title">
        Career <span className="masthead-title-accent">Guidance</span> Resources
      </h1>

      <p className="masthead-desc">
        Comprehensive career development resources designed to help Malawian students explore opportunities, develop skills, and plan successful career pathways aligned with national development goals.
      </p>

      <div className="masthead-meta">
        <span className="masthead-meta-item">Career Planning</span>
        <span className="masthead-meta-dot" />
        <span className="masthead-meta-item">Free Access</span>
        <span className="masthead-meta-dot" />
        <span className="masthead-meta-item">Updated Regularly</span>
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Fetch resources on mount
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
        <div className="cr-wrapper">
          <Masthead />
          <div className="cr-loading-container">
            <div className="cr-loading-spinner"></div>
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
        <div className="cr-wrapper">
          <Masthead />
          <div className="cr-error-container">
            <h3>Error Loading Resources</h3>
            <p>{error}</p>
            <button 
              onClick={() => { clearError(); fetchCareerResources(); }} 
              className="cr-retry-btn"
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
      <div className="cr-wrapper">
        <Masthead />

        {/* ===== RESOURCES GRID ===== */}
        <section className="cr-resources-section">
          <div className="cr-resources-grid">
            {careerResources.length > 0 ? (
              careerResources.map((resource) => (
                <div key={resource.id} className="cr-resource-card">
                  <div className="cr-resource-icon">
                    {getIcon(resource.icon)}
                  </div>
                  
                  <h3 className="cr-resource-title">{resource.title}</h3>
                  
                  <p className="cr-resource-description">{resource.description}</p>
                  
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cr-resource-link"
                  >
                    <FaExternalLinkAlt className="cr-link-icon" />
                    Access Resource
                  </a>
                </div>
              ))
            ) : (
              <div className="cr-no-resources">
                <div className="cr-no-resources-icon">
                  <FaFileAlt />
                </div>
                <h3>No career resources available yet</h3>
                <p>Check back soon for career guidance materials</p>
              </div>
            )}
          </div>
        </section>

        {/* ===== MOTIVATIONAL FIGURES ===== */}
        <section className="cr-motivation-section">
          <div className="cr-section-header">
            <h2>Inspirational Figures</h2>
            <div className="cr-section-divider"></div>
            <p className="cr-section-subtitle">Global leaders who exemplify perseverance and achievement</p>
          </div>

          <div className="cr-figures-grid">
            {/* Oprah Winfrey */}
            <div className="cr-figure-card">
              <div className="cr-figure-image-container">
                <img 
                  src={OprahImage} 
                  alt="Oprah Winfrey" 
                  className="cr-figure-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div className="cr-figure-icon"><FaUserTie /></div>';
                  }}
                />
              </div>
              <h3 className="cr-figure-title">Oprah Winfrey</h3>
              <p className="cr-figure-description">
                From a troubled childhood to becoming a media mogul and philanthropist, 
                Oprah's journey demonstrates the power of resilience and self-belief.
              </p>
              <div className="cr-figure-tag">Media &amp; Philanthropy</div>
            </div>
            
            {/* Elon Musk */}
            <div className="cr-figure-card">
              <div className="cr-figure-image-container">
                <img 
                  src={ElonImage} 
                  alt="Elon Musk" 
                  className="cr-figure-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div className="cr-figure-icon"><FaLightbulb /></div>';
                  }}
                />
              </div>
              <h3 className="cr-figure-title">Elon Musk</h3>
              <p className="cr-figure-description">
                Founder of Tesla and SpaceX, Elon Musk continues to push technological boundaries 
                through relentless innovation and perseverance.
              </p>
              <div className="cr-figure-tag">Technology &amp; Innovation</div>
            </div>
            
            {/* Malala Yousafzai */}
            <div className="cr-figure-card">
              <div className="cr-figure-image-container">
                <img 
                  src={MalalaImage} 
                  alt="Malala Yousafzai" 
                  className="cr-figure-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div className="cr-figure-icon"><FaGraduationCap /></div>';
                  }}
                />
              </div>
              <h3 className="cr-figure-title">Malala Yousafzai</h3>
              <p className="cr-figure-description">
                Nobel Peace Prize winner and advocate for girls' education, Malala's courage 
                and determination have inspired millions worldwide.
              </p>
              <div className="cr-figure-tag">Education &amp; Activism</div>
            </div>
            
            {/* Steve Jobs */}
            <div className="cr-figure-card">
              <div className="cr-figure-image-container">
                <img 
                  src={SteveImage} 
                  alt="Steve Jobs" 
                  className="cr-figure-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div className="cr-figure-icon"><FaChartLine /></div>';
                  }}
                />
              </div>
              <h3 className="cr-figure-title">Steve Jobs</h3>
              <p className="cr-figure-description">
                Co-founder of Apple Inc., Steve Jobs revolutionized personal technology 
                through his commitment to innovation and excellence.
              </p>
              <div className="cr-figure-tag">Technology &amp; Design</div>
            </div>
          </div>
        </section>

        {/* ===== CAREER PLANNING TIPS ===== */}
        <section className="cr-tips-section">
          <div className="cr-section-header">
            <h2>Career Planning Strategies</h2>
            <div className="cr-section-divider"></div>
            <p className="cr-section-subtitle">Practical steps for career development</p>
          </div>

          <div className="cr-tips-container">
            <div className="cr-tip-card">
              <div className="cr-tip-number">01</div>
              <h3 className="cr-tip-title">Self-Assessment</h3>
              <p className="cr-tip-description">Identify your strengths, interests, values, and skills to align with suitable career paths.</p>
            </div>
            
            <div className="cr-tip-card">
              <div className="cr-tip-number">02</div>
              <h3 className="cr-tip-title">Research Careers</h3>
              <p className="cr-tip-description">Explore different professions, job requirements, and growth opportunities in various sectors.</p>
            </div>
            
            <div className="cr-tip-card">
              <div className="cr-tip-number">03</div>
              <h3 className="cr-tip-title">Skill Development</h3>
              <p className="cr-tip-description">Acquire relevant skills through education, training, and practical experience.</p>
            </div>
            
            <div className="cr-tip-card">
              <div className="cr-tip-number">04</div>
              <h3 className="cr-tip-title">Networking</h3>
              <p className="cr-tip-description">Build professional connections through mentors, internships, and industry events.</p>
            </div>
          </div>
        </section>

        {/* ===== CONNECTION STATUS ===== */}
        <div className="cr-connection-status">
          <small>
            Displaying {careerResources.length} career resources from national database
          </small>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CareerResources;
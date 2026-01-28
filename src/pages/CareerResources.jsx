import React, { useEffect } from 'react';
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
  FaHandshake
} from 'react-icons/fa';
import { useCareerResources } from '../contexts/CareerResourcesContext';
import '../styles/careerResources.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PageHeader from '../components/page-header'; // Add this import

const CareerResources = () => {
  const {
    careerResources,
    loading,
    error,
    fetchCareerResources,
    clearError,
  } = useCareerResources();

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
        <div className="career-resources-wrapper">
          <div className="loading-container">
            <div className="loading-spinner"></div>
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
        <div className="career-resources-wrapper">
          <div className="error-container">
            <h3>Error Loading Resources</h3>
            <p>{error}</p>
            <button 
              onClick={() => { clearError(); fetchCareerResources(); }} 
              className="retry-btn"
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
      <div className="career-resources-wrapper">
        {/* Replace Hero Section with PageHeader */}
        <PageHeader 
          title="Career Guidance Resources"
          description="Comprehensive career development resources designed to help Malawian students explore opportunities, develop skills, and plan successful career pathways aligned with national development goals."
        />

        {/* Resources Grid */}
        <section className="career-resources-section">
          <div className="section-header">
            <h2>Career Development Resources</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Essential tools and information for career planning</p>
          </div>
          
          <div className="resources-grid">
            {careerResources.length > 0 ? (
              careerResources.map((resource) => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-icon-container">
                    {getIcon(resource.icon)}
                  </div>
                  
                  <h3 className="resource-title">{resource.title}</h3>
                  
                  <p className="resource-description">{resource.description}</p>
                  
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <FaExternalLinkAlt className="link-icon" />
                    Access Resource
                  </a>
                </div>
              ))
            ) : (
              <div className="no-resources">
                <div className="no-resources-icon">
                  <FaFileAlt />
                </div>
                <h3>No career resources available yet</h3>
                <p>Check back soon for career guidance materials</p>
              </div>
            )}
          </div>
        </section>

        {/* Motivational Figures Section */}
        <section className="motivation-section">
          <div className="section-header">
            <h2>Inspirational Figures</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Global leaders who exemplify perseverance and achievement</p>
          </div>

          <div className="figures-grid">
            <div className="figure-card">
              <div className="figure-icon">
                <FaUserTie />
              </div>
              <h3>Oprah Winfrey</h3>
              <p>
                From a troubled childhood to becoming a media mogul and philanthropist, 
                Oprah's journey demonstrates the power of resilience and self-belief.
              </p>
              <div className="figure-tag">Media & Philanthropy</div>
            </div>
            
            <div className="figure-card">
              <div className="figure-icon">
                <FaLightbulb />
              </div>
              <h3>Elon Musk</h3>
              <p>
                Founder of Tesla and SpaceX, Elon Musk continues to push technological boundaries 
                through relentless innovation and perseverance.
              </p>
              <div className="figure-tag">Technology & Innovation</div>
            </div>
            
            <div className="figure-card">
              <div className="figure-icon">
                <FaGraduationCap />
              </div>
              <h3>Malala Yousafzai</h3>
              <p>
                Nobel Peace Prize winner and advocate for girls' education, Malala's courage 
                and determination have inspired millions worldwide.
              </p>
              <div className="figure-tag">Education & Activism</div>
            </div>
            
            <div className="figure-card">
              <div className="figure-icon">
                <FaChartLine />
              </div>
              <h3>Steve Jobs</h3>
              <p>
                Co-founder of Apple Inc., Steve Jobs revolutionized personal technology 
                through his commitment to innovation and excellence.
              </p>
              <div className="figure-tag">Technology & Design</div>
            </div>
          </div>
        </section>

        {/* Career Planning Tips */}
        <section className="tips-section">
          <div className="section-header">
            <h2>Career Planning Strategies</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Practical steps for career development</p>
          </div>

          <div className="tips-container">
            <div className="tip-item">
              <div className="tip-number">01</div>
              <h3>Self-Assessment</h3>
              <p>Identify your strengths, interests, values, and skills to align with suitable career paths.</p>
            </div>
            
            <div className="tip-item">
              <div className="tip-number">02</div>
              <h3>Research Careers</h3>
              <p>Explore different professions, job requirements, and growth opportunities in various sectors.</p>
            </div>
            
            <div className="tip-item">
              <div className="tip-number">03</div>
              <h3>Skill Development</h3>
              <p>Acquire relevant skills through education, training, and practical experience.</p>
            </div>
            
            <div className="tip-item">
              <div className="tip-number">04</div>
              <h3>Networking</h3>
              <p>Build professional connections through mentors, internships, and industry events.</p>
            </div>
          </div>
        </section>

        {/* Connection Status */}
        <div className="connection-status">
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
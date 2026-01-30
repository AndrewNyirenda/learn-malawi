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
import PageHeader from '../components/page-header';

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
                <div key={resource.id} className="resource-card-enhanced">
                  <div className="resource-icon-enhanced">
                    {getIcon(resource.icon)}
                  </div>
                  
                  <h3 className="resource-title-enhanced">{resource.title}</h3>
                  
                  <p className="resource-description-enhanced">{resource.description}</p>
                  
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link-enhanced"
                  >
                    <FaExternalLinkAlt className="link-icon-enhanced" />
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
            <div className="figure-card-enhanced">
              <div className="figure-icon-enhanced">
                <FaUserTie />
              </div>
              <h3 className="figure-title-enhanced">Oprah Winfrey</h3>
              <p className="figure-description-enhanced">
                From a troubled childhood to becoming a media mogul and philanthropist, 
                Oprah's journey demonstrates the power of resilience and self-belief.
              </p>
              <div className="figure-tag-enhanced">Media & Philanthropy</div>
            </div>
            
            <div className="figure-card-enhanced">
              <div className="figure-icon-enhanced">
                <FaLightbulb />
              </div>
              <h3 className="figure-title-enhanced">Elon Musk</h3>
              <p className="figure-description-enhanced">
                Founder of Tesla and SpaceX, Elon Musk continues to push technological boundaries 
                through relentless innovation and perseverance.
              </p>
              <div className="figure-tag-enhanced">Technology & Innovation</div>
            </div>
            
            <div className="figure-card-enhanced">
              <div className="figure-icon-enhanced">
                <FaGraduationCap />
              </div>
              <h3 className="figure-title-enhanced">Malala Yousafzai</h3>
              <p className="figure-description-enhanced">
                Nobel Peace Prize winner and advocate for girls' education, Malala's courage 
                and determination have inspired millions worldwide.
              </p>
              <div className="figure-tag-enhanced">Education & Activism</div>
            </div>
            
            <div className="figure-card-enhanced">
              <div className="figure-icon-enhanced">
                <FaChartLine />
              </div>
              <h3 className="figure-title-enhanced">Steve Jobs</h3>
              <p className="figure-description-enhanced">
                Co-founder of Apple Inc., Steve Jobs revolutionized personal technology 
                through his commitment to innovation and excellence.
              </p>
              <div className="figure-tag-enhanced">Technology & Design</div>
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
            <div className="tip-card-enhanced">
              <div className="tip-number-enhanced">01</div>
              <h3 className="tip-title-enhanced">Self-Assessment</h3>
              <p className="tip-description-enhanced">Identify your strengths, interests, values, and skills to align with suitable career paths.</p>
            </div>
            
            <div className="tip-card-enhanced">
              <div className="tip-number-enhanced">02</div>
              <h3 className="tip-title-enhanced">Research Careers</h3>
              <p className="tip-description-enhanced">Explore different professions, job requirements, and growth opportunities in various sectors.</p>
            </div>
            
            <div className="tip-card-enhanced">
              <div className="tip-number-enhanced">03</div>
              <h3 className="tip-title-enhanced">Skill Development</h3>
              <p className="tip-description-enhanced">Acquire relevant skills through education, training, and practical experience.</p>
            </div>
            
            <div className="tip-card-enhanced">
              <div className="tip-number-enhanced">04</div>
              <h3 className="tip-title-enhanced">Networking</h3>
              <p className="tip-description-enhanced">Build professional connections through mentors, internships, and industry events.</p>
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
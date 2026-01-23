// src/components/CareerResources.jsx
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
  FaLink
} from 'react-icons/fa';
import { useCareerResources } from '../contexts/CareerResourcesContext';
import '../styles/careerResources.css';
import Footer from '../components/Footer';
import Header from '../components/Header';

const CareerResources = () => {
  const {
    careerResources,
    loading,
    error,
    fetchCareerResources,
    clearError,
  } = useCareerResources();

  // Fetch resources on mount - empty dependency array to fetch only once
  useEffect(() => {
    const loadResources = async () => {
      await fetchCareerResources();
    };

    loadResources();
  }, []); // REMOVED fetchCareerResources from dependency array

  const getIcon = (iconName) => {
    const iconMap = {
      'FaBullseye': FaBullseye,
      'FaFileAlt': FaFileAlt,
      'FaComments': FaComments,
      'FaUsers': FaUsers,
      'FaClock': FaClock,
      'FaCompass': FaCompass,
      'FaRocket': FaRocket,
      'default': FaLink,
    };
    
    const IconComponent = iconMap[iconName] || iconMap.default;
    return <IconComponent />;
  };

  if (loading && careerResources.length === 0) {
    return (
      <>
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
        <h1 className="career-resources-title">Career Resources</h1>
        <p className="career-resources-intro">
          Explore these valuable resources to guide and motivate your career journey.
        </p>

        {/* Resources Grid */}
        <div className="career-resources-list">
          {careerResources.length > 0 ? (
            careerResources.map((resource) => (
              <div key={resource.id} className="career-resource-card">
                <div className="resource-icon-wrapper">
                  <div className="resource-icon">
                    {getIcon(resource.icon)}
                  </div>
                </div>
                
                <h3 className="resource-title">{resource.title}</h3>
                
                <p className="resource-description">{resource.description}</p>
                
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  
                  Learn More
                </a>
              </div>
            ))
          ) : (
            <div className="no-resources-found">
              <p>No career resources available yet. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Motivational Figures Section */}
        <div className="motivational-figures-section">
          <h2 className="motivational-figures-title">Motivational Figures</h2>
          <p className="motivational-figures-intro">
            Get inspired by the stories of some of the most successful individuals in the world.
          </p>

          <div className="motivational-figures-list">
            <div className="figure-card">
              <h3>Oprah Winfrey</h3>
              <p>
                From a troubled childhood to becoming a media mogul and philanthropist, Oprah's journey is a testament to resilience and self-belief.
              </p>
            </div>
            <div className="figure-card">
              <h3>Elon Musk</h3>
              <p>
                Founder of Tesla and SpaceX, Elon Musk continues to push the boundaries of technology and innovation despite numerous setbacks.
              </p>
            </div>
            <div className="figure-card">
              <h3>Malala Yousafzai</h3>
              <p>
                A Nobel Peace Prize winner and advocate for girls' education, Malala's courage and determination have inspired millions around the world.
              </p>
            </div>
            <div className="figure-card">
              <h3>Steve Jobs</h3>
              <p>
                Co-founder of Apple Inc., Steve Jobs revolutionized personal technology through innovation and relentless pursuit of excellence.
              </p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="connection-status">
          <small>
            Showing {careerResources.length} career resources from backend API
          </small>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CareerResources;
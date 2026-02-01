import React from 'react';
import { FaArrowRight, FaBook, FaFileAlt, FaPlay, FaQuestionCircle, FaNewspaper, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/landing-page/services.css';

const Services = () => {
  const navigate = useNavigate();
  
  const servicesData = [
    { 
      title: "Primary and Secondary School Books", 
      description: "Curriculum-aligned textbooks and learning materials.",
      icon: <FaBook />,
      path: "/study-notes"
    },
    { 
      title: "Exam Pastpapers", 
      description: "Comprehensive collection of MSCE, and JCE past examination papers.",
      icon: <FaFileAlt />,
      path: "/past-papers"
    },
    { 
      title: "Digital Learning", 
      description: "Video tutorials for MSCE and JCE.",
      icon: <FaPlay />,
      path: "/tutorials"
    },
    { 
      title: "Interactive Practice Quizzes", 
      description: "Curriculum-based quizzes designed to reinforce understanding.",
      icon: <FaQuestionCircle />,
      path: "/quizzes"
    },
    { 
      title: "Education News and Updates", 
      description: "Examination updates, policy announcements, and scholarship information.",
      icon: <FaNewspaper />,
      path: "/news"
    },
    { 
      title: "Career Guidance Resources", 
      description: "Career pathways, and skills development resources for learners.",
      icon: <FaDownload />,
      path: "/resources"
    }
  ];

  return (
    <section className="core-services-section">
      <h2>Core Services</h2>
      <div className="services-horizontal-container">
        <div className="services-grid">
          {servicesData.map((service) => (
            <div 
              key={service.title} 
              className="service-card-minimal"
              onClick={() => navigate(service.path)}
            >
              <div className="service-icon">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="service-link">
                Access service <FaArrowRight />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
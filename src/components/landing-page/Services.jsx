import React, { useState } from "react";
import {
  FaArrowRight,
  FaBook,
  FaFileAlt,
  FaPlay,
  FaQuestionCircle,
  FaNewspaper,
  FaDownload
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/landing-page/services.css";

const Services = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);

  const servicesData = [
    {
      title: "Primary and Secondary School Books",
      description: "Curriculum-aligned textbooks and structured learning materials.",
      icon: <FaBook />,
      path: "/study-notes"
    },
    {
      title: "Exam Past Papers",
      description: "Comprehensive MSCE and JCE past examination papers.",
      icon: <FaFileAlt />,
      path: "/past-papers"
    },
    {
      title: "Digital Learning",
      description: "High-quality video tutorials for MSCE and JCE learners.",
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
      description: "Examination updates, policy announcements, and scholarships.",
      icon: <FaNewspaper />,
      path: "/news"
    },
    {
      title: "Career Guidance Resources",
      description: "Career pathways and skills development resources for learners.",
      icon: <FaDownload />,
      path: "/resources"
    }
  ];

  const handleCardClick = (path, index) => {
    setActiveCard(index);
    setTimeout(() => {
      setActiveCard(null);
      navigate(path);
    }, 150);
  };

  const handleKeyDown = (e, path, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(path, index);
    }
  };

  return (
    <section 
      className="edu-resources"  // Changed from core-services-section
      aria-labelledby="services-title"
    >
      <header className="edu-header">  {/* Added header wrapper */}
        <h2 id="services-title">Core Services</h2>
        <p>
          Comprehensive educational tools and resources designed to support
          students, teachers, and lifelong learners across Malawi.
        </p>
      </header>

      <div className="services-horizontal-container">
        <div className="services-grid">
          {servicesData.map((service, index) => (
            <article
              key={service.title}
              className={`service-card-minimal ${activeCard === index ? 'active' : ''}`}
              onClick={() => handleCardClick(service.path, index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, service.path, index)}
              aria-label={`Access ${service.title}: ${service.description}`}
            >
              <div className="service-icon" aria-hidden="true">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="service-link">
                Access service <FaArrowRight />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
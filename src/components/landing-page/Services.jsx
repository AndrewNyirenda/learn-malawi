// components/landing-page/Services.jsx
import React, { useState, useEffect, useRef } from "react";
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
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const servicesData = [
    {
      title: "Study Notes",
      description: "Curriculum-aligned textbooks and structured learning materials for MSCE and JCE.",
      icon: <FaBook />,
      path: "/study-notes",
      color: "#3b82f6", // Sky blue
    },
    {
      title: "Past Papers",
      description: "Comprehensive MSCE and JCE past examination papers with marking schemes.",
      icon: <FaFileAlt />,
      path: "/past-papers",
      color: "#102f57",
    },
    {
      title: "Video Tutorials",
      description: "High-quality video tutorials designed to simplify complex concepts.",
      icon: <FaPlay />,
      path: "/tutorials",
      color: "#dc2626", // Red
    },
    {
      title: "Practice Quizzes",
      description: "Curriculum-based interactive quizzes to reinforce understanding.",
      icon: <FaQuestionCircle />,
      path: "/quizes",
      color: "#b8912f",
    },
    {
      title: "News & Updates",
      description: "Examination updates, policy announcements, and scholarship opportunities.",
      icon: <FaNewspaper />,
      path: "/news",
      color: "#22c55e", // Green
    },
    {
      title: "Career Resources",
      description: "Career pathways and skills development resources for future success.",
      icon: <FaDownload />,
      path: "/career-resources",
      color: "#96741f",
    }
  ];

  const handleCardClick = (path, index) => {
    setActiveCard(index);
    setTimeout(() => {
      setActiveCard(null);
      navigate(path);
    }, 200);
  };

  const handleKeyDown = (e, path, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(path, index);
    }
  };

  return (
    <section ref={sectionRef} className="services-section" aria-labelledby="services-title">
      <div className="services-orb services-orb-1" />
      <div className="services-orb services-orb-2" />

      <header className="services-header">
        <span className="services-eyebrow">What We Offer</span>
        <h2 id="services-title">Core Services</h2>
        <p>
          Comprehensive educational tools and resources designed to support
          students, teachers, and lifelong learners across Malawi.
        </p>
      </header>

      <div className={`services-grid ${visible ? "visible" : ""}`}>
        {servicesData.map((service, index) => (
          <article
            key={service.title}
            className={`service-card ${activeCard === index ? "active" : ""}`}
            onClick={() => handleCardClick(service.path, index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, service.path, index)}
            aria-label={`Access ${service.title}: ${service.description}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="service-card-inner">
              <div className="service-icon-wrapper">
                <div className="service-icon" style={{ backgroundColor: service.color }}>
                  {service.icon}
                </div>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="service-link">
                Explore <FaArrowRight />
              </span>
              <div className="service-accent" style={{ backgroundColor: service.color }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Services;
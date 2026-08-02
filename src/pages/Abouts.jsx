import React, { useEffect } from "react";
import "../styles/abouts.css";
import {
  FaUsers,
  FaBullseye,
  FaLightbulb,
  FaChalkboardTeacher,
  FaBookOpen,
  FaClock,
  FaProjectDiagram,
  FaGraduationCap,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import inno from "../images/inno.jpg";
import willard from "../images/willard.JPG";
import andrew from "../images/andrew.jpg";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import PageHeader from "../components/page-header";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: "Willard Zimba",
      role: "Founder & Director",
      bio: "Leading educational innovation in Malawi with a vision for accessible, quality digital learning for all students.",
      image: willard,
      social: { linkedin: "#", twitter: "#", email: "willard@learnmalawi.com" },
    },
    {
      name: "Andrew Kwanjana Nyirenda",
      role: "Full Stack Developer",
      bio: "Architected and developed the Learn Malawi platform infrastructure, ensuring scalable and reliable performance.",
      image: andrew,
      social: { linkedin: "#", twitter: "#", email: "andrew@learnmalawi.com" },
    },
    {
      name: "Innocent Frank Gomwa",
      role: "Full Stack Developer",
      bio: "Architected and developed the Learn Malawi platform infrastructure, ensuring scalable and reliable performance.",
      image: inno,
      social: { linkedin: "#", twitter: "#", email: "innocent@learnmalawi.com" },
    },
  ];

  const missionVision = [
    {
      title: "Mission",
      description:
        "To transform secondary education in Malawi by providing equitable access to a comprehensive, free digital learning platform that enhances student engagement and improves academic performance.",
      icon: FaBullseye,
    },
    {
      title: "Vision",
      description:
        "To be the leading catalyst for educational equity in Malawi, empowering every student to reach their full potential and contribute to a prosperous Malawi 2063.",
      icon: FaLightbulb,
    },
  ];

  const values = [
    {
      title: "Equity",
      description: "Ensuring access to quality education across all 28 districts.",
      icon: FaUsers,
    },
    {
      title: "Quality",
      description: "Curriculum-aligned, educator-reviewed academic content.",
      icon: FaChalkboardTeacher,
    },
    {
      title: "Innovation",
      description: "Leveraging technology to modernize Malawian education.",
      icon: FaProjectDiagram,
    },
    {
      title: "Collaboration",
      description: "Working with educators and institutions nationwide.",
      icon: FaBookOpen,
    },
  ];

  const philosophyPoints = [
    {
      text: "Active Recall & Spaced Repetition",
      icon: FaClock,
    },
    {
      text: "Multimodal Learning Approaches",
      icon: FaLightbulb,
    },
    {
      text: "Continuous Formative Assessment",
      icon: FaChalkboardTeacher,
    },
    {
      text: "Contextualized Localized Learning",
      icon: FaUsers,
    },
  ];

  return (
    <>
      <Header />
      <div className="about-wrapper">
        {/* ===== HERO ===== */}
        <div className="page-masthead">
          <PageHeader
            title="About Learn Malawi"
            description="Free, quality digital education for every Malawian secondary student."
          />
          <div className="about-hero-gold-line"></div>
        </div>

        {/* ===== STORY ===== */}
        <section className="about-story-section">
          <div className="about-story-grid">
            <div className="about-story-left">
              <span className="about-story-eyebrow">Our Journey</span>
              <h2>Why We Built Learn Malawi</h2>
              <p>
                Learn Malawi was created to eliminate educational inequality
                across Malawi. We believe access to structured, high-quality
                learning resources should not depend on geography or income.
              </p>
              <p>
                Our platform delivers curriculum-aligned JCE and MSCE resources
                designed to strengthen performance, engagement, and long-term
                academic success.
              </p>
              <div className="about-story-cta">
                <span className="about-story-highlight">Free.</span>
                <span className="about-story-highlight">Accessible.</span>
                <span className="about-story-highlight">Built for Malawi.</span>
              </div>
            </div>

            <div className="about-story-image">
              <div className="about-story-placeholder">
                <div className="about-story-content">
                  <FaGraduationCap className="about-story-icon" />
                  <span>Empowering Malawi's Future</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== MISSION & VISION ===== */}
        <section className="about-mv-section">
          <div className="about-mv-grid">
            {missionVision.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="about-mv-block">
                  <div className="about-mv-icon-wrap">
                    <Icon className="about-mv-icon" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== VALUES ===== */}
        <section className="about-values-section">
          <div className="about-section-header">
            <div className="about-section-header-row">
              <span className="about-section-eyebrow">Core Principles</span>
              <div className="about-section-divider"></div>
            </div>
            <h2>Our Values</h2>
          </div>
          <div className="about-values-grid">
            {values.map((val, index) => {
              const Icon = val.icon;
              return (
                <div key={index} className="about-value-box">
                  <div className="about-value-icon-wrap">
                    <Icon className="about-value-icon" />
                  </div>
                  <h4>{val.title}</h4>
                  <p>{val.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== PHILOSOPHY ===== */}
        <section className="about-philosophy-section">
          <div className="about-section-header">
            <div className="about-section-header-row">
              <span className="about-section-eyebrow">Pedagogical Foundation</span>
              <div className="about-section-divider"></div>
            </div>
            <h2>Educational Philosophy</h2>
          </div>
          <div className="about-philosophy-grid">
            {philosophyPoints.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="about-philosophy-card">
                  <div className="about-philosophy-icon-wrap">
                    <Icon className="about-philosophy-icon" />
                  </div>
                  <p>{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== TEAM ===== */}
        <section className="about-team-section">
          <div className="about-section-header">
            <div className="about-section-header-row">
              <span className="about-section-eyebrow">Meet the Makers</span>
              <div className="about-section-divider"></div>
            </div>
            <h2>Leadership & Development Team</h2>
          </div>
          <div className="about-team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="about-team-card">
                <div className="about-team-image">
                  <img src={member.image} alt={member.name} />
                  <div className="about-team-overlay">
                    <div className="about-team-social">
                      <a href={member.social.linkedin} aria-label="LinkedIn"><FaLinkedinIn /></a>
                      <a href={member.social.twitter} aria-label="Twitter"><FaTwitter /></a>
                      <a href={`mailto:${member.social.email}`} aria-label="Email"><FaEnvelope /></a>
                    </div>
                  </div>
                </div>
                <div className="about-team-info">
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
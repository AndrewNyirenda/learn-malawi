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
    },
    {
      name: "Andrew Kwanjana Nyirenda",
      role: "Full Stack Developer",
      bio: "Architected and developed the Learn Malawi platform infrastructure, ensuring scalable and reliable performance.",
      image: andrew,
    },
    {
      name: "Innocent Frank Gomwa",
      role: "Full Stack Developer",
      bio: "Architected and developed the Learn Malawi platform infrastructure, ensuring scalable and reliable performance.",
      image: inno,
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
      description:
        "Ensuring access to quality education across all 28 districts.",
      icon: FaUsers,
    },
    {
      title: "Quality",
      description:
        "Curriculum-aligned, educator-reviewed academic content.",
      icon: FaChalkboardTeacher,
    },
    {
      title: "Innovation",
      description:
        "Leveraging technology to modernize Malawian education.",
      icon: FaProjectDiagram,
    },
    {
      title: "Collaboration",
      description:
        "Working with educators and institutions nationwide.",
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
        <PageHeader
          title="About Learn Malawi"
          description="Free, quality digital education for every Malawian secondary student."
        />

        {/* STORY SPLIT SECTION */}
        <section className="story-section">
          <div className="story-grid">
            <div className="story-left">
              <h2>Our Story</h2>
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
            </div>

            <div className="story-highlight">
              <h3>Our Commitment</h3>
              <p>
                Free. Accessible. Nationally aligned. Built for Malawi.
              </p>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="mv-section">
          <div className="mv-grid">
            {missionVision.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="mv-block">
                  <Icon className="mv-icon" />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* VALUES */}
        <section className="values-section">
          <h2 className="center-title">Our Core Values</h2>
          <div className="values-grid">
            {values.map((val, index) => {
              const Icon = val.icon;
              return (
                <div key={index} className="value-box">
                  <Icon className="value-icon" />
                  <h4>{val.title}</h4>
                  <p>{val.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="philosophy-section">
          <h2 className="center-title">Educational Philosophy</h2>
          <div className="philosophy-grid">
            {philosophyPoints.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="philosophy-card">
                  <Icon className="philosophy-icon" />
                  <p>{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* TEAM */}
        <section className="team-section">
          <h2 className="center-title">Leadership & Development Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <span>{member.role}</span>
                <p>{member.bio}</p>
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
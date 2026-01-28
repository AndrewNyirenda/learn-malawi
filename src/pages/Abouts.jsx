import React from "react";
import "../styles/abouts.css";
import { FaUsers, FaBullseye, FaLightbulb, FaChalkboardTeacher, FaBookOpen, FaClock, FaProjectDiagram } from "react-icons/fa";
import inno from "../images/inno.jpg";
import willard from "../images/willard.JPG";
import andrew from "../images/andrew.jpg";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import PageHeader from "../components/page-header"; // Add this import

const About = () => {
  const teamMembers = [
    { 
      name: "Willard Zimba", 
      role: "Founder & Director", 
      bio: "Leading educational innovation in Malawi with a vision for accessible, quality digital learning for all students.",
      image: willard 
    },
    { 
      name: "Andrew Kwanjana Nyirenda", 
      role: "Full Stack Developer", 
      bio: "Architected and developed the Learn Malawi platform infrastructure, ensuring scalable and reliable performance.",
      image: andrew 
    },
    { 
      name: "Innocent Frank Gomwa", 
      role: "Full Stack Developer", 
      bio: "Architected and developed the Learn Malawi platform infrastructure, ensuring scalable and reliable performance.",
      image: inno 
    },
  ];

  const missionVision = [
    {
      title: "Mission",
      description:
        "To transform secondary education in Malawi by providing equitable access to a comprehensive, free digital learning platform that enhances student engagement, improves academic performance, and fosters lifelong learning for all, regardless of geographic or socioeconomic barriers.",
      icon: FaBullseye,
    },
    {
      title: "Vision",
      description:
        "To be the leading catalyst for educational equity in Malawi, where every secondary student has the tools and opportunity to achieve their full academic potential, thereby contributing to an educated, innovative, and prosperous nation as envisioned by Malawi 2063.",
      icon: FaLightbulb,
    },
  ];

  const values = [
    { 
      title: "Equity and Inclusion", 
      description: "We believe every student deserves access to quality education regardless of their location or background. We are committed to bridging the digital divide across Malawi's 28 districts.", 
      icon: FaUsers 
    },
    { 
      title: "Quality and Relevance", 
      description: "We uphold the highest standards of educational content, ensuring all materials are curriculum-aligned, accurate, and developed with input from certified Malawian educators.", 
      icon: FaChalkboardTeacher 
    },
    { 
      title: "Innovation and Adaptability", 
      description: "We embrace technology as a powerful tool for change, constantly evolving our platform to meet the changing needs of Malawian students and the educational landscape.", 
      icon: FaProjectDiagram 
    },
    { 
      title: "Collaboration and Partnership", 
      description: "We achieve more together. We work closely with educators, institutions, and communities to create meaningful educational impact across Malawi.", 
      icon: FaBookOpen 
    },
  ];

  const philosophyPoints = [
    { 
      text: "Active Recall and Spaced Repetition: Through interactive quizzes and progressive learning paths, we help students strengthen memory retention and master concepts over time.", 
      icon: FaClock 
    },
    { 
      text: "Multimodal Learning: We cater to diverse learning styles by offering content in various formats—text, video, audio, and interactive exercises.", 
      icon: FaLightbulb 
    },
    { 
      text: "Formative Assessment: Our platform provides instant feedback and detailed analytics, allowing students to track progress and identify areas for improvement continuously.", 
      icon: FaChalkboardTeacher 
    },
    { 
      text: "Contextualized Learning: By using local examples and offering content in both English and Chichewa, we ensure education is relevant and accessible to every Malawian student.", 
      icon: FaUsers 
    },
  ];

  return (
    <>
      <Header />
      <div className="about-wrapper">
        {/* Replace Institutional Hero with PageHeader */}
        <PageHeader 
          title="Learn Malawi"
          description="A dedicated initiative providing free, quality digital education resources for JCE and MSCE students across all 28 districts of Malawi."
        />

        {/* Our Story */}
        <section className="story-section">
          <div className="section-header">
            <h2>Our Story</h2>
            <div className="section-divider"></div>
          </div>
          <div className="story-content">
            <p>
              Learn Malawi is a free digital education platform dedicated to one
              powerful goal: Free, Quality Education for Every Malawian Student.
              <br /><br />
              We provide comprehensive, curriculum-aligned learning resources
              for JCE and MSCE students across Malawi, bridging educational gaps
              and ensuring equal opportunities for academic success nationwide.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision-section">
          <div className="section-header">
            <h2>Mission & Vision</h2>
            <div className="section-divider"></div>
          </div>
          <div className="mv-grid">
            {missionVision.map((mv, index) => {
              const Icon = mv.icon;
              return (
                <div key={index} className="mv-card">
                  <div className="mv-icon-container">
                    <Icon className="mv-icon" />
                  </div>
                  <h3>{mv.title}</h3>
                  <p>{mv.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Our Values */}
        <section className="values-section">
          <div className="section-header">
            <h2>Our Values</h2>
            <div className="section-divider"></div>
          </div>
          <div className="values-container">
            <div className="values-scroll-wrapper">
              <div className="values-scroll-content">
                {values.map((val, index) => {
                  const Icon = val.icon;
                  return (
                    <div key={index} className="value-card">
                      <div className="value-icon-container">
                        <Icon className="value-icon" />
                      </div>
                      <h3>{val.title}</h3>
                      <p>{val.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Educational Philosophy */}
        <section className="philosophy-section">
          <div className="section-header">
            <h2>Our Educational Philosophy</h2>
            <div className="section-divider"></div>
          </div>
          <div className="philosophy-content">
            <ul className="philosophy-list">
              {philosophyPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <li key={index} className="philosophy-point">
                    <div className="phil-icon-container">
                      <Icon className="phil-icon" />
                    </div>
                    <div className="phil-text">
                      {point.text}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Our Team */}
        <section className="team-section">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <div className="section-divider"></div>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image-container">
                  <img src={member.image} alt={member.name} className="team-image" />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
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
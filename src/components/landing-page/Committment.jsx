import React from 'react';
import { FaCheckCircle, FaBookOpen, FaLock, FaUsers } from 'react-icons/fa';
import '../../styles/landing-page/committment.css';

const Committment = () => {
  const trustPrinciples = [
    {
      title: "Authentically Malawian",
      description: "Our resources are built with and for Malawi, using local examples, languages, and contexts to make learning relevant and meaningful.",
      icon: <FaCheckCircle />
    },
    {
      title: "Proven & Verified",
      description: "We use effective learning techniques like active recall and every resource is reviewed by Malawian educators for accuracy.",
      icon: <FaBookOpen />
    },
    {
      title: "Free Forever",
      description: "We are committed to being free forever. We serve diverse learners with content in multiple formats—text, video, audio, and interactives.",
      icon: <FaLock />
    },
    {
      title: "Nationwide & Personal",
      description: "Designed to serve learners in all 28 districts, we use instant feedback and progress tracking to guide each student's unique path.",
      icon: <FaUsers />
    }
  ];

  return (
    <section className="institutional-trust-section">
      <h2>Our Commitment To Excellence</h2>
      <div className="trust-grid">
        {trustPrinciples.map((principle) => (
          <div key={principle.title} className="trust-principle">
            <h3>
              {principle.icon}
              {principle.title}
            </h3>
            <p>{principle.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Committment;
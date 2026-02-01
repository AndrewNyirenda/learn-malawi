import React from "react";
import { FaCheckCircle, FaBookOpen, FaLock, FaUsers } from "react-icons/fa";
import "../../styles/landing-page/committment.css";

const Committment = () => {
  const trustPrinciples = [
    {
      title: "Authentically Malawian",
      description:
        "Our resources are built with and for Malawi, using local examples, languages, and contexts to make learning relevant and meaningful.",
      icon: <FaCheckCircle />
    },
    {
      title: "Proven & Verified",
      description:
        "We apply effective learning techniques such as active recall, and every resource is reviewed by Malawian educators for accuracy.",
      icon: <FaBookOpen />
    },
    {
      title: "Free Forever",
      description:
        "We are committed to remaining free forever, serving diverse learners through text, video, audio, and interactive formats.",
      icon: <FaLock />
    },
    {
      title: "Nationwide & Personal",
      description:
        "Designed to serve learners across all 28 districts, with feedback and progress tracking that supports each learner’s journey.",
      icon: <FaUsers />
    }
  ];

  return (
    <section className="institutional-trust-section">
      <h2>Our Commitment to Excellence</h2>
      <div className="trust-grid">
        {trustPrinciples.map((principle) => (
          <article key={principle.title} className="trust-principle">
            <h3>
              {principle.icon}
              {principle.title}
            </h3>
            <p>{principle.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Committment;
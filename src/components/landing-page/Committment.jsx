// components/landing-page/Committment.jsx
import React from "react";
import { FaCheckCircle, FaBookOpen, FaLock, FaUsers } from "react-icons/fa";
import "../../styles/landing-page/committment.css";

const romanNumerals = ["I", "II", "III", "IV"];

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
        "Designed to serve learners across all 28 districts, with feedback and progress tracking that supports each learner's journey.",
      icon: <FaUsers />
    }
  ];

  return (
    <section className="commitment-section" aria-labelledby="commitment-title">
      <div className="commitment-inner">
        <header className="commitment-header">
          <span className="commitment-eyebrow">Our Charter</span>
          <h2 id="commitment-title">Our Commitment to Excellence</h2>
          <p>
            Built on principles of authenticity, verification, accessibility,
            and nationwide reach to serve every Malawian learner.
          </p>
        </header>

        <div className="trust-grid">
          {trustPrinciples.map((principle, index) => (
            <article key={principle.title} className="trust-principle">
              <span className="trust-numeral" aria-hidden="true">
                {romanNumerals[index]}
              </span>
              <div className="trust-principle-body">
                <h3>
                  {principle.icon}
                  {principle.title}
                </h3>
                <p>{principle.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Committment;
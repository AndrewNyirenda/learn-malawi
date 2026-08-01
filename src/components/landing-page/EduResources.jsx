// components/landing-page/EduResources.jsx
import React, { useEffect, useRef, useState } from "react";
import "../../styles/landing-page/edu-resources.css";

const icons = {
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  ),
  paper: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="m8 12 3 3 6-6" />
    </svg>
  ),
};

const statsData = [
  { id: 1, label: "Primary & Secondary School Books", value: 140, icon: "book" },
  { id: 2, label: "Exam Past Papers", value: 863, icon: "paper" },
  { id: 3, label: "Video Tutorials", value: 28, icon: "play" },
  { id: 4, label: "Career Guidance Resources", value: 90, icon: "briefcase" },
  { id: 5, label: "Interactive Quizzes", value: 80, icon: "check" },
];

const EduResources = () => {
  const [animatedStats, setAnimatedStats] = useState(statsData.map(() => 0));
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateStats();
        }
      },
      { threshold: 0.35 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const duration = 2200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setAnimatedStats(statsData.map((stat) => Math.floor(stat.value * progress)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <section ref={sectionRef} className="edu-resources" aria-labelledby="edu-resources-title">
      <header className="edu-header">
        <span className="edu-eyebrow">Official Resource Library</span>
        <h2 id="edu-resources-title">Educational Resources</h2>
        <p>
          A growing national library of learning materials designed to support
          students, teachers, and lifelong learners across Malawi.
        </p>
      </header>

      <div className="edu-stats-grid">
        {statsData.map((stat, index) => (
          <article key={stat.id} className="edu-stat-card" aria-label={`${stat.value}+ ${stat.label}`}>
            <span className="edu-stat-icon" aria-hidden="true">{icons[stat.icon]}</span>
            <span className="edu-stat-number">{animatedStats[index]}+</span>
            <span className="edu-stat-label">{stat.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default EduResources;
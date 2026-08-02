// components/landing-page/EduResources.jsx
import React, { useEffect, useRef, useState } from "react";
import "../../styles/landing-page/edu-resources.css";

const statsData = [
  { id: 1, label: "Primary & Secondary School Books", value: 140 },
  { id: 2, label: "Exam Past Papers", value: 863 },
  { id: 3, label: "Video Tutorials", value: 28 },
  { id: 4, label: "Career Guidance Resources", value: 90 },
  { id: 5, label: "Interactive Quizzes", value: 80 },
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
            <span className="edu-stat-number">{animatedStats[index]}+</span>
            <span className="edu-stat-label">{stat.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default EduResources;
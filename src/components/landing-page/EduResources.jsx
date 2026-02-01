import React, { useState, useEffect, useRef } from 'react';
import '../../styles/landing-page/edu-resources.css';

const EduResources = () => {
  const statsData = [
    { id: 1, label: "Primary/Secondary School Books", value: 140 },
    { id: 2, label: "Exam Pastpapers", value: 863 },
    { id: 3, label: "Video Tutorials", value: 28 },
    { id: 4, label: "Career Guidance Resources", value: 90 },
    { id: 5, label: "Interactive Quizzes", value: 80 }
  ];

  const [animatedStats, setAnimatedStats] = useState(statsData.map(stat => 
    typeof stat.value === 'number' ? 0 : stat.value
  ));
  
  const [statsInView, setStatsInView] = useState(false);
  const statsSectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }

    return () => {
      if (statsSectionRef.current) {
        observer.unobserve(statsSectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!statsInView) return;

    const duration = 2500;
    const intervals = statsData.map((stat, index) => {
      if (typeof stat.value !== 'number') return null;
      
      const increment = stat.value / 60;
      let currentValue = 0;
      
      const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= stat.value) {
          currentValue = stat.value;
          clearInterval(interval);
        }
        
        setAnimatedStats(prev => {
          const newStats = [...prev];
          newStats[index] = Math.floor(currentValue);
          return newStats;
        });
      }, duration / 60);
      
      return interval;
    });
    
    return () => intervals.forEach(interval => interval && clearInterval(interval));
  }, [statsInView]);

  return (
    <section className="national-impact-section" ref={statsSectionRef}>
      <h2>Educational Resources</h2>
      <div className="stats-container-elegant">
        {statsData.map((stat, index) => (
          <div key={stat.id} className="stat-elegant">
            <div className="stat-number">
              {animatedStats[index]}
              {typeof stat.value === 'number' ? '+' : ''}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EduResources;
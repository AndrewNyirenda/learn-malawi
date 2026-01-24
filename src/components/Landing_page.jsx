import Header from "./Header";
import "../styles/landing_page.css";
import { 
  FaBook, FaFileAlt, FaPlay, FaQuestionCircle, 
  FaNewspaper, FaDownload, FaCheckCircle, 
  FaBookOpen, FaLock, FaUsers, FaArrowRight
} from "react-icons/fa";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom"; 
import Heroslideshow from "./Heroslideshow";
import { useContext, useEffect, useState, useRef } from "react";
import { SearchContext } from '../components/SearchContext';

const LandingPage = () => {
  const navigate = useNavigate(); 
  const { query, results, setResults, showResults, setShowResults } = useContext(SearchContext);
  
  // Stats data - national impact metrics
  const statsData = [
    { id: 1, label: "Primary/Secondary School Books", value: 1450 },
    { id: 2, label: "Exam Pastpapers", value: 863 },
    { id: 3, label: "Video Tutorials", value: 28 },
    { id: 4, label: "Career Guidance Resources", value: 500 },
    { id: 5, label: "Interactive Quizzes", value: 200 }
  ];

  // State for animated numbers
  const [animatedStats, setAnimatedStats] = useState(statsData.map(stat => 
    typeof stat.value === 'number' ? 0 : stat.value
  ));
  
  // Add state to track if stats section is in view
  const [statsInView, setStatsInView] = useState(false);
  
  // Add a ref for the stats section
  const statsSectionRef = useRef(null);
  
  const servicesData = [
  { 
    title: "Primary and Secondary School Books", 
    description: "Curriculum-aligned textbooks and learning materials.",
    icon: <FaBook />,
    path: "/study-notes"
  },
  { 
    title: "Exam Pastpapers", 
    description: "Comprehensive collection of MSCE, and JCE past examination papers.",
    icon: <FaFileAlt />,
    path: "/past-papers"
  },
  { 
    title: "Digital Learning", 
    description: "Video tutorials for MSCE and JCE.",
    icon: <FaPlay />,
    path: "/tutorials"
  },
  { 
    title: "Interactive Practice Quizzes", 
    description: "Curriculum-based quizzes designed to reinforce understanding.",
    icon: <FaQuestionCircle />,
    path: "/quizzes"
  },
  { 
    title: "Education News and Updates", 
    description: "Examination updates, policy announcements, and scholarship information.",
    icon: <FaNewspaper />,
    path: "/news"
  },
  { 
    title: "Career Guidance Resources", 
    description: "Career pathways, and skills development resources for learners.",
    icon: <FaDownload />,
    path: "/resources"
  }
];
  // Trust principles
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

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const filtered = allResources.filter(
      (res) =>
        res.title.toLowerCase().includes(query.toLowerCase()) ||
        res.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setShowResults(true);
  }, [query]);

  // Intersection Observer effect
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
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -100px 0px' // Slight offset
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

  // Animation effect for stats - now triggered by statsInView
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
    <div className="LandingPageWrapper">
      <Header />

      {showResults ? (
        <div className="search-results">
          <h3>Search Results:</h3>
          {results.length > 0 ? (
            <div className="resource-grid">
              {results.map((res) => (
                <div key={res.id} className="resource-card">
                  <img src={res.thumbnail} alt={res.title} />
                  <h4>{res.title}</h4>
                  <p>{res.category}</p>
                  <a
                    href={res.downloadLink}
                    className="download-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaDownload /> Download
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">No results found for "{query}"</p>
          )}

          <button
            className="explore-btn"
            onClick={() => setShowResults(false)}
          >
            Return to Home
          </button>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-main-title">
              <h1>Learn Malawi</h1>
              <p className="mission-statement">
                National Digital Education Infrastructure
              </p>
            </div>
            
            <div className="hero-image hero-image-fullwidth">
              <Heroslideshow />
            </div>
            
            <div className="hero-description-below">
              <p>
                A public education initiative providing free, high-quality digital learning resources 
                for every Malawian student. Developed in partnership with the Ministry of Education, 
                Learn Malawi ensures equitable access to curriculum-aligned materials across all 
                28 districts, supporting both urban and rural learning environments.
              </p>
            </div>
          </section>

          {/* National Impact Stats */}
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

          {/* Core Services */}
          <section className="core-services-section">
            <h2>Core Services</h2>
            <div className="services-horizontal-container">
              <div className="services-grid">
                {servicesData.map((service) => (
                  <div 
                    key={service.title} 
                    className="service-card-minimal"
                    onClick={() => navigate(service.path)}
                  >
                    <div className="service-icon">
                      {service.icon}
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <span className="service-link">
                      Access service <FaArrowRight />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Institutional Trust */}
          <section className="institutional-trust-section">
            <h2>Our Committment To Execellence</h2>
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
        </>
      )}

      <Footer />
    </div>
  );
};

export default LandingPage;
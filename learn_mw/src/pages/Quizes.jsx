import React, { useState, useEffect } from "react";
import { useQuizzes } from '../contexts/QuizzesContext';
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/quizes.css";
import Footer from "../components/Footer.jsx";
import Header from '../components/Header';
import PageHeader from '../components/page-header';
import Filter from '../components/Filter';
import { FaClock, FaQuestionCircle, FaSlidersH, FaTimes, FaSearch } from 'react-icons/fa';

const Quizes = () => {
  const [level, setLevel] = useState("primary");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const navigate = useNavigate();
  
  const {
    quizzes: contextQuizzes,
    subjects,
    classes,
    loading,
    error,
    fetchQuizzes,
    fetchSubjects,
    fetchClasses,
    clearError,
  } = useQuizzes();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const subjectOptions = ["all", ...(subjects || [])]
    .map(subject => ({
      value: subject,
      label: subject === "all" ? "All Subjects" : subject
    }));

  const classOptions = ["all", ...(classes || [])]
    .map(cls => ({
      value: cls,
      label: cls === "all" ? "All Classes" : cls
    }));

  const difficultyOptions = ["all", "easy", "medium", "hard"]
    .map(difficulty => ({
      value: difficulty,
      label: difficulty === "all" ? "All Difficulties" : 
             difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
    }));
  
  useEffect(() => {
    const loadData = async () => {
      const filters = {
        level: level,
        ...(subjectFilter !== 'all' && { subject: subjectFilter }),
        ...(difficultyFilter !== 'all' && { difficulty: difficultyFilter }),
        ...(classFilter !== 'all' && { class: classFilter }),
      };
      
      await Promise.all([
        fetchQuizzes(filters),
        fetchSubjects(level),
        fetchClasses(level),
      ]);
    };

    loadData();
  }, [level, subjectFilter, difficultyFilter, classFilter]);
  
  useEffect(() => {
    setSubjectFilter("all");
    setClassFilter("all");
    setDifficultyFilter("all");
  }, [level]);
  
  const formatTime = (seconds) => {
    if (!seconds) return "0 min";
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };
  
  const calculateTotalTime = (questions) => {
    if (!questions || questions.length === 0) return 0;
    return questions.reduce((sum, q) => sum + (q.timeLimit || 30), 0);
  };
  
  const handleStart = (quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };
  
  if (loading && !contextQuizzes?.length) {
    return (
      <>
        <Header />
        <div className="lm-page">
          <PageHeader 
            title="Interactive Quizzes"
            description="Test your knowledge across various subjects and classes. Select your level and use filters to find the perfect quiz."
          />
          <div className="state-box">
            <span className="spinner"></span>
            <p>Loading quizzes...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error && !contextQuizzes?.length) {
    return (
      <>
        <Header />
        <div className="lm-page">
          <PageHeader 
            title="Interactive Quizzes"
            description="Test your knowledge across various subjects and classes. Select your level and use filters to find the perfect quiz."
          />
          <div className="state-box">
            <h3>Error Loading Quizzes</h3>
            <p>{error}</p>
            <button 
              onClick={() => { 
                clearError(); 
                fetchQuizzes({ level }); 
              }}
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="lm-page">
        <PageHeader 
          title="Interactive Quizzes"
          description="Test your knowledge across various subjects and classes. Select your level and use filters to find the perfect quiz."
        />
        
        <div className="level-switch">
          <button
            className={level === "primary" ? "active" : ""}
            onClick={() => setLevel("primary")}
          >
            Primary Level
          </button>
          <button
            className={level === "secondary" ? "active" : ""}
            onClick={() => setLevel("secondary")}
          >
            Secondary Level
          </button>
        </div>
        
        <div className="filter-bar" style={{ margin: '0 auto 1.5rem', maxWidth: 'var(--container-max)', width: 'calc(100% - 2*var(--container-pad))' }}>
          <div className="filter-bar-label">
            <FaSlidersH className="filter-icon" />
            Filters
          </div>
          <div className="filter-group">
            <label className="filter-label">Subject</label>
            <select className="filter-select" value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
              {subjectOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Class</label>
            <select className="filter-select" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
              {classOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Difficulty</label>
            <select className="filter-select" value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)}>
              {difficultyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          {(subjectFilter !== 'all' || classFilter !== 'all' || difficultyFilter !== 'all') && (
            <button className="filter-reset-btn" onClick={() => { setSubjectFilter('all'); setClassFilter('all'); setDifficultyFilter('all'); }}>
              <FaTimes style={{ fontSize: '0.7rem' }} /> Clear
            </button>
          )}
        </div>
        
        <section className="quiz-section">
          <div className="quiz-grid">
            {contextQuizzes?.length === 0 ? (
              <div className="empty">
                <FaQuestionCircle size={64} color="#94a3b8" />
                <h3>No Quizzes Available</h3>
                <p>No quizzes found for the selected filters. Please try different subject, class, or difficulty.</p>
              </div>
            ) : (
              contextQuizzes?.map((quiz) => (
                <div key={quiz.id} className="qz-card">
                  {/* Purple Header - News style */}
                  <div className="qz-card-header">
                    <h3>{quiz.title}</h3>
                    <div className="qz-badges">
                      <span className="qz-level-badge">
                        {quiz.level === 'primary' ? 'Primary' : 'Secondary'}
                      </span>
                      <span className={`qz-difficulty-badge ${quiz.difficulty?.toLowerCase()}`}>
                        {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Body - Only Time and Questions */}
                  <div className="qz-card-body">
                    <div className="qz-meta">
                      <div className="qz-meta-item">
                        <FaQuestionCircle className="qz-meta-icon" />
                        <span className="qz-meta-value">{quiz.questions?.length || 0} Questions</span>
                      </div>
                      <div className="qz-meta-item">
                        <FaClock className="qz-meta-icon" />
                        <span className="qz-meta-value">{formatTime(calculateTotalTime(quiz.questions))}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Footer - Take Quiz Button */}
                  <div className="qz-card-footer">
                    <button 
                      onClick={() => handleStart(quiz)} 
                      className="qz-start-btn"
                    >
                      Take Quiz
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        
        <div className="status-bar">
          <span className="dot"></span>
          Showing {contextQuizzes?.length || 0} {contextQuizzes?.length === 1 ? "quiz" : "quizzes"}
          {loading && " · refreshing…"}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Quizes;
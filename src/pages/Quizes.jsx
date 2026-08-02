import React, { useState, useEffect } from "react";
import { useQuizzes } from '../contexts/QuizzesContext';
import { useNavigate } from "react-router-dom";
import "../styles/quizes.css";
import Footer from "../components/Footer.jsx";
import Header from '../components/Header';
import PageHeader from '../components/page-header';
import Filter from '../components/Filter';
import { FaClock, FaQuestionCircle, FaArrowRight } from 'react-icons/fa';

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
        <div className="quizes-container">
          <div className="page-masthead">
            <PageHeader 
              title="Interactive Quizzes"
              description="Test your knowledge across various subjects and classes. Select your level and use filters to find the perfect quiz."
            />
          </div>
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
        <div className="quizes-container">
          <div className="page-masthead">
            <PageHeader 
              title="Interactive Quizzes"
              description="Test your knowledge across various subjects and classes. Select your level and use filters to find the perfect quiz."
            />
          </div>
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
      <div className="quizes-container">
        {/* ===== HERO ===== */}
        <div className="page-masthead">
          <PageHeader 
            title="Interactive Quizzes"
            description="Test your knowledge across various subjects and classes. Select your level and use filters to find the perfect quiz."
          />
        </div>
        
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
        
        <div className="qz-filters">
          <div className="filter-group">
            <Filter
              id="subject"
              value={subjectFilter}
              onChange={setSubjectFilter}
              options={subjectOptions}
              showAllOption={false}
              placeholder="Select subject"
              disabled={loading}
            />
          </div>
          
          <div className="filter-group">
            <Filter
              id="class"
              value={classFilter}
              onChange={setClassFilter}
              options={classOptions}
              showAllOption={false}
              placeholder="Select class"
              disabled={loading}
            />
          </div>
          
          <div className="filter-group">
            <Filter
              id="difficulty"
              value={difficultyFilter}
              onChange={setDifficultyFilter}
              options={difficultyOptions}
              showAllOption={false}
              placeholder="Select difficulty"
              disabled={loading}
            />
          </div>
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
                  {/* Gold accent bar */}
                  <div className="qz-card-accent"></div>
                  
                  {/* Header - Navy gradient with pattern */}
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
                  
                  {/* Card Body - Stats with icons */}
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
                    {/* Subject & Class info */}
                    <div className="qz-meta-tags">
                      <span className="qz-subject-tag">{quiz.subject || 'General'}</span>
                      <span className="qz-class-tag">Class {quiz.class || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {/* Card Footer - Take Quiz Button */}
                  <div className="qz-card-footer">
                    <button 
                      onClick={() => handleStart(quiz)} 
                      className="qz-start-btn"
                    >
                      Take Quiz <FaArrowRight className="qz-btn-icon" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        
        <div className="quiz-status">
          Showing {contextQuizzes?.length || 0} {contextQuizzes?.length === 1 ? "quiz" : "quizzes"}
          {loading && " · loading"}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Quizes;
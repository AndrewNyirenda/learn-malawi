// pages/Quizes.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuizzes } from '../contexts/QuizzesContext';
import { useNavigate } from "react-router-dom";
import "../styles/quizes.css";
import Footer from "../components/Footer.jsx";
import Header from '../components/Header';
import Filter from '../components/Filter';
import { FaClock, FaQuestionCircle, FaArrowRight, FaHome, FaChevronRight, FaBrain } from 'react-icons/fa';

// ─── Masthead (matches other pages) ──────────────────────────────
const Masthead = () => (
  <div className="quizes-page-masthead">
    <div className="quizes-masthead-inner">
      <nav className="quizes-breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><FaHome /> Home</Link>
        <FaChevronRight />
        <span className="quizes-breadcrumb-current">Quizzes</span>
      </nav>

      <div className="quizes-masthead-eyebrow">
        <span className="quizes-masthead-eyebrow-icon">
          <FaBrain />
        </span>
        Interactive Learning
      </div>

      <h1 className="quizes-masthead-title">
        Interactive <span className="quizes-masthead-title-accent">Quizzes</span>
      </h1>

      <p className="quizes-masthead-desc">
        Test your knowledge across various subjects and classes. Select your level and use filters to find the perfect quiz.
      </p>

      <div className="quizes-masthead-meta">
        <span className="quizes-masthead-meta-item">Primary &amp; Secondary</span>
        <span className="quizes-masthead-meta-item">Multiple Subjects</span>
        <span className="quizes-masthead-meta-item">Instant Feedback</span>
      </div>
    </div>
  </div>
);

// ─── Main component ────────────────────────────────────────────────
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
          <Masthead />
          <div className="quizes-state-box">
            <span className="quizes-spinner"></span>
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
          <Masthead />
          <div className="quizes-state-box">
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
        <Masthead />

        {/* ===== TOOLBAR ===== */}
        <div className="quizes-toolbar-panel">
          <div className="quizes-toolbar-row">
            <div className="quizes-level-switch" data-level={level}>
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

            <div className="quizes-filter-group">
              <label className="quizes-filter-label" htmlFor="quizes-subject">Subject:</label>
              <Filter
                id="quizes-subject"
                className="quizes-filter-select"
                value={subjectFilter}
                onChange={setSubjectFilter}
                options={subjectOptions}
                showAllOption={false}
                placeholder="Select subject"
                disabled={loading}
              />
            </div>

            <div className="quizes-filter-group">
              <label className="quizes-filter-label" htmlFor="quizes-class">Class:</label>
              <Filter
                id="quizes-class"
                className="quizes-filter-select"
                value={classFilter}
                onChange={setClassFilter}
                options={classOptions}
                showAllOption={false}
                placeholder="Select class"
                disabled={loading}
              />
            </div>

            <div className="quizes-filter-group">
              <label className="quizes-filter-label" htmlFor="quizes-difficulty">Difficulty:</label>
              <Filter
                id="quizes-difficulty"
                className="quizes-filter-select"
                value={difficultyFilter}
                onChange={setDifficultyFilter}
                options={difficultyOptions}
                showAllOption={false}
                placeholder="Select difficulty"
                disabled={loading}
              />
            </div>
          </div>
        </div>
        
        <section className="quizes-quiz-section">
          <div className="quizes-quiz-grid">
            {contextQuizzes?.length === 0 ? (
              <div className="quizes-empty">
                <FaQuestionCircle size={64} color="#94a3b8" />
                <h3>No Quizzes Available</h3>
                <p>No quizzes found for the selected filters. Please try different subject, class, or difficulty.</p>
              </div>
            ) : (
              contextQuizzes?.map((quiz) => (
                <div key={quiz.id} className="quizes-card">
                  <div className="quizes-card-accent"></div>

                  <div className="quizes-card-header">
                    <h3>{quiz.title}</h3>
                    <div className="quizes-card-badges">
                      <span className="quizes-level-badge">
                        {quiz.level === 'primary' ? 'Primary' : 'Secondary'}
                      </span>
                      <span className={`quizes-difficulty-badge ${quiz.difficulty?.toLowerCase()}`}>
                        {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="quizes-card-medallion" aria-hidden="true">
                    <FaQuestionCircle />
                  </div>

                  <div className="quizes-card-body">
                    <div className="quizes-card-meta">
                      <div className="quizes-meta-item">
                        <span className="quizes-meta-icon"><FaQuestionCircle /></span>
                        <span className="quizes-meta-value">{quiz.questions?.length || 0} Questions</span>
                      </div>
                      <div className="quizes-meta-item">
                        <span className="quizes-meta-icon"><FaClock /></span>
                        <span className="quizes-meta-value">{formatTime(calculateTotalTime(quiz.questions))}</span>
                      </div>
                    </div>
                    <div className="quizes-card-tags">
                      <span className="quizes-subject-tag">{quiz.subject || 'General'}</span>
                      <span className="quizes-class-tag">Class {quiz.class || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="quizes-card-footer">
                    <button onClick={() => handleStart(quiz)} className="quizes-start-btn">
                      Take Quiz <FaArrowRight className="quizes-btn-icon" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        
        {/* Status line removed */}
      </div>
      <Footer />
    </>
  );
};

export default Quizes;
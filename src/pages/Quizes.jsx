// components/Quizes.jsx
import React, { useState, useEffect } from "react";
import { useQuizzes } from '../contexts/QuizzesContext';
import { useNavigate } from "react-router-dom";
import "../styles/quizes.css";
import Footer from "../components/Footer.jsx";
import Header from '../components/Header';

const Quizes = () => {
  const [level, setLevel] = useState("primary");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const navigate = useNavigate();
  
  // Get context values
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
  
  // Get all unique values for filters from API data
  const allSubjects = ["all", ...(subjects || [])];
  const allClasses = ["all", ...(classes || [])];
  const allDifficulties = ["all", "easy", "medium", "hard"];
  
  // Filter quizzes by level from API data
  const filteredQuizzes = (contextQuizzes || []).filter((quiz) => {
    if (level !== "all" && quiz.level !== level) return false;
    return true;
  });
  
  // Apply filters to displayed quizzes
  const displayedQuizzes = filteredQuizzes.filter((quiz) => {
    const matchesSubject = subjectFilter === "all" || quiz.subject === subjectFilter;
    const matchesClass = classFilter === "all" || quiz.class === classFilter;
    const matchesDifficulty = difficultyFilter === "all" || quiz.difficulty === difficultyFilter;
    
    return matchesSubject && matchesClass && matchesDifficulty;
  });
  
  // Fetch data from API when filters change
  useEffect(() => {
    const loadData = async () => {
      const filters = {
        level: level === 'all' ? undefined : level,
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
  
  // Reset filters when level changes
  useEffect(() => {
    setSubjectFilter("all");
    setClassFilter("all");
    setDifficultyFilter("all");
  }, [level]);
  
  // Format time helper
  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  // Calculate total time for a quiz
  const calculateTotalTime = (questions) => {
    if (!questions || questions.length === 0) return 0;
    return questions.reduce((sum, q) => sum + (q.timeLimit || 0), 0);
  };
  
  const handleQuizSelect = (quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };
  
  // Add loading state
  if (loading && displayedQuizzes.length === 0) {
    return (
      <div className="quizes-wrapper">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading quizzes...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Add error state
  if (error && displayedQuizzes.length === 0) {
    return (
      <div className="quizes-wrapper">
        <Header />
        <div className="error-container">
          <h3>Error Loading Quizzes</h3>
          <p>{error}</p>
          <button 
            onClick={() => { 
              clearError(); 
              fetchQuizzes({ level }); 
            }} 
            className="retry-btn"
          >
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <>
      <Header />
      <div className="quizes-wrapper">
        <div className="quiz-hero">
          <h1>Interactive Quizzes</h1>
          <p>
            Test your knowledge across various subjects and classes. Select your level and use filters to find the perfect quiz.
          </p>
        </div>
        
        <div className="level-tabs">
          <button
            className={level === "primary" ? "active" : ""}
            onClick={() => setLevel("primary")}
          >
            Primary 
          </button>
          <button
            className={level === "secondary" ? "active" : ""}
            onClick={() => setLevel("secondary")}
          >
            Secondary 
          </button>
        </div>
        
        {/* Filters Container - Reduced padding */}
        <div className="filters-container compact">
          <div className="filter-group">
            <label htmlFor="subject">Subject</label>
            <select
              id="subject"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="filter-select"
              disabled={loading}
            >
              <option value="all">All Subjects</option>
              {allSubjects.map((subject, index) => (
                subject !== "all" && (
                  <option key={`${subject}-${index}`} value={subject}>{subject}</option>
                )
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="class">Class / Form</label>
            <select
              id="class"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="filter-select"
              disabled={loading}
            >
              <option value="all">All Classes</option>
              {allClasses.map((cls, index) => (
                cls !== "all" && (
                  <option key={`${cls}-${index}`} value={cls}>{cls}</option>
                )
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="filter-select"
              disabled={loading}
            >
              <option value="all">All Difficulties</option>
              {allDifficulties.map(diff => (
                diff !== "all" && (
                  <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                )
              ))}
            </select>
          </div>
        </div>
        
        <div className="quiz-list">
          {displayedQuizzes.length === 0 ? (
            <div className="no-quizzes">
              {loading ? "Loading..." : "No quizzes available for the selected filters. Try adjusting your criteria."}
            </div>
          ) : (
            displayedQuizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card gradient-card">
                <div className="quiz-card-header">
                  <h3>{quiz.title}</h3>
                  <div className="quiz-badges">
                    <span className="level-badge">{quiz.level === 'primary' ? 'Primary' : 'Secondary'}</span>
                    <span className={`difficulty-badge ${quiz.difficulty}`}>
                      {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="quiz-card-body">
                  <div className="quiz-meta">
                    <div className="meta-item">
                      <span className="meta-label">Subject:</span>
                      <span className="meta-value">{quiz.subject}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Class:</span>
                      <span className="meta-value">{quiz.class}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Questions:</span>
                      <span className="meta-value">{quiz.questions?.length || 0}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Time:</span>
                      <span className="meta-value">{formatTime(calculateTotalTime(quiz.questions))}</span>
                    </div>
                  </div>
                  
                  {quiz.description && (
                    <p className="quiz-description">{quiz.description.substring(0, 100)}...</p>
                  )}
                </div>
                
                <div className="quiz-card-footer">
                  <button onClick={() => handleQuizSelect(quiz)} className="start-quiz-btn">
                    Take Quiz
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Quizes;
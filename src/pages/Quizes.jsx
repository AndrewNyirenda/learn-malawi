import React, { useState, useEffect } from "react";
import { useQuizzes } from '../contexts/QuizzesContext';
import { useNavigate } from "react-router-dom";
import "../styles/quizes.css";
import Footer from "../components/Footer.jsx";
import Header from '../components/Header';
import PageHeader from '../components/page-header';
import Filter from '../components/Filter'; // Import reusable Filter

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
  
  // Prepare options for Filter components
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
      <>
        <Header />
        <div className="quizes-wrapper">
          <PageHeader 
            title="Interactive Quizzes"
            description="Test your knowledge across various subjects and classes. Select your level and use filters to find the perfect quiz."
          />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading quizzes...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  // Add error state
  if (error && displayedQuizzes.length === 0) {
    return (
      <>
        <Header />
        <div className="quizes-wrapper">
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
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="quizes-wrapper">
        <PageHeader 
          title="Interactive Quizzes"
          description="Test your knowledge across various subjects and classes. Select your level and use filters to find the perfect quiz."
        />
        
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
        
        {/* Filters Container - Using reusable Filter components */}
        <div className="filters-container compact">
          <div className="filter-group">
            <Filter
              id="subject"
              value={subjectFilter}
              onChange={setSubjectFilter}
              options={subjectOptions}
              showAllOption={false}
              className="quizes-filter"
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
              className="quizes-filter"
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
              className="quizes-filter"
              placeholder="Select difficulty"
              disabled={loading}
            />
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
// components/Quizes.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuizzes } from '../contexts/QuizzesContext';
import "../styles/quizes.css";
import Footer from "../components/Footer.jsx";

const Quizes = () => {
  const [level, setLevel] = useState("primary");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questionStartTimes, setQuestionStartTimes] = useState([]);
  const [completionTimes, setCompletionTimes] = useState([]);
  const timerRef = useRef(null);
  
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
    startQuiz,
    clearError,
  } = useQuizzes();
  
  // Get all unique values for filters from API data
  const allSubjects = ["all", ...(subjects || [])];
  const allClasses = ["all", ...(classes || [])];
  const allDifficulties = ["all", "easy", "medium", "hard"];
  
  // Filter quizzes by level from API data
  const filteredQuizzes = (contextQuizzes || []).filter((quiz) => quiz.level === level);
  
  // Apply filters to displayed quizzes
  const displayedQuizzes = filteredQuizzes.filter((quiz) => {
    const matchesSubject = subjectFilter === "all" || quiz.subject === subjectFilter;
    const matchesClass = classFilter === "all" || quiz.class === classFilter;
    const matchesDifficulty = difficultyFilter === "all" || quiz.difficulty === difficultyFilter;
    
    return matchesSubject && matchesClass && matchesDifficulty;
  });
  
  const currentQuestion = selectedQuiz?.questions?.[currentQuestionIndex] || null;
  
  // Fetch data from API when filters change
  useEffect(() => {
    const loadData = async () => {
      const filters = {
        level,
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
  
  // Timer effect - handles individual question timing
  useEffect(() => {
    if (!selectedQuiz || isFinished || timeLeft === null || !currentQuestion) return;
    
    // Start timing the question
    if (questionStartTimes[currentQuestionIndex] === undefined) {
      setQuestionStartTimes(prev => [...prev, Date.now()]);
    }
    
    if (timeLeft <= 0) {
      // Auto-move to next question when time's up
      if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
        handleNext();
      } else {
        finishQuiz();
      }
      return;
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
      setTimeTaken((prev) => prev + 1);
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, [timeLeft, isFinished, selectedQuiz, currentQuestionIndex]);
  
  // Reset all filters when level changes
  useEffect(() => {
    setSubjectFilter("all");
    setClassFilter("all");
    setDifficultyFilter("all");
  }, [level]);
  
  // Format time helper
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  // Calculate passing threshold (70%)
  const passingThreshold = selectedQuiz?.questions?.length 
    ? Math.ceil(selectedQuiz.questions.length * 0.7) 
    : 0;
  
  // Check if user passed
  const passed = score >= passingThreshold;
  
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };
  
  const handleNext = () => {
    if (!currentQuestion) return;
    
    // Calculate completion time for current question
    if (questionStartTimes[currentQuestionIndex] !== undefined) {
      const completionTime = Math.floor((Date.now() - questionStartTimes[currentQuestionIndex]) / 1000);
      setCompletionTimes(prev => {
        const newTimes = [...prev];
        newTimes[currentQuestionIndex] = completionTime;
        return newTimes;
      });
    }
    
    // Store user's answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = {
      question: currentQuestion.question,
      selectedOption,
      correctOption: currentQuestion.answer,
      isCorrect: selectedOption === currentQuestion.answer
    };
    setUserAnswers(newUserAnswers);
    
    // Update score
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
    }
    
    // Move to next question or finish
    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      // Reset timer for the next question
      const nextQuestion = selectedQuiz.questions[nextIndex];
      setTimeLeft(nextQuestion?.timeLimit || 60);
    } else {
      finishQuiz();
    }
  };
  
  const finishQuiz = () => {
    clearInterval(timerRef.current);
    setIsFinished(true);
    
    // Calculate completion time for last question if not already done
    if (questionStartTimes[currentQuestionIndex] !== undefined && 
        completionTimes[currentQuestionIndex] === undefined) {
      const completionTime = Math.floor((Date.now() - questionStartTimes[currentQuestionIndex]) / 1000);
      setCompletionTimes(prev => {
        const newTimes = [...prev];
        newTimes[currentQuestionIndex] = completionTime;
        return newTimes;
      });
    }
    
    // Store the last answer if not already stored
    if (selectedOption !== null && userAnswers.length <= currentQuestionIndex && currentQuestion) {
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestionIndex] = {
        question: currentQuestion.question,
        selectedOption,
        correctOption: currentQuestion.answer,
        isCorrect: selectedOption === currentQuestion.answer
      };
      setUserAnswers(newUserAnswers);
    }
  };
  
  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setShowInstructions(true);
  };
  
  const handleStartQuiz = () => {
    setShowInstructions(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setTimeTaken(0);
    setUserAnswers([]);
    setQuestionStartTimes([]);
    setCompletionTimes([]);
    // Set time to first question's timeLimit
    if (selectedQuiz?.questions?.[0]) {
      setTimeLeft(selectedQuiz.questions[0].timeLimit || 60);
    }
  };
  
  const handleBackToList = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setTimeLeft(null);
    setTimeTaken(0);
    setUserAnswers([]);
    setQuestionStartTimes([]);
    setCompletionTimes([]);
    setShowInstructions(false);
  };
  
  // Add loading state at the top of your component
  if (loading && displayedQuizzes.length === 0) {
    return (
      <div className="quizes-wrapper">
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
  
  
  

console.log('=== QUIZES.JSX DEBUG ===');
console.log('contextQuizzes length:', contextQuizzes?.length);
console.log('contextQuizzes:', contextQuizzes);
console.log('filteredQuizzes length:', filteredQuizzes?.length);
console.log('displayedQuizzes length:', displayedQuizzes?.length);
console.log('=======================');
  
  
  
  
  return (
    <>
      <div className="quizes-wrapper">
        {!selectedQuiz ? (
          <>
            <div className="quiz-description">
              <h1>Interactive Quizzes</h1>
              <p>
                Test your knowledge across various subjects and classes. Select your level and use filters to find the perfect quiz. 
                Each question has its own time limit based on difficulty level.
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
            
            {/* Filters Container */}
            <div className="filters-container">
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
                  <div key={quiz.id || quiz._id} className="quiz-card">
                    <h3>{quiz.title}</h3>
                    <div className="quiz-meta">
                      <span className="quiz-category">{quiz.subject}</span>
                      <span className="quiz-class">{quiz.class}</span>
                      <span className="quiz-difficulty">{quiz.difficulty}</span>
                    </div>
                    <p><strong>Questions:</strong> {quiz.questions?.length || 0}</p>
                    <p><strong>Total Time:</strong> {formatTime(quiz.totalTime || 0)}</p>
                    <p><strong>Difficulty:</strong> {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}</p>
                    <button onClick={() => handleQuizSelect(quiz)}>
                      Start Quiz
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        ) : showInstructions ? (
          <div className="quiz-container">
            <h2 className="quiz-title">{selectedQuiz.title}</h2>
            <div className="instructions">
              <h3>Quiz Instructions</h3>
              <ul>
                <li><strong>Time per question varies</strong> based on difficulty (shown for each question)</li>
                <li>You need <strong>70% or more</strong> to pass the quiz</li>
                <li>Read each question carefully before selecting an answer</li>
                <li>Once time runs out for a question, you'll automatically move to the next</li>
                <li>You can't go back to previous questions once answered</li>
                <li>Click "Start Quiz" when you're ready to begin</li>
              </ul>
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button 
                  className="nav-button next-button" 
                  onClick={handleStartQuiz}
                  style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="quiz-container">
            <h2 className="quiz-title">{selectedQuiz.title}</h2>
            
            {!isFinished && currentQuestion && (
              <div className="timer-display">
                <h3>Time Remaining</h3>
                <div className="time-left">{formatTime(timeLeft)}</div>
                <div className="question-time-info">
                  Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length} 
                  | Time limit: {formatTime(currentQuestion.timeLimit)}
                </div>
              </div>
            )}
            
            {isFinished ? (
              <div className="results-container">
                <h3>Quiz {passed ? "Passed! 🎉" : "Failed! 📝"}</h3>
                <p className="score-summary">
                  Your Score: <strong>{score}</strong> / {selectedQuiz.questions.length} 
                  ({Math.round((score / selectedQuiz.questions.length) * 100)}%)
                  {!passed && ` (Need ${passingThreshold} to pass)`}
                </p>
                <p className="time-summary">
                  ⏱️ Total Completion Time: <strong>{formatTime(timeTaken)}</strong>
                </p>
                
                {/* Show correct answers if failed */}
                {!passed && selectedQuiz.questions && (
                  <div className="correct-answers-summary">
                    <h4>Correct Answers Review</h4>
                    <ul>
                      {selectedQuiz.questions.map((q, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer?.isCorrect || false;
                        return (
                          <li key={index} className={isCorrect ? "correct" : "incorrect"}>
                            <div className="question">Q{index + 1}: {q.question}</div>
                            <div className="answers">
                              <span>Your answer: {userAnswer?.selectedOption || "No answer"}</span>
                              <span>Correct answer: {q.answer}</span>
                            </div>
                            {completionTimes[index] && (
                              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                                Time taken: {formatTime(completionTimes[index])} / {formatTime(q.timeLimit)}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                
                <div className="quiz-navigation" style={{ justifyContent: 'center' }}>
                  <button className="nav-button next-button" onClick={handleBackToList}>
                    Back to Quiz List
                  </button>
                </div>
              </div>
            ) : currentQuestion ? (
              <>
                <h4 className="question-number">
                  Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                </h4>
                <p className="question-text">{currentQuestion.question}</p>
                
                <ul className="option-list">
                  {currentQuestion.options?.map((option, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleOptionClick(option)}
                        className={`option-button ${selectedOption === option ? "selected" : ""}`}
                        disabled={selectedOption !== null && selectedOption !== option}
                      >
                        <span style={{ fontWeight: 'bold' }}>{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="quiz-navigation">
                  {currentQuestionIndex > 0 && (
                    <button
                      className="nav-button back-button"
                      onClick={() => {
                        setCurrentQuestionIndex(currentQuestionIndex - 1);
                        setSelectedOption(null);
                        // Reset timer for previous question
                        const prevQuestion = selectedQuiz.questions[currentQuestionIndex - 1];
                        setTimeLeft(prevQuestion?.timeLimit || 60);
                      }}
                    >
                      Back
                    </button>
                  )}
                  
                  <div style={{ flex: 1 }}></div>
                  
                  <button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className="nav-button next-button"
                  >
                    {currentQuestionIndex + 1 === selectedQuiz.questions.length ? "Finish" : "Next"}
                  </button>
                </div>
              </>
            ) : (
              <div className="no-question">
                <p>No question available. Please go back and try another quiz.</p>
                <button className="nav-button next-button" onClick={handleBackToList}>
                  Back to Quiz List
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default Quizes;
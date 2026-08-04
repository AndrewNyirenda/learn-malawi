// pages/QuizPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizzes } from '../contexts/QuizzesContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../styles/quizpage.css";
import { FaHome, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(null);
  
  const { fetchQuizById } = useQuizzes();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizData = await fetchQuizById(id);
        setQuiz(quizData);
      } catch (error) {
        console.error("Error loading quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuiz();
  }, [id]);
  
  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  
  // Timer effect
  useEffect(() => {
    if (!showQuizModal || !currentQuestion || isFinished) return;
    
    const questionTime = currentQuestion.timeLimit || 60;
    setTimeLeft(questionTime);
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
      setTimeTaken(prev => prev + 1);
    }, 1000);
    
    setTimer(interval);
    
    return () => clearInterval(interval);
  }, [showQuizModal, currentQuestionIndex, isFinished]);
  
  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  const handleStartQuiz = () => {
    setShowQuizModal(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setTimeTaken(0);
    setUserAnswers([]);
  };
  
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };
  
  const handleNextQuestion = () => {
    if (!currentQuestion || selectedOption === null) return;
    
    // Save answer
    const isCorrect = selectedOption === currentQuestion.answer;
    setUserAnswers([...userAnswers, {
      questionIndex: currentQuestionIndex,
      selectedOption,
      correctOption: currentQuestion.answer,
      isCorrect,
      timeSpent: (currentQuestion.timeLimit || 60) - timeLeft
    }]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  };
  
  const finishQuiz = () => {
    clearInterval(timer);
    setIsFinished(true);
    
    if (selectedOption !== null && userAnswers.length <= currentQuestionIndex) {
      const isCorrect = selectedOption === currentQuestion.answer;
      setUserAnswers([...userAnswers, {
        questionIndex: currentQuestionIndex,
        selectedOption,
        correctOption: currentQuestion.answer,
        isCorrect,
        timeSpent: (currentQuestion.timeLimit || 60) - timeLeft
      }]);
      
      if (isCorrect) {
        setScore(score + 1);
      }
    }
  };
  
  const handleCloseModal = () => {
    setShowQuizModal(false);
    clearInterval(timer);
  };
  
  const handleBackToList = () => {
    navigate('/quizes');
  };
  
  const passingThreshold = quiz?.questions?.length 
    ? Math.ceil(quiz.questions.length * 0.7) 
    : 0;
  const passed = score >= passingThreshold;
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="quizpage-loading-container">
          <div className="quizpage-loading-spinner"></div>
          <p>Loading quiz...</p>
        </div>
        <Footer />
      </>
    );
  }
  
  if (!quiz) {
    return (
      <>
        <Header />
        <div className="quizpage-error-container">
          <h3>Quiz not found</h3>
          <p>The quiz you're looking for doesn't exist or has been removed.</p>
          <button onClick={handleBackToList} className="quizpage-back-btn">
            Back to Quiz List
          </button>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="quizpage-wrapper">
        {/* ── Masthead ── */}
        <div className="quizpage-masthead">
          <nav className="quizpage-breadcrumb" aria-label="Breadcrumb">
            <Link to="/"><FaHome /> Home</Link>
            <FaChevronRight />
            <Link to="/quizes">Quizzes</Link>
            <FaChevronRight />
            <span className="quizpage-breadcrumb-current">{quiz.title}</span>
          </nav>
          
          <h1 className="quizpage-title">{quiz.title}</h1>
          
          <div className="quizpage-badges">
            <span className="quizpage-badge quizpage-level-badge">
              {quiz.level === 'primary' ? 'Primary' : 'Secondary'}
            </span>
            <span className={`quizpage-badge quizpage-difficulty-badge ${quiz.difficulty}`}>
              {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
            </span>
            <span className="quizpage-badge quizpage-subject-badge">{quiz.subject}</span>
            <span className="quizpage-badge quizpage-class-badge">{quiz.class}</span>
          </div>
        </div>

        {/* ── Instruction Card ── */}
        <div className="quizpage-instructions-container">
          <div className="quizpage-instructions-card">
            
            <h2>Quiz Instructions</h2>
            
            <div className="quizpage-instructions-grid">
              <div className="quizpage-instruction-item">
                <div className="quizpage-instruction-icon">📝</div>
                <h3>Questions</h3>
                <p>{quiz.questions?.length || 0} carefully crafted questions</p>
              </div>
              
              <div className="quizpage-instruction-item">
                <div className="quizpage-instruction-icon">⏱️</div>
                <h3>Time</h3>
                <p>Each question has its own time limit</p>
              </div>
              
              <div className="quizpage-instruction-item">
                <div className="quizpage-instruction-icon">🎯</div>
                <h3>Passing Score</h3>
                <p>70% or higher to pass</p>
              </div>
              
              <div className="quizpage-instruction-item">
                <div className="quizpage-instruction-icon">📊</div>
                <h3>Scoring</h3>
                <p>Instant feedback after each question</p>
              </div>
            </div>
            
            <div className="quizpage-instructions-details">
              <h3>How to Take This Quiz:</h3>
              <ul>
                <li>Each question has a specific time limit based on difficulty</li>
                <li>You need <strong>70% or more</strong> to pass the quiz</li>
                <li>Read each question carefully before selecting an answer</li>
                <li>Once time runs out, you'll automatically move to the next question</li>
                <li>You cannot go back to previous questions once answered</li>
                <li>Your results will be displayed at the end</li>
              </ul>
            </div>
            
            <div className="quizpage-start-quiz-section">
              <button onClick={handleStartQuiz} className="quizpage-start-quiz-button">
                Start Quiz Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* ── Quiz Modal ── */}
      {showQuizModal && (
        <div className="quizpage-modal-overlay" onClick={handleCloseModal}>
          <div className="quizpage-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="quizpage-modal-header">
              <h3>{quiz.title}</h3>
              <button onClick={handleCloseModal} className="quizpage-close-modal-btn">
                ×
              </button>
            </div>
            
            {!isFinished && currentQuestion ? (
              <div className="quizpage-modal-content">
                <div className="quizpage-modal-progress">
                  <div className="quizpage-timer-display">
                    <span className="quizpage-time-left">{formatTime(timeLeft)}</span>
                    <span className="quizpage-time-label">Time Remaining</span>
                  </div>
                  <div className="quizpage-question-counter">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </div>
                </div>
                
                <div className="quizpage-question-container">
                  <div className="quizpage-question-text">{currentQuestion.question}</div>
                  
                  <div className="quizpage-options-grid">
                    {currentQuestion.options?.map((option, index) => (
                      <button
                        key={index}
                        className={`quizpage-option-button ${selectedOption === option ? "quizpage-selected" : ""}`}
                        onClick={() => handleOptionSelect(option)}
                        disabled={selectedOption !== null}
                      >
                        <span className="quizpage-option-letter">{String.fromCharCode(65 + index)}</span>
                        <span className="quizpage-option-text">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="quizpage-modal-navigation">
                  {selectedOption !== null && (
                    <button onClick={handleNextQuestion} className="quizpage-next-question-btn">
                      {currentQuestionIndex + 1 === quiz.questions.length ? "Finish Quiz" : "Next Question →"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="quizpage-modal-results">
                <div className={`quizpage-result-header ${passed ? "quizpage-passed" : "quizpage-failed"}`}>
                  <h2>Quiz {passed ? "Passed! 🎉" : "Failed! 📝"}</h2>
                </div>
                
                <div className="quizpage-score-summary">
                  <div className="quizpage-score-circle">
                    <div className="quizpage-score-percent">{Math.round((score / quiz.questions.length) * 100)}%</div>
                    <div className="quizpage-score-details">
                      {score} / {quiz.questions.length} correct
                    </div>
                  </div>
                  
                  <div className="quizpage-result-details">
                    <div className="quizpage-detail-item">
                      <span className="quizpage-detail-label">Time Taken:</span>
                      <span className="quizpage-detail-value">{formatTime(timeTaken)}</span>
                    </div>
                    <div className="quizpage-detail-item">
                      <span className="quizpage-detail-label">Passing Score:</span>
                      <span className="quizpage-detail-value">{passingThreshold} out of {quiz.questions.length}</span>
                    </div>
                    <div className="quizpage-detail-item">
                      <span className="quizpage-detail-label">Your Score:</span>
                      <span className={`quizpage-detail-value ${passed ? "quizpage-passed" : "quizpage-failed"}`}>
                        {score} out of {quiz.questions.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                {!passed && (
                  <div className="quizpage-answers-review">
                    <h3>Review Your Answers</h3>
                    <div className="quizpage-review-list">
                      {quiz.questions.map((q, index) => {
                        const userAnswer = userAnswers.find(ans => ans.questionIndex === index);
                        const isCorrect = userAnswer?.isCorrect || false;
                        
                        if (isCorrect) return null;
                        
                        return (
                          <div key={index} className="quizpage-review-item">
                            <div className="quizpage-review-question">
                              <strong>Q{index + 1}:</strong> {q.question}
                            </div>
                            <div className="quizpage-review-answers">
                              <div className="quizpage-your-answer">
                                <span>Your answer:</span>
                                <span className="quizpage-incorrect">{userAnswer?.selectedOption || "No answer"}</span>
                              </div>
                              <div className="quizpage-correct-answer">
                                <span>Correct answer:</span>
                                <span className="quizpage-correct">{q.answer}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="quizpage-result-actions">
                  <button onClick={handleCloseModal} className="quizpage-close-quiz-btn">
                    Close Quiz
                  </button>
                  <button onClick={() => {
                    handleCloseModal();
                    handleStartQuiz();
                  }} className="quizpage-retry-quiz-btn">
                    Retry Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default QuizPage;
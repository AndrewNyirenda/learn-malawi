// pages/QuizPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizzes } from '../contexts/QuizzesContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../styles/quizpage.css";

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
  
   // Scroll to top when component mounts
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
    
    // Update score
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Move to next question or finish
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
    
    // Save final answer if not saved
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
        <div className="loading-container">
          <div className="loading-spinner"></div>
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
        <div className="error-container">
          <h3>Quiz not found</h3>
          <p>The quiz you're looking for doesn't exist or has been removed.</p>
          <button onClick={handleBackToList} className="back-btn">
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
      <div className="quiz-page-wrapper">
        <div className="quiz-page-header">
          <button onClick={handleBackToList} className="back-button">
            ← Back to Quizzes
          </button>
          <h1>{quiz.title}</h1>
          <div className="quiz-info-badges">
            <span className="level-badge">{quiz.level === 'primary' ? 'Primary' : 'Secondary'}</span>
            <span className={`difficulty-badge ${quiz.difficulty}`}>
              {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
            </span>
            <span className="subject-badge">{quiz.subject}</span>
            <span className="class-badge">{quiz.class}</span>
          </div>
        </div>
        
        <div className="quiz-instructions-container">
          <div className="instructions-card">
            <h2>Quiz Instructions</h2>
            
            <div className="instructions-grid">
              <div className="instruction-item">
                <div className="instruction-icon">📝</div>
                <h3>Questions</h3>
                <p>{quiz.questions?.length || 0} carefully crafted questions</p>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon">⏱️</div>
                <h3>Time</h3>
                <p>Each question has its own time limit</p>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon">🎯</div>
                <h3>Passing Score</h3>
                <p>70% or higher to pass</p>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon">📊</div>
                <h3>Scoring</h3>
                <p>Instant feedback after each question</p>
              </div>
            </div>
            
            <div className="instructions-details">
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
            
            <div className="start-quiz-section">
              <button onClick={handleStartQuiz} className="start-quiz-button">
                Start Quiz Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quiz Modal (92% width) */}
      {showQuizModal && (
        <div className="quiz-modal-overlay" onClick={handleCloseModal}>
          <div className="quiz-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="quiz-modal-header">
              <h3>{quiz.title}</h3>
              <button onClick={handleCloseModal} className="close-modal-btn">
                ×
              </button>
            </div>
            
            {!isFinished && currentQuestion ? (
              <div className="quiz-content">
                {/* Timer and Progress */}
                <div className="quiz-progress">
                  <div className="timer-display">
                    <span className="time-left">{formatTime(timeLeft)}</span>
                    <span className="time-label">Time Remaining</span>
                  </div>
                  <div className="question-counter">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </div>
                </div>
                
                {/* Question */}
                <div className="question-container">
                  <div className="question-text">{currentQuestion.question}</div>
                  
                  {/* Options */}
                  <div className="options-grid">
                    {currentQuestion.options?.map((option, index) => (
                      <button
                        key={index}
                        className={`option-button ${selectedOption === option ? "selected" : ""}`}
                        onClick={() => handleOptionSelect(option)}
                        disabled={selectedOption !== null}
                      >
                        <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                        <span className="option-text">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="quiz-navigation">
                  {selectedOption !== null && (
                    <button onClick={handleNextQuestion} className="next-question-btn">
                      {currentQuestionIndex + 1 === quiz.questions.length ? "Finish Quiz" : "Next Question →"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Results */
              <div className="quiz-results">
                <div className={`result-header ${passed ? "passed" : "failed"}`}>
                  <h2>Quiz {passed ? "Passed! 🎉" : "Failed! 📝"}</h2>
                </div>
                
                <div className="score-summary">
                  <div className="score-circle">
                    <div className="score-percent">{Math.round((score / quiz.questions.length) * 100)}%</div>
                    <div className="score-details">
                      {score} / {quiz.questions.length} correct
                    </div>
                  </div>
                  
                  <div className="result-details">
                    <div className="detail-item">
                      <span className="detail-label">Time Taken:</span>
                      <span className="detail-value">{formatTime(timeTaken)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Passing Score:</span>
                      <span className="detail-value">{passingThreshold} out of {quiz.questions.length}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Your Score:</span>
                      <span className={`detail-value ${passed ? "passed" : "failed"}`}>
                        {score} out of {quiz.questions.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Review wrong answers if failed */}
                {!passed && (
                  <div className="answers-review">
                    <h3>Review Your Answers</h3>
                    <div className="review-list">
                      {quiz.questions.map((q, index) => {
                        const userAnswer = userAnswers.find(ans => ans.questionIndex === index);
                        const isCorrect = userAnswer?.isCorrect || false;
                        
                        if (isCorrect) return null;
                        
                        return (
                          <div key={index} className="review-item">
                            <div className="review-question">
                              <strong>Q{index + 1}:</strong> {q.question}
                            </div>
                            <div className="review-answers">
                              <div className="your-answer">
                                <span>Your answer:</span>
                                <span className="incorrect">{userAnswer?.selectedOption || "No answer"}</span>
                              </div>
                              <div className="correct-answer">
                                <span>Correct answer:</span>
                                <span className="correct">{q.answer}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="result-actions">
                  <button onClick={handleCloseModal} className="close-quiz-btn">
                    Close Quiz
                  </button>
                  <button onClick={() => {
                    handleCloseModal();
                    handleStartQuiz();
                  }} className="retry-quiz-btn">
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
// src/components/admin-componenents/QuizzesPreviewModal.jsx
import React, { useState } from 'react';
import {
  FaTimes,
  FaQuestionCircle,
  FaClock,
  FaBook,
  FaBrain,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import '../../styles/Admin-Styles/QuizzesAdminModal.css';

const QuizzesPreviewModal = ({ quiz, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const totalQuestions = quiz.questions?.length || 0;
  const currentQuestionData = quiz.questions?.[currentQuestion];

  const handleAnswerSelect = (answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateScore();
      setQuizCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quiz.questions?.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctAnswers++;
      }
    });
    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(calculatedScore);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setScore(0);
  };

  if (!quiz) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaQuestionCircle /> Quiz Preview: {quiz.title}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="quiz-preview-container">
          {/* Quiz Info Header */}
          <div className="preview-header">
            <div>
              <h4 className="preview-quiz-title">{quiz.title}</h4>
              <div className="preview-meta">
                <span><FaBook /> {quiz.subject} - {quiz.class}</span>
                <span><FaBrain /> {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}</span>
                <span><FaClock /> {quiz.questions?.reduce((sum, q) => sum + (q.timeLimit || 0), 0)}s total</span>
              </div>
            </div>
            <div className="quiz-status">
              Question {currentQuestion + 1} of {totalQuestions}
            </div>
          </div>

          {!quizCompleted ? (
            <div className="question-preview">
              {/* Question Content */}
              <div className="preview-question-item">
                <div className="preview-question">
                  <strong>Question {currentQuestion + 1}:</strong> {currentQuestionData?.question}
                </div>
                
                {/* Options */}
                <div className="preview-options">
                  {currentQuestionData?.options?.map((option, index) => (
                    <div 
                      key={index} 
                      className={`preview-option ${
                        userAnswers[currentQuestion] === option ? 'selected' : ''
                      } ${
                        currentQuestionData.answer === option ? 'correct' : ''
                      }`}
                    >
                      <div className="option-preview">
                        <span className="option-letter-preview">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="option-text-preview">{option}</span>
                        {currentQuestionData.answer === option && (
                          <span className="correct-indicator">
                            <FaCheckCircle /> Correct Answer
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Limit */}
                <div className="time-limit-preview">
                  <FaClock /> Time Limit: {currentQuestionData?.timeLimit || 30} seconds
                </div>
              </div>

              {/* Navigation */}
              <div className="quiz-navigation">
                <button
                  type="button"
                  className="btn-nav prev"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                >
                  <FaArrowLeft /> Previous
                </button>
                
                <button
                  type="button"
                  className="btn-nav next"
                  onClick={handleNextQuestion}
                >
                  {currentQuestion === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'} <FaArrowRight />
                </button>
              </div>
            </div>
          ) : (
            <div className="quiz-results">
              <div className="results-header">
                <h4>Quiz Completed!</h4>
                <div className="score-display">
                  <div className="score-circle">
                    <span className="score-value">{score}%</span>
                  </div>
                </div>
              </div>

              <div className="results-details">
                <div className="result-stat">
                  <div className="stat-value">{totalQuestions}</div>
                  <div className="stat-label">Total Questions</div>
                </div>
                <div className="result-stat">
                  <div className="stat-value">
                    {Object.values(userAnswers).filter((answer, index) => 
                      answer === quiz.questions[index]?.answer
                    ).length}
                  </div>
                  <div className="stat-label">Correct Answers</div>
                </div>
                <div className="result-stat">
                  <div className="stat-value">
                    {Object.values(userAnswers).filter((answer, index) => 
                      answer !== quiz.questions[index]?.answer
                    ).length}
                  </div>
                  <div className="stat-label">Wrong Answers</div>
                </div>
              </div>

              {/* Review Answers */}
              <div className="answers-review">
                <h5>Review Your Answers:</h5>
                {quiz.questions?.map((question, index) => (
                  <div key={index} className="answer-review-item">
                    <div className="question-review">
                      <strong>Q{index + 1}:</strong> {question.question}
                    </div>
                    <div className="answer-review-details">
                      <div className={`user-answer ${
                        userAnswers[index] === question.answer ? 'correct' : 'wrong'
                      }`}>
                        <span>Your Answer: {userAnswers[index] || 'No answer'}</span>
                        {userAnswers[index] === question.answer ? (
                          <FaCheckCircle className="correct-icon" />
                        ) : (
                          <FaTimesCircle className="wrong-icon" />
                        )}
                      </div>
                      {userAnswers[index] !== question.answer && (
                        <div className="correct-answer">
                          Correct Answer: {question.answer}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-restart"
                onClick={resetQuiz}
              >
                Restart Preview
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizzesPreviewModal;
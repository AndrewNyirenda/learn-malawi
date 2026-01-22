// src/components/admin-componenents/QuizzesAddModal.jsx
import React, { useState, useEffect } from 'react';
import { useQuizzes } from '../../contexts/QuizzesContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaTimes,
  FaQuestionCircle,
  FaGraduationCap,
  FaUserGraduate,
  FaPlus,
  FaTrash,
  FaClock,
  FaBook,
  FaBrain,
  FaCheckCircle
} from 'react-icons/fa';
import '../../styles/Admin-Styles/QuizzesAdminModal.css';

const QuizzesAddModal = ({ onClose, onSave, quizToCopy = null }) => {
  const { createQuiz, loading, error, clearError } = useQuizzes();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'secondary',
    subject: '',
    difficulty: 'easy',
    class: '',
    questions: []
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize form with quiz to copy if provided
  useEffect(() => {
    if (quizToCopy) {
      setFormData({
        title: quizToCopy.title,
        description: quizToCopy.description || '',
        level: quizToCopy.level,
        subject: quizToCopy.subject,
        difficulty: quizToCopy.difficulty || 'easy',
        class: quizToCopy.class,
        questions: quizToCopy.questions?.map(q => ({
          question: q.question,
          options: [...q.options],
          answer: q.answer,
          timeLimit: q.timeLimit || 30
        })) || []
      });
    }
  }, [quizToCopy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (error) {
      clearError();
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].answer = answer;
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          options: ['', '', '', ''],
          answer: '',
          timeLimit: 30
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push('');
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    }

    if (formData.questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    } else {
      formData.questions.forEach((q, index) => {
        if (!q.question.trim()) {
          newErrors[`question_${index}`] = `Question ${index + 1} is required`;
        }
        if (!q.answer.trim()) {
          newErrors[`answer_${index}`] = `Question ${index + 1} needs an answer`;
        }
        if (q.options.filter(opt => opt.trim()).length < 2) {
          newErrors[`options_${index}`] = `Question ${index + 1} needs at least 2 options`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const quizData = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        subject: formData.subject,
        difficulty: formData.difficulty,
        class: formData.class,
        questions: formData.questions
      };

      const result = await createQuiz(quizData, token);

      if (result) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onSave();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error creating quiz:', err);
    }
  };

  // Calculate total time
  const calculateTotalTime = () => {
    return formData.questions.reduce((sum, q) => sum + (q.timeLimit || 0), 0);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaQuestionCircle /> {quizToCopy ? 'Duplicate Quiz' : 'Create New Quiz'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {submitSuccess ? (
          <div className="quiz-success">
            <div className="quiz-success-icon">
              <FaCheckCircle />
            </div>
            <h4>Quiz Created Successfully!</h4>
            <p>Your quiz is now ready for students to take.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="user-form">
            {error && (
              <div className="form-error">
                <span>{error}</span>
                <button onClick={clearError} className="close-error">
                  <FaTimes />
                </button>
              </div>
            )}

            {/* Basic Info */}
            <div className="form-group">
              <label htmlFor="title">Quiz Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="e.g., Mathematics Form 4 Quiz"
                disabled={loading}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the quiz..."
                disabled={loading}
                rows="3"
              />
            </div>

            {/* Quiz Settings */}
            <div className="quiz-settings">
              <div className="setting-group">
                <label>Education Level *</label>
                <div className="level-options">
                  <button
                    type="button"
                    className={`level-option ${formData.level === 'primary' ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'level', value: 'primary' } })}
                    disabled={loading}
                  >
                    <FaGraduationCap /> Primary
                  </button>
                  <button
                    type="button"
                    className={`level-option ${formData.level === 'secondary' ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'level', value: 'secondary' } })}
                    disabled={loading}
                  >
                    <FaUserGraduate /> Secondary
                  </button>
                </div>
              </div>

              <div className="setting-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? 'error' : ''}
                  placeholder="e.g., Mathematics"
                  disabled={loading}
                />
                {errors.subject && (
                  <span className="error-message">{errors.subject}</span>
                )}
              </div>

              <div className="setting-group">
                <label htmlFor="class">Class/Form *</label>
                <input
                  type="text"
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className={errors.class ? 'error' : ''}
                  placeholder="e.g., Form 4"
                  disabled={loading}
                />
                {errors.class && (
                  <span className="error-message">{errors.class}</span>
                )}
              </div>

              <div className="setting-group">
                <label>Difficulty Level *</label>
                <div className="difficulty-options">
                  <button
                    type="button"
                    className={`difficulty-option easy ${formData.difficulty === 'easy' ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'difficulty', value: 'easy' } })}
                    disabled={loading}
                  >
                    Easy
                  </button>
                  <button
                    type="button"
                    className={`difficulty-option medium ${formData.difficulty === 'medium' ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'difficulty', value: 'medium' } })}
                    disabled={loading}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    className={`difficulty-option hard ${formData.difficulty === 'hard' ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'difficulty', value: 'hard' } })}
                    disabled={loading}
                  >
                    Hard
                  </button>
                </div>
              </div>
            </div>

            {/* Question Statistics */}
            <div className="question-statistics">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{formData.questions.length}</div>
                  <div className="stat-label">Questions</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{calculateTotalTime()}s</div>
                  <div className="stat-label">Total Time</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {formData.questions.length > 0 
                      ? Math.round(calculateTotalTime() / formData.questions.length) 
                      : 0}s
                  </div>
                  <div className="stat-label">Avg per Question</div>
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <h4>Questions ({formData.questions.length})</h4>
            {errors.questions && (
              <span className="error-message">{errors.questions}</span>
            )}

            {formData.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="question-item">
                <div className="question-header">
                  <div className="question-number">
                    Question {questionIndex + 1}
                  </div>
                  <button
                    type="button"
                    className="remove-question-btn"
                    onClick={() => removeQuestion(questionIndex)}
                    disabled={loading}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>

                {errors[`question_${questionIndex}`] && (
                  <span className="error-message">
                    {errors[`question_${questionIndex}`]}
                  </span>
                )}

                <div className="question-content">
                  <textarea
                    placeholder="Enter your question here..."
                    value={question.question}
                    onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                    disabled={loading}
                    rows="3"
                  />
                </div>

                {/* Options */}
                <div className="options-list">
                  <label>Options *</label>
                  {errors[`options_${questionIndex}`] && (
                    <span className="error-message">
                      {errors[`options_${questionIndex}`]}
                    </span>
                  )}
                  
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex} 
                      className={`option-item ${question.answer === option ? 'selected' : ''}`}
                    >
                      <div className="option-letter">
                        {String.fromCharCode(65 + optionIndex)}
                      </div>
                      <div className="option-text">
                        <input
                          type="text"
                          placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                          value={option}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <button
                        type="button"
                        className="select-option-btn"
                        onClick={() => handleAnswerSelect(questionIndex, option)}
                        disabled={loading || !option.trim()}
                      >
                        {question.answer === option ? 'Selected ✓' : 'Select as Answer'}
                      </button>
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          className="remove-question-btn small"
                          onClick={() => removeOption(questionIndex, optionIndex)}
                          disabled={loading}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="add-question-btn small"
                    onClick={() => addOption(questionIndex)}
                    disabled={loading || question.options.length >= 6}
                  >
                    <FaPlus /> Add Option
                  </button>
                </div>

                {/* Time Limit */}
                <div className="time-limit-input">
                  <label>Time Limit (seconds):</label>
                  <input
                    type="number"
                    className="time-input"
                    min="10"
                    max="300"
                    value={question.timeLimit}
                    onChange={(e) => handleQuestionChange(questionIndex, 'timeLimit', parseInt(e.target.value) || 30)}
                    disabled={loading}
                  />
                  <span className="time-unit">seconds</span>
                </div>

                {errors[`answer_${questionIndex}`] && (
                  <div className="error-message">
                    {errors[`answer_${questionIndex}`]}
                  </div>
                )}
              </div>
            ))}

            {/* Add Question Button */}
            <button
              type="button"
              className="add-question-btn"
              onClick={addQuestion}
              disabled={loading}
            >
              <FaPlus /> Add Question
            </button>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading || formData.questions.length === 0}
              >
                {loading ? 'Creating...' : quizToCopy ? 'Duplicate Quiz' : 'Create Quiz'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuizzesAddModal;
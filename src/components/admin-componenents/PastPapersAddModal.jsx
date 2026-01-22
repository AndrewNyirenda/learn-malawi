// src/components/admin-componenents/PastPapersAddModal.jsx
import React, { useState } from 'react';
import { usePastPapers } from '../../contexts/PastPapersContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaTimes,
  FaFileAlt,
  FaGraduationCap,
  FaUserGraduate,
  FaCalendar,
  FaUniversity,
  FaBook,
  FaHashtag
} from 'react-icons/fa';
import '../../styles/Admin-Styles/PastPapersAdminModal.css';

const PastPapersAddModal = ({ onClose, onSave }) => {
  const { createPastPaper, categories, classes, years, examinationBodies, loading, error, clearError } = usePastPapers();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'secondary',
    category: '',
    class: '',
    year: new Date().getFullYear(),
    subject: '',
    examinationBody: '',
    paperNumber: '',
    paperType: 'Question'
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.class) {
      newErrors.class = 'Class is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    if (!formData.examinationBody) {
      newErrors.examinationBody = 'Examination body is required';
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
      const pastPaperData = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        category: formData.category,
        class: formData.class,
        year: parseInt(formData.year),
        subject: formData.subject,
        examinationBody: formData.examinationBody,
        paperNumber: formData.paperNumber,
        paperType: formData.paperType
      };

      const result = await createPastPaper(pastPaperData, token);

      if (result?.success || result) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onSave();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error creating past paper:', err);
    }
  };

  const getAvailableClasses = () => {
    return classes.map(cls => cls.class);
  };

  const getAvailableCategories = () => {
    return categories.map(cat => cat.category);
  };

  const getAvailableExaminationBodies = () => {
    return examinationBodies.map(eb => eb.examinationBody);
  };

  // Generate year options (last 20 years)
  const yearOptions = Array.from({ length: 21 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { year: year.toString(), count: 0 };
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaFileAlt /> Add New Past Paper
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {submitSuccess ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h4>Past Paper Created Successfully!</h4>
            <p>You can now upload the PDF file for this past paper.</p>
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

            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="e.g., Mathematics Form 4 2024 Paper I"
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
                placeholder="Brief description of the past paper..."
                disabled={loading}
                rows="3"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e1e5eb',
                  borderRadius: '8px',
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: '#f8fafc',
                  color: '#333',
                  resize: 'vertical'
                }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="level">Education Level *</label>
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

              <div className="form-group">
                <label htmlFor="year">Year *</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={errors.year ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Select Year</option>
                  {yearOptions.map(year => (
                    <option key={year.year} value={year.year}>
                      {year.year}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <span className="error-message">{errors.year}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {getAvailableCategories().map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="error-message">{errors.category}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="class">Class/Form *</label>
                <select
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className={errors.class ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Select Class</option>
                  {getAvailableClasses().map(cls => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                {errors.class && (
                  <span className="error-message">{errors.class}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="examinationBody">Examination Body *</label>
                <select
                  id="examinationBody"
                  name="examinationBody"
                  value={formData.examinationBody}
                  onChange={handleChange}
                  className={errors.examinationBody ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Select Exam Body</option>
                  {getAvailableExaminationBodies().map(eb => (
                    <option key={eb} value={eb}>
                      {eb}
                    </option>
                  ))}
                </select>
                {errors.examinationBody && (
                  <span className="error-message">{errors.examinationBody}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics, Physics, etc."
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="paperNumber">Paper Number</label>
                <div className="paper-number-options">
                  <button
                    type="button"
                    className={`paper-option ${formData.paperNumber === 'I' ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'paperNumber', value: 'I' } })}
                    disabled={loading}
                  >
                    I
                  </button>
                  <button
                    type="button"
                    className={`paper-option ${formData.paperNumber === 'II' ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'paperNumber', value: 'II' } })}
                    disabled={loading}
                  >
                    II
                  </button>
                  <button
                    type="button"
                    className={`paper-option ${formData.paperNumber === 'III' ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'paperNumber', value: 'III' } })}
                    disabled={loading}
                  >
                    III
                  </button>
                  <button
                    type="button"
                    className={`paper-option ${formData.paperNumber === 'IV' ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'paperNumber', value: 'IV' } })}
                    disabled={loading}
                  >
                    IV
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="paperType">Paper Type</label>
                <select
                  id="paperType"
                  name="paperType"
                  value={formData.paperType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Question">Question Paper</option>
                  <option value="Answer">Answer Key</option>
                  <option value="Both">Both Questions & Answers</option>
                </select>
              </div>
            </div>

            <div className="upload-note">
              <p>
                <strong>Note:</strong> After creating this past paper, you'll be able to upload the PDF file.
                You can upload multiple file types (PDF, DOC, PPT, TXT).
              </p>
            </div>

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
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Past Paper'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PastPapersAddModal;
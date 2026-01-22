// src/components/admin-componenents/StudyNotesAddModal.jsx
import React, { useState } from 'react';
import { useStudyNotes } from '../../contexts/StudyNotesContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaTimes,
  FaBook,
  FaGraduationCap,
  FaUserGraduate,
  FaCalendar,
  FaUser,
  FaBuilding
} from 'react-icons/fa';
import '../../styles/Admin-Styles/UserModals.css';

const StudyNotesAddModal = ({ onClose, onSave }) => {
  const { createBook, categories, classes, loading, error, clearError } = useStudyNotes();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'secondary',
    category: '',
    class: '',
    subject: '',
    author: '',
    publisher: '',
    year: new Date().getFullYear()
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
      const bookData = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        category: formData.category,
        class: formData.class,
        subject: formData.subject,
        author: formData.author,
        publisher: formData.publisher,
        year: formData.year ? parseInt(formData.year) : undefined
      };

      const result = await createBook(bookData, token);

      if (result?.success || result) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onSave();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error creating book:', err);
    }
  };

  const getAvailableClasses = () => {
    return classes.map(cls => cls.class);
  };

  const getAvailableCategories = () => {
    return categories.map(cat => cat.category);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaBook /> Add New Study Note
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {submitSuccess ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h4>Study Note Created Successfully!</h4>
            <p>You can now upload the PDF file for this note.</p>
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
                placeholder="e.g., Mathematics Form 4 Notes"
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
                placeholder="Brief description of the study material..."
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
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="2000"
                  max={new Date().getFullYear()}
                  placeholder="e.g., 2024"
                  disabled={loading}
                />
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

              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author's name"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="publisher">Publisher/Institution</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Publisher or school name"
                disabled={loading}
              />
            </div>

            <div className="upload-note">
              <p>
                <strong>Note:</strong> After creating this study note, you'll be able to upload the PDF file.
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
                {loading ? 'Creating...' : 'Create Study Note'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudyNotesAddModal;
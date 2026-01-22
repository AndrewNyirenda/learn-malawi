// src/components/admin-componenents/StudyNotesEditModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaBook, FaFilePdf, FaDownload, FaEye } from 'react-icons/fa';
import '../../styles/Admin-Styles/UserModals.css';

const StudyNotesEditModal = ({ book, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    class: '',
    subject: '',
    author: '',
    publisher: '',
    year: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        description: book.description || '',
        category: book.category || '',
        class: book.class || '',
        subject: book.subject || '',
        author: book.author || '',
        publisher: book.publisher || '',
        year: book.year || ''
      });
    }
  }, [book]);

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

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error updating book:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaBook /> Edit Study Note
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {submitSuccess ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h4>Study Note Updated Successfully!</h4>
            <p>The study note has been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="user-form">
            <div className="user-info-summary">
              <div className="user-avatar-large">
                <FaBook />
              </div>
              <div className="user-details">
                <h4>{book.title}</h4>
                <p className="user-email">
                  <span className="detail-label">Category:</span> {book.category}
                </p>
                <p className="user-role">
                  <span className="detail-label">Class:</span> {book.class}
                  {book.subject && (
                    <span className="detail-label"> • Subject: {book.subject}</span>
                  )}
                </p>
                <div className="book-stats">
                  <span className="stat-item">
                    <FaEye /> {book.viewCount || 0} views
                  </span>
                  <span className="stat-item">
                    <FaDownload /> {book.downloadCount || 0} downloads
                  </span>
                </div>
              </div>
            </div>

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
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Computer">Computer</option>
                  <option value="Literature">Literature</option>
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
                  {book.level === 'primary' ? (
                    <>
                      <option value="Standard 5">Standard 5</option>
                      <option value="Standard 6">Standard 6</option>
                      <option value="Standard 7">Standard 7</option>
                      <option value="Standard 8">Standard 8</option>
                    </>
                  ) : (
                    <>
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                    </>
                  )}
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
            </div>

            <div className="file-info">
              <h4>File Information</h4>
              {book.fileUrl ? (
                <div className="file-details">
                  <FaFilePdf className="file-icon" />
                  <div>
                    <p><strong>File:</strong> {book.fileName || book.title}</p>
                    <p><strong>Uploaded:</strong> {formatDate(book.createdAt)}</p>
                    <div className="file-actions">
                      <button
                        type="button"
                        className="btn-action small"
                        onClick={() => window.open(book.fileUrl, '_blank')}
                      >
                        <FaEye /> View
                      </button>
                      <button
                        type="button"
                        className="btn-action small"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = book.fileUrl;
                          link.download = book.fileName || book.title;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <FaDownload /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="no-file">No PDF file uploaded yet.</p>
              )}
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
                {loading ? 'Updating...' : 'Update Study Note'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudyNotesEditModal;
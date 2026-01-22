// src/components/admin-componenents/PastPapersEditModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaFileAlt, FaFilePdf, FaDownload, FaEye, FaCalendarAlt, FaUniversity } from 'react-icons/fa';
import '../../styles/Admin-Styles/PastPapersAdminModal.css';

const PastPapersEditModal = ({ paper, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    class: '',
    year: '',
    subject: '',
    examinationBody: '',
    paperNumber: '',
    paperType: 'Question'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (paper) {
      setFormData({
        title: paper.title || '',
        description: paper.description || '',
        category: paper.category || '',
        class: paper.class || '',
        year: paper.year || '',
        subject: paper.subject || '',
        examinationBody: paper.examinationBody || '',
        paperNumber: paper.paperNumber || '',
        paperType: paper.paperType || 'Question'
      });
    }
  }, [paper]);

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
      console.error('Error updating past paper:', err);
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

  if (!paper) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaFileAlt /> Edit Past Paper
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {submitSuccess ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h4>Past Paper Updated Successfully!</h4>
            <p>The past paper has been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="user-form">
            <div className="user-info-summary">
              <div className="user-avatar-large">
                <FaFileAlt />
              </div>
              <div className="user-details">
                <h4>{paper.title}</h4>
                <p className="user-email">
                  <span className="detail-label">Category:</span> {paper.category}
                </p>
                <p className="user-role">
                  <span className="detail-label">Year:</span> {paper.year} • 
                  <span className="detail-label"> Class:</span> {paper.class}
                  {paper.subject && (
                    <span className="detail-label"> • Subject: {paper.subject}</span>
                  )}
                </p>
                <div className="book-stats">
                  <span className="stat-item">
                    <FaEye /> {paper.viewCount || 0} views
                  </span>
                  <span className="stat-item">
                    <FaDownload /> {paper.downloadCount || 0} downloads
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
                  {paper.level === 'primary' ? (
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
                  {Array.from({ length: 21 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                {errors.year && (
                  <span className="error-message">{errors.year}</span>
                )}
              </div>

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
                  <option value="MANEB">MANEB</option>
                  <option value="CEED">CEED</option>
                  <option value="ECZ">ECZ</option>
                  <option value="KNEC">KNEC</option>
                  <option value="UNEB">UNEB</option>
                  <option value="Other">Other</option>
                </select>
                {errors.examinationBody && (
                  <span className="error-message">{errors.examinationBody}</span>
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
                <label htmlFor="paperNumber">Paper Number</label>
                <div className="paper-number-options">
                  {['I', 'II', 'III', 'IV', 'V'].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`paper-option ${formData.paperNumber === num ? 'active' : ''}`}
                      onClick={() => handleChange({ target: { name: 'paperNumber', value: num } })}
                      disabled={loading}
                    >
                      {num}
                    </button>
                  ))}
                </div>
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

            <div className="file-info">
              <h4>File Information</h4>
              {paper.fileUrl ? (
                <div className="file-details">
                  <FaFilePdf className="file-icon" />
                  <div>
                    <p><strong>File:</strong> {paper.fileName || paper.title}</p>
                    <p><strong>Uploaded:</strong> {formatDate(paper.createdAt)}</p>
                    <div className="file-actions">
                      <button
                        type="button"
                        className="btn-action small"
                        onClick={() => window.open(paper.fileUrl, '_blank')}
                      >
                        <FaEye /> View
                      </button>
                      <button
                        type="button"
                        className="btn-action small"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = paper.fileUrl;
                          link.download = paper.fileName || paper.title;
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
                {loading ? 'Updating...' : 'Update Past Paper'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PastPapersEditModal;
// src/components/admin-components/CareerResourceEditModal.jsx
import React, { useState, useEffect } from 'react';
import { useCareerResources } from '../../contexts/CareerResourcesContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaTimes,
  FaEdit,
  FaBullseye,
  FaFileAlt,
  FaComments,
  FaUsers,
  FaClock,
  FaCompass,
  FaRocket,
  FaLink,
  FaSave,
  FaCheckCircle
} from 'react-icons/fa';
import '../../styles/Admin-Styles/CareerResourceAdminModal.css';

const CareerResourceEditModal = ({ resource, onClose, onSave }) => {
  const { updateCareerResource, loading, error, clearError } = useCareerResources();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    icon: 'FaLink'
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Available icons
  const availableIcons = [
    { value: 'FaBullseye', label: 'Target', icon: <FaBullseye /> },
    { value: 'FaFileAlt', label: 'Document', icon: <FaFileAlt /> },
    { value: 'FaComments', label: 'Chat', icon: <FaComments /> },
    { value: 'FaUsers', label: 'Users', icon: <FaUsers /> },
    { value: 'FaClock', label: 'Clock', icon: <FaClock /> },
    { value: 'FaCompass', label: 'Compass', icon: <FaCompass /> },
    { value: 'FaRocket', label: 'Rocket', icon: <FaRocket /> },
    { value: 'FaLink', label: 'Link', icon: <FaLink /> }
  ];

  // Initialize form with resource data
  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title || '',
        description: resource.description || '',
        link: resource.link || '',
        icon: resource.icon || 'FaLink'
      });
    }
  }, [resource]);

  // Handle form input changes
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

  // Handle icon selection
  const handleIconSelect = (iconValue) => {
    setFormData(prev => ({ ...prev, icon: iconValue }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Link is required';
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      
      const resourceData = {
        title: formData.title,
        description: formData.description,
        link: formData.link,
        icon: formData.icon
      };

      await updateCareerResource(resource.id, resourceData, token);
      
      setSubmitSuccess(true);
      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error updating career resource:', err);
      setErrors(prev => ({ 
        ...prev, 
        submit: err.message || 'Failed to update career resource' 
      }));
    }
  };

  if (!resource) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content resource-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaEdit /> Edit Career Resource: {resource.title}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {submitSuccess ? (
          <div className="resource-success">
            <div className="resource-success-icon">
              <FaCheckCircle />
            </div>
            <h4>Career Resource Updated Successfully!</h4>
            <p>Your changes have been saved.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="resource-form">
            {error && (
              <div className="form-error">
                <span>{error}</span>
                <button onClick={clearError} className="close-error">
                  <FaTimes />
                </button>
              </div>
            )}

            {errors.submit && (
              <div className="form-error">
                <span>{errors.submit}</span>
                <button onClick={() => setErrors(prev => ({ ...prev, submit: '' }))} className="close-error">
                  <FaTimes />
                </button>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="Enter resource title"
                disabled={loading}
                maxLength={255}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
                placeholder="Provide a brief description of the resource..."
                disabled={loading}
                rows="4"
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            {/* Link */}
            <div className="form-group">
              <label htmlFor="link">Link *</label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className={errors.link ? 'error' : ''}
                placeholder="https://example.com/resource"
                disabled={loading}
              />
              {errors.link && (
                <span className="error-message">{errors.link}</span>
              )}
            </div>

            {/* Icon Selection */}
            <div className="form-group">
              <label>Select Icon *</label>
              <div className="icon-selector">
                {availableIcons.map((icon) => (
                  <button
                    key={icon.value}
                    type="button"
                    className={`icon-option ${formData.icon === icon.value ? 'selected' : ''}`}
                    onClick={() => handleIconSelect(icon.value)}
                    disabled={loading}
                    title={icon.label}
                  >
                    <div className="icon-preview">
                      {icon.icon}
                    </div>
                    <span>{icon.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="resource-preview">
              <h4>Preview</h4>
              <div className="preview-card">
                <div className="preview-icon">
                  {availableIcons.find(icon => icon.value === formData.icon)?.icon || <FaLink />}
                </div>
                <div className="preview-content">
                  <h5 className="preview-title">{formData.title || 'Your Resource Title'}</h5>
                  <p className="preview-description">
                    {formData.description || 'Resource description will appear here...'}
                  </p>
                  <div className="preview-link">
                    <FaLink />
                    <span>{formData.link || 'https://example.com'}</span>
                  </div>
                </div>
              </div>
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
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CareerResourceEditModal;
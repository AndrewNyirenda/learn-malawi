// src/components/admin-componenents/TutorialsEditModal.jsx
import React, { useState, useEffect } from 'react';
import { useTutorials } from '../../contexts/TutorialsContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaTimes,
  FaPlay,
  FaGraduationCap,
  FaUserGraduate,
  FaBook,
  FaVideo,
  FaYoutube,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSave
} from 'react-icons/fa';
import '../../styles/Admin-Styles/TutorialsAdminModal.css';

const TutorialsEditModal = ({ tutorial, onClose, onSave }) => {
  const { updateTutorial, loading, error, clearError } = useTutorials();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'secondary',
    subject: '',
    class: '',
    videoUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);

  // Initialize form with tutorial data
  useEffect(() => {
    if (tutorial) {
      setFormData({
        title: tutorial.title || '',
        description: tutorial.description || '',
        level: tutorial.level || 'secondary',
        subject: tutorial.subject || '',
        class: tutorial.class || '',
        videoUrl: tutorial.videoUrl || ''
      });
      
      if (tutorial.videoUrl) {
        generateVideoPreview(tutorial.videoUrl);
      }
    }
  }, [tutorial]);

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

    // Generate video preview for video URLs
    if (name === 'videoUrl' && value) {
      generateVideoPreview(value);
    }
  };

  const generateVideoPreview = (url) => {
    // Check if it's a YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (youtubeRegex.test(url)) {
      // Extract video ID from YouTube URL
      const videoId = extractYouTubeId(url);
      if (videoId) {
        setVideoPreview({
          type: 'youtube',
          videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        });
        return;
      }
    }
    
    // For other video URLs, show generic preview
    setVideoPreview({
      type: 'generic',
      url: url
    });
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    }

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required';
    } else if (!isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid video URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const tutorialData = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        subject: formData.subject,
        class: formData.class,
        videoUrl: formData.videoUrl
      };

      console.log('Updating tutorial with data:', tutorialData);
      
      const result = await updateTutorial(tutorial.id, tutorialData, token);

      if (result) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onSave();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error updating tutorial:', err);
    }
  };

  if (!tutorial) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaPlay /> Edit Tutorial: {tutorial.title}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {submitSuccess ? (
          <div className="tutorial-success">
            <div className="tutorial-success-icon">
              <FaCheckCircle />
            </div>
            <h4>Tutorial Updated Successfully!</h4>
            <p>Your changes have been saved.</p>
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
              <label htmlFor="title">Tutorial Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="e.g., Introduction to Algebra"
                disabled={loading}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
                placeholder="Detailed description of the tutorial content..."
                disabled={loading}
                rows="4"
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            {/* Level Selection */}
            <div className="form-group">
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

            {/* Subject and Class */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? 'error' : ''}
                  placeholder="e.g., Mathematics, Physics, English"
                  disabled={loading}
                />
                {errors.subject && (
                  <span className="error-message">{errors.subject}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="class">Class/Form *</label>
                <input
                  type="text"
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className={errors.class ? 'error' : ''}
                  placeholder="e.g., Form 4, Standard 8"
                  disabled={loading}
                />
                {errors.class && (
                  <span className="error-message">{errors.class}</span>
                )}
              </div>
            </div>

            {/* Video URL */}
            <div className="form-group">
              <label htmlFor="videoUrl">Video URL *</label>
              <div className="video-url-input">
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className={errors.videoUrl ? 'error' : ''}
                  placeholder="https://www.youtube.com/watch?v=..."
                  disabled={loading}
                />
                {errors.videoUrl && (
                  <span className="error-message">{errors.videoUrl}</span>
                )}
                
                {/* Video Preview */}
                {formData.videoUrl && (
                  <div className="video-preview-container">
                    <div className="video-preview">
                      {videoPreview?.type === 'youtube' ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                          <FaYoutube style={{ fontSize: '3rem', color: '#ff0000', marginBottom: '10px' }} />
                          <p>YouTube Video Detected</p>
                          <small>Video ID: {videoPreview.videoId}</small>
                          {videoPreview.thumbnail && (
                            <div style={{ marginTop: '10px' }}>
                              <img 
                                src={videoPreview.thumbnail} 
                                alt="Video thumbnail" 
                                style={{ width: '120px', borderRadius: '4px' }}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="video-preview-placeholder">
                          <FaVideo />
                          <p>Video URL Added</p>
                          <small>Preview will be available after saving</small>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* URL Help Text */}
                <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#666' }}>
                  <FaExclamationTriangle style={{ marginRight: '5px' }} />
                  Supported: YouTube, Vimeo, or direct video URLs
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="tutorial-preview">
              <h4>Preview</h4>
              <div className="preview-header">
                <div>
                  <div className="preview-tutorial-title">
                    {formData.title || 'Your Tutorial Title'}
                  </div>
                  <div className="preview-meta">
                    <span className="preview-meta-item level">
                      {formData.level === 'primary' ? 'Primary' : 'Secondary'}
                    </span>
                    <span className="preview-meta-item subject">
                      {formData.subject || 'Subject'}
                    </span>
                    <span className="preview-meta-item class">
                      {formData.class || 'Class'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="preview-description">
                {formData.description || 'Tutorial description will appear here...'}
              </div>
              {formData.videoUrl && (
                <div style={{ marginTop: '15px' }}>
                  <a 
                    href={formData.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="preview-video-link"
                  >
                    <FaPlay /> Watch Tutorial
                  </a>
                </div>
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
                {loading ? 'Saving...' : (
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

export default TutorialsEditModal;
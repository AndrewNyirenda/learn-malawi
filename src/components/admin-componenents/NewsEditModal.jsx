// src/components/admin-componenents/NewsEditModal.jsx
import React, { useState, useEffect } from 'react';
import { useNews } from '../../contexts/NewsContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaTimes,
  FaNewspaper,
  FaImage,
  FaCalendar,
  FaClock,
  FaUser,
  FaSave,
  FaCheckCircle,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaLink,
  FaHeading,
  FaParagraph,
  FaTrash
} from 'react-icons/fa';
import '../../styles/Admin-Styles/NewsAdminModal.css';

const NewsEditModal = ({ article, onClose, onSave }) => {
  const { updateNews, uploadImage, deleteImage, loading, error, clearError } = useNews();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Local',
    readTime: 5,
    isPublished: false
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(article?.imageUrl || null);
  const [deletingImage, setDeletingImage] = useState(false);

  // Initialize form with article data
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        description: article.description || '',
        content: article.content || '',
        category: article.category || 'Local',
        readTime: article.readTime || 5,
        isPublished: article.isPublished || false
      });
      setImagePreview(article.imageUrl || null);
    }
  }, [article]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }

    setImageFile(file);
    setErrors(prev => ({ ...prev, image: '' }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove or delete image
  const handleRemoveImage = async () => {
    if (article?.imageUrl) {
      // Delete image from server
      setDeletingImage(true);
      try {
        const token = localStorage.getItem('accessToken');
        await deleteImage(article.id, token);
        setImagePreview(null);
      } catch (err) {
        console.error('Error deleting image:', err);
      } finally {
        setDeletingImage(false);
      }
    } else {
      // Remove new image
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // Handle content formatting
  const handleFormatContent = (format) => {
    const textarea = document.getElementById('content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'heading':
        formattedText = `# ${selectedText}`;
        break;
      case 'bullet':
        formattedText = `- ${selectedText}`;
        break;
      case 'number':
        formattedText = `1. ${selectedText}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = formData.content.substring(0, start) + 
                      formattedText + 
                      formData.content.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
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

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');
    
    // Prepare update data - only send fields that changed
    const newsData = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      category: formData.category,
      readTime: parseInt(formData.readTime),
      isPublished: formData.isPublished
    };

    // First update the news article
    await updateNews(article.id, newsData, token);

    // Then upload new image if exists (after the article is updated)
    if (imageFile) {
      await uploadImage(article.id, imageFile, token);
    }

    setSubmitSuccess(true);
    setTimeout(() => {
      onSave();
      onClose();
    }, 1500);
  } catch (err) {
    console.error('Error updating news:', err);
    setErrors(prev => ({ 
      ...prev, 
      submit: err.message || 'Failed to update news article' 
    }));
  }
};

  // Available categories
  const categories = [
    'Politics', 'Business', 'Technology', 'Sports', 'Entertainment',
    'Health', 'Education', 'Science', 'World', 'Local'
  ];

  if (!article) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content news-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaNewspaper /> Edit News: {article.title}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {submitSuccess ? (
          <div className="news-success">
            <div className="news-success-icon">
              <FaCheckCircle />
            </div>
            <h4>News Article Updated Successfully!</h4>
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
                placeholder="Enter news article title"
                disabled={loading}
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
                placeholder="Brief description of the news article"
                disabled={loading}
                rows="3"
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category *</label>
              <div className="category-selector">
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    className={`category-option ${formData.category === category ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(category)}
                    disabled={loading}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="form-group">
              <label htmlFor="content">Content *</label>
              
              {/* Editor Toolbar */}
              <div className="editor-toolbar">
                <button
                  type="button"
                  className="editor-btn"
                  onClick={() => handleFormatContent('heading')}
                  title="Heading"
                >
                  <FaHeading />
                </button>
                <button
                  type="button"
                  className="editor-btn"
                  onClick={() => handleFormatContent('bold')}
                  title="Bold"
                >
                  <FaBold />
                </button>
                <button
                  type="button"
                  className="editor-btn"
                  onClick={() => handleFormatContent('italic')}
                  title="Italic"
                >
                  <FaItalic />
                </button>
                <button
                  type="button"
                  className="editor-btn"
                  onClick={() => handleFormatContent('bullet')}
                  title="Bullet List"
                >
                  <FaListUl />
                </button>
                <button
                  type="button"
                  className="editor-btn"
                  onClick={() => handleFormatContent('number')}
                  title="Numbered List"
                >
                  <FaListOl />
                </button>
                <button
                  type="button"
                  className="editor-btn"
                  onClick={() => handleFormatContent('quote')}
                  title="Quote"
                >
                  <FaQuoteLeft />
                </button>
              </div>

              {/* Editor Content */}
              <div className="rich-text-editor">
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className={errors.content ? 'error' : ''}
                  placeholder="Write your news article content here..."
                  disabled={loading}
                  rows="10"
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: 'none',
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    resize: 'vertical',
                    minHeight: '300px'
                  }}
                />
                {errors.content && (
                  <span className="error-message">{errors.content}</span>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label>Featured Image</label>
              
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
               <button
  type="button"
  className="remove-image"
  onClick={handleRemoveImage}
  disabled={loading || deletingImage}
>
  {deletingImage ? 'Deleting...' : (
    <>
      <FaTrash /> Remove Image
    </>
  )}
</button>
                </div>
              ) : (
                <div className="image-upload-area" onClick={() => document.getElementById('imageUpload').click()}>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                  <FaImage className="image-upload-icon" />
                  <p className="image-upload-text">Click to upload featured image</p>
                  <p className="image-upload-hint">JPG, PNG, GIF, WebP (Max 5MB)</p>
                </div>
              )}
              
              {errors.image && (
                <span className="error-message">{errors.image}</span>
              )}
            </div>

            {/* Read Time & Publish Status */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="readTime">Read Time (minutes)</label>
                <div className="read-time-input">
                  <input
                    type="range"
                    id="readTime"
                    name="readTime"
                    min="1"
                    max="30"
                    value={formData.readTime}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="read-time-value">{formData.readTime}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Publish Status</label>
                <div className="status-toggle-group">
                  <button
                    type="button"
                    className={`status-toggle-btn ${!formData.isPublished ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, isPublished: false }))}
                    disabled={loading}
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    className={`status-toggle-btn ${formData.isPublished ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, isPublished: true }))}
                    disabled={loading}
                  >
                    {article.isPublished ? 'Update Published' : 'Publish Now'}
                  </button>
                </div>
                
                {article.publishedAt && (
                  <div className="published-date">
                    <p>
                      <strong>Originally published:</strong> {new Date(article.publishedAt).toLocaleDateString()}
                    </p>
                    <p>
                      {formData.isPublished && !article.isPublished ? 
                        'Will be published now' :
                        'Will update published date'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="news-preview">
              <h4>Preview</h4>
              <div className="preview-news-header">
                <h5 className="preview-news-title">{formData.title || 'Your News Title'}</h5>
                <div className="preview-news-meta">
                  <span className="preview-meta-item">
                    <FaCalendar /> {formData.isPublished ? 'Now' : 'Draft'}
                  </span>
                  <span className="preview-meta-item">
                    <FaClock /> {formData.readTime || 5} min read
                  </span>
                  <span className="preview-meta-item">
                    <FaUser /> {article.author?.firstName || user?.firstName || 'Author'}
                  </span>
                </div>
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="preview-news-image" />
              )}
              <div className="preview-news-content">
                {formData.description || 'News description will appear here...'}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={loading || deletingImage}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading || deletingImage}
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

export default NewsEditModal;
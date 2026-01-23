// src/components/admin-componenents/StudyNotesUploadModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  FaTimes, 
  FaUpload, 
  FaFilePdf, 
  FaImage, 
  FaCheck, 
  FaTimesCircle,
  FaBook,
  FaEye,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import { useStudyNotes } from '../../contexts/StudyNotesContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import '../../styles/Admin-Styles/UserModals.css';

const API_BASE_URL = 'http://localhost:3000';

const StudyNotesUploadModal = ({ book, onClose, onSave }) => {
  // Remove setBooks from destructuring since it's not exposed in context
  const { uploadBookFile, uploadThumbnail } = useStudyNotes();
  const { getToken } = useAuth();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [uploadType, setUploadType] = useState('pdf'); // 'pdf' or 'thumbnail'
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (uploadType === 'pdf') {
      // Validate PDF file
      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'application/vnd.ms-powerpoint',
                           'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                           'text/plain'];
      
      const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension) && !allowedTypes.includes(file.type)) {
        setError('Please select a PDF, Word, PowerPoint, or text file (PDF, DOC, DOCX, PPT, PPTX, TXT).');
        return;
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError('File size must be less than 50MB.');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Generate preview URL for PDF only
      if (file.type === 'application/pdf' || fileExtension === '.pdf') {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl('');
      }
    } else {
      // Validate image file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a JPEG, PNG, GIF, or WebP image.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB.');
        return;
      }

      setSelectedThumbnail(file);
      setError('');

      // Generate thumbnail preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (uploadType === 'pdf' && !selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    if (uploadType === 'thumbnail' && !selectedThumbnail) {
      setError('Please select a thumbnail image.');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Get token directly from localStorage instead of useAuth
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      if (uploadType === 'pdf') {
        // Upload PDF file using the context function
        await uploadBookFile(book.id, selectedFile, token);
      } else {
        // For thumbnail upload, use the new context function
        await uploadThumbnail(book.id, selectedThumbnail, token);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      
      // Wait a moment to show success, then close
      setTimeout(() => {
        if (onSave) onSave();
        onClose();
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = (type) => {
    setUploadType(type);
    if (type === 'pdf') {
      fileInputRef.current?.click();
    } else {
      thumbnailInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    
    if (type === 'pdf') {
      setUploadType('pdf');
      const inputEvent = { target: { files: [droppedFile] } };
      handleFileChange(inputEvent);
    } else {
      setUploadType('thumbnail');
      const inputEvent = { target: { files: [droppedFile] } };
      handleFileChange(inputEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaUpload /> Upload Files for "{book?.title}"
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {uploadSuccess ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h4>Upload Successful!</h4>
            <p>File has been uploaded successfully.</p>
            <div className="progress-bar" style={{ marginTop: '20px' }}>
              <div className="progress-fill" style={{ width: '100%', background: '#28a745' }}></div>
            </div>
          </div>
        ) : (
          <div className="user-form">
            <div className="book-info-summary">
              <div className="user-avatar-large">
                <FaBook />
              </div>
              <div className="user-details">
                <h4>{book?.title}</h4>
                <p className="user-email">
                  <strong>Category:</strong> {book?.category}
                </p>
                <p className="user-role">
                  <strong>Class:</strong> {book?.class}
                  {book?.subject && <span> • <strong>Subject:</strong> {book?.subject}</span>}
                </p>
                {book?.author && <p><strong>Author:</strong> {book.author}</p>}
              </div>
            </div>

            {error && (
              <div className="form-error">
                <FaTimesCircle />
                <span>{error}</span>
                <button onClick={() => setError('')} className="close-error">
                  <FaTimes />
                </button>
              </div>
            )}

            {/* Upload Progress */}
            {loading && (
              <div className="upload-progress-container">
                <div className="progress-info">
                  <span>Uploading... {uploadProgress}%</span>
                  <span>
                    {uploadType === 'pdf' 
                      ? selectedFile?.name 
                      : selectedThumbnail?.name}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Upload Type Selector */}
            <div className="upload-type-selector">
              <button
                type="button"
                className={`upload-type-btn ${uploadType === 'pdf' ? 'active' : ''}`}
                onClick={() => setUploadType('pdf')}
                disabled={loading}
              >
                <FaFilePdf /> PDF/File
              </button>
              <button
                type="button"
                className={`upload-type-btn ${uploadType === 'thumbnail' ? 'active' : ''}`}
                onClick={() => setUploadType('thumbnail')}
                disabled={loading}
              >
                <FaImage /> Thumbnail
              </button>
            </div>

            {/* PDF Upload Section */}
            {uploadType === 'pdf' && (
              <div className="upload-section">
                <div className="upload-instructions">
                  <h4>
                    <FaFilePdf /> Upload Study Material
                  </h4>
                  <p>
                    Upload PDF, Word, PowerPoint, or text files (max 50MB).
                    Supported formats: .pdf, .doc, .docx, .ppt, .pptx, .txt
                  </p>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  style={{ display: 'none' }}
                  disabled={loading}
                />

                {selectedFile ? (
                  <div className="file-preview">
                    <div className="file-info">
                      <FaFilePdf className="file-icon" />
                      <div className="file-details">
                        <h5>{selectedFile.name}</h5>
                        <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                        <p className="file-type">
                          {selectedFile.type || selectedFile.name.split('.').pop().toUpperCase()}
                        </p>
                      </div>
                      <button
                        className="remove-file"
                        onClick={() => {
                          setSelectedFile(null);
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setPreviewUrl('');
                        }}
                        disabled={loading}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    
                    {previewUrl && (
                      <div className="pdf-preview">
                        <iframe
                          src={previewUrl}
                          title="PDF Preview"
                          className="pdf-viewer"
                          sandbox="allow-scripts allow-same-origin"
                        />
                        <p className="preview-note">PDF Preview (first page)</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="upload-area"
                    onClick={() => !loading && triggerFileInput('pdf')}
                    onDrop={(e) => handleDrop(e, 'pdf')}
                    onDragOver={handleDragOver}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                  >
                    <FaUpload className="upload-icon" />
                    <p className="upload-text">Click to select file or drag & drop</p>
                    <p className="upload-hint">Max file size: 50MB</p>
                    <p className="upload-hint">Supported: PDF, DOC, DOCX, PPT, PPTX, TXT</p>
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail Upload Section */}
            {uploadType === 'thumbnail' && (
              <div className="upload-section">
                <div className="upload-instructions">
                  <h4>
                    <FaImage /> Upload Thumbnail Image
                  </h4>
                  <p>
                    Upload a thumbnail image for the study note (max 5MB).
                    Recommended size: 800x600px or similar aspect ratio.
                    Supported formats: .jpg, .jpeg, .png, .gif, .webp
                  </p>
                </div>

                <input
                  type="file"
                  ref={thumbnailInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                  disabled={loading}
                />

                {selectedThumbnail ? (
                  <div className="thumbnail-preview">
                    <div className="thumbnail-info">
                      <FaImage className="thumbnail-icon" />
                      <div className="thumbnail-details">
                        <h5>{selectedThumbnail.name}</h5>
                        <p className="thumbnail-size">{formatFileSize(selectedThumbnail.size)}</p>
                        <p className="thumbnail-type">{selectedThumbnail.type}</p>
                      </div>
                      <button
                        className="remove-thumbnail"
                        onClick={() => {
                          setSelectedThumbnail(null);
                          setThumbnailPreview('');
                        }}
                        disabled={loading}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    
                    {thumbnailPreview && (
                      <div className="thumbnail-image-preview">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="thumbnail-preview-img"
                        />
                        <p className="preview-note">Image Preview</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="upload-area image-upload"
                    onClick={() => !loading && triggerFileInput('thumbnail')}
                    onDrop={(e) => handleDrop(e, 'thumbnail')}
                    onDragOver={handleDragOver}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                  >
                    <FaImage className="upload-icon" />
                    <p className="upload-text">Click to select image or drag & drop</p>
                    <p className="upload-hint">Max file size: 5MB</p>
                    <p className="upload-hint">Supported: JPG, PNG, GIF, WebP</p>
                  </div>
                )}
              </div>
            )}

            {/* Existing File Info */}
            {book?.fileUrl && uploadType === 'pdf' && (
              <div className="existing-file">
                <h4>Current File</h4>
                <div className="current-file-info">
                  <FaFilePdf className="current-file-icon" />
                  <div>
                    <p><strong>File:</strong> {book.fileName || 'PDF File'}</p>
                    <p className="file-warning">
                      <FaExclamationTriangle /> Uploading a new file will replace the existing one.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Thumbnail Info */}
            {book?.thumbnailUrl && uploadType === 'thumbnail' && (
              <div className="existing-thumbnail">
                <h4>Current Thumbnail</h4>
                <div className="current-thumbnail-info">
                  <img
                    src={book.thumbnailUrl}
                    alt="Current thumbnail"
                    className="current-thumbnail-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<FaImage /> No thumbnail preview available';
                    }}
                  />
                  <p className="thumbnail-warning">
                    <FaExclamationTriangle /> Uploading a new image will replace the existing thumbnail.
                  </p>
                </div>
              </div>
            )}

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
                type="button"
                className="btn-submit"
                onClick={handleUpload}
                disabled={loading || 
                  (uploadType === 'pdf' && !selectedFile) || 
                  (uploadType === 'thumbnail' && !selectedThumbnail)}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Uploading... {uploadProgress}%
                  </>
                ) : (
                  <>
                    <FaUpload /> Upload {uploadType === 'pdf' ? 'File' : 'Thumbnail'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyNotesUploadModal;
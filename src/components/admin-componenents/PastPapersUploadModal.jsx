// src/components/admin-componenents/PastPapersUploadModal.jsx
import React, { useState, useRef } from 'react';
import { 
  FaTimes, 
  FaUpload, 
  FaFilePdf, 
  FaImage, 
  FaCheck, 
  FaTimesCircle,
  FaFileAlt,
  FaEye,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUniversity
} from 'react-icons/fa';
import '../../styles/Admin-Styles/PastPapersAdminModal.css';

const PastPapersUploadModal = ({ paper, onClose, onSave }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [uploadType, setUploadType] = useState('pdf'); // 'pdf' or 'thumbnail'
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

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
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a PDF, Word, PowerPoint, or text file.');
        return;
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError('File size must be less than 50MB.');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Generate preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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

    try {
      // Simulate API upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadSuccess(true);
      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
    } catch (err) {
      setError('Upload failed. Please try again.');
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaUpload /> Upload Files
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {uploadSuccess ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h4>Upload Successful!</h4>
            <p>Files have been uploaded successfully.</p>
          </div>
        ) : (
          <div className="user-form">
            <div className="paper-preview-container">
              <h4 className="paper-preview-title">{paper?.title}</h4>
              <div className="paper-preview-meta">
                <span><FaCalendarAlt /> {paper?.year}</span>
                <span><FaFileAlt /> {paper?.class}</span>
                {paper?.examinationBody && (
                  <span><FaUniversity /> {paper?.examinationBody}</span>
                )}
                {paper?.subject && (
                  <span>{paper?.subject}</span>
                )}
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

            {/* Upload Type Selector */}
            <div className="upload-type-selector">
              <button
                type="button"
                className={`upload-type-btn ${uploadType === 'pdf' ? 'active' : ''}`}
                onClick={() => setUploadType('pdf')}
              >
                <FaFilePdf /> PDF/File
              </button>
              <button
                type="button"
                className={`upload-type-btn ${uploadType === 'thumbnail' ? 'active' : ''}`}
                onClick={() => setUploadType('thumbnail')}
              >
                <FaImage /> Thumbnail
              </button>
            </div>

            {/* PDF Upload Section */}
            {uploadType === 'pdf' && (
              <div className="upload-section">
                <div className="past-paper-upload-instructions">
                  <h4>
                    <FaFilePdf /> Upload Past Paper
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
                />

                {selectedFile ? (
                  <div className="file-preview">
                    <div className="file-info">
                      <FaFilePdf className="file-icon" />
                      <div className="file-details">
                        <h5>{selectedFile.name}</h5>
                        <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                        <p className="file-type">{selectedFile.type}</p>
                      </div>
                      <button
                        className="remove-file"
                        onClick={() => {
                          setSelectedFile(null);
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setPreviewUrl('');
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    
                    {selectedFile.type === 'application/pdf' && previewUrl && (
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
                    onClick={() => triggerFileInput('pdf')}
                  >
                    <FaUpload className="upload-icon" />
                    <p className="upload-text">Click to select file or drag & drop</p>
                    <p className="upload-hint">Max file size: 50MB</p>
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail Upload Section */}
            {uploadType === 'thumbnail' && (
              <div className="upload-section">
                <div className="past-paper-upload-instructions">
                  <h4>
                    <FaImage /> Upload Thumbnail Image
                  </h4>
                  <p>
                    Upload a thumbnail image for the past paper (max 5MB).
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
                    onClick={() => triggerFileInput('thumbnail')}
                  >
                    <FaImage className="upload-icon" />
                    <p className="upload-text">Click to select image or drag & drop</p>
                    <p className="upload-hint">Max file size: 5MB</p>
                  </div>
                )}
              </div>
            )}

            {/* Existing File Info */}
            {paper?.fileUrl && uploadType === 'pdf' && (
              <div className="existing-file">
                <h4>Current File</h4>
                <div className="current-file-info">
                  <FaFilePdf className="current-file-icon" />
                  <div>
                    <p><strong>File:</strong> {paper.fileName || 'PDF File'}</p>
                    <p className="file-warning">
                      <FaExclamationTriangle /> Uploading a new file will replace the existing one.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Thumbnail Info */}
            {paper?.thumbnailUrl && uploadType === 'thumbnail' && (
              <div className="existing-thumbnail">
                <h4>Current Thumbnail</h4>
                <div className="current-thumbnail-info">
                  <img
                    src={paper.thumbnailUrl}
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
                disabled={loading || (uploadType === 'pdf' && !selectedFile) || (uploadType === 'thumbnail' && !selectedThumbnail)}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Uploading...
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

export default PastPapersUploadModal;
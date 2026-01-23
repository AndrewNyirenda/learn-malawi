// src/components/admin-componenents/PastPapersDeleteModal.jsx
import React, { useState } from 'react';
import { 
  FaTimes, 
  FaExclamationTriangle, 
  FaTrash, 
  FaFileAlt, 
  FaFilePdf, 
  FaCalendarAlt, 
  FaUniversity,
  FaEye,
  FaDownload
} from 'react-icons/fa';
import '../../styles/Admin-Styles/PastPapersAdminModal.css';

const PastPapersDeleteModal = ({ paper, selectedCount, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // ADD SAFETY CHECKS HERE:
  const isSingleDelete = paper !== null && paper !== undefined;
  const paperTitle = isSingleDelete ? (paper?.title || 'Unknown Paper') : '';
  const itemCount = isSingleDelete ? 1 : (selectedCount || 0);

  const handleConfirm = async () => {
    if (!isSingleDelete && confirmText !== 'DELETE') {
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const getWarningMessage = () => {
    if (isSingleDelete) {
      return `Are you sure you want to delete "${paperTitle}"? This action cannot be undone.`;
    } else {
      return `Are you sure you want to delete ${itemCount} selected past paper(s)? This action cannot be undone.`;
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaExclamationTriangle className="warning-icon" />
            Confirm Deletion
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="delete-content">
          <div className="warning-section">
            <div className="warning-icon-large">
              <FaExclamationTriangle />
            </div>
            <h4>Warning: This action is irreversible!</h4>
            <p className="warning-text">
              {getWarningMessage()}
            </p>
          </div>

          {isSingleDelete ? (
            <div className="paper-to-delete">
              <div className="paper-info">
                <div className="paper-avatar">
                  <FaFileAlt />
                </div>
                <div className="paper-details">
                  <h5>{paper?.title || 'Unknown Paper'}</h5>
                  <p className="paper-meta">
                    <strong>Category:</strong> {paper?.category || 'N/A'} • 
                    <strong> Class:</strong> {paper?.class || 'N/A'}
                  </p>
                  <p className="paper-subject">
                    <strong>Year:</strong> {paper?.year || 'N/A'} • 
                    {paper?.subject && <span><strong>Subject:</strong> {paper.subject} • </span>}
                    <strong>Level:</strong> {paper?.level === 'primary' ? 'Primary' : 'Secondary'}
                  </p>
                  {paper?.examinationBody && <p><strong>Exam Body:</strong> {paper.examinationBody}</p>}
                  <div className="paper-stats">
                    <div className="stat-item">
                      <FaEye /> {paper?.viewCount || 0} views
                    </div>
                    <div className="stat-item">
                      <FaDownload /> {paper?.downloadCount || 0} downloads
                    </div>
                    <div className="stat-item">
                      <FaCalendarAlt /> Added: {formatDate(paper?.createdAt)}
                    </div>
                  </div>
                  {paper?.fileUrl && (
                    <div className="file-status">
                      <FaFilePdf /> PDF Attached: {paper?.fileName || 'Past Paper'}
                    </div>
                  )}
                  {paper?.thumbnailUrl && (
                    <div className="thumbnail-status">
                      <FaFileAlt /> Thumbnail Available
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bulk-delete-info">
              <div className="selected-count-badge">
                <FaTrash />
                <span>{itemCount} Past Paper(s) Selected</span>
              </div>
              <div className="confirmation-input">
                <p>
                  To confirm deletion of multiple past papers, type <strong>DELETE</strong> below:
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className={confirmText === 'DELETE' ? 'valid' : ''}
                  disabled={isDeleting}
                />
              </div>
            </div>
          )}

          <div className="deletion-consequences">
            <h5>What will be deleted:</h5>
            <ul>
              <li>• Past paper entry from the database</li>
              <li>• Uploaded PDF/DOC/PPT file (if exists)</li>
              <li>• Thumbnail image (if exists)</li>
              <li>• All view and download statistics</li>
              <li>• Any bookmarks or user references</li>
              <li>• Search index entries</li>
            </ul>
            <p className="note">
              <strong>Note:</strong> This action will permanently remove the past paper and all associated data.
              Please ensure you have a backup if needed.
            </p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-delete"
              onClick={handleConfirm}
              disabled={isDeleting || (!isSingleDelete && confirmText !== 'DELETE')}
            >
              {isDeleting ? (
                <>
                  <FaTrash className="spinner" /> Deleting...
                </>
              ) : (
                <>
                  <FaTrash /> Delete Past Paper(s)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastPapersDeleteModal;
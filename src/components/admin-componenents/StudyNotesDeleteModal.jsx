// src/components/admin-componenents/StudyNotesDeleteModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle, FaTrash, FaBook, FaFilePdf } from 'react-icons/fa';
import '../../styles/Admin-Styles/UserModals.css';

const StudyNotesDeleteModal = ({ book, selectedCount, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isSingleDelete = book !== null;
  const bookTitle = isSingleDelete ? book.title : '';
  const itemCount = isSingleDelete ? 1 : selectedCount;

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
      return `Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`;
    } else {
      return `Are you sure you want to delete ${itemCount} selected study note(s)? This action cannot be undone.`;
    }
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
            <div className="user-to-delete">
              <div className="user-info">
                <div className="user-avatar">
                  <FaBook />
                </div>
                <div className="user-details">
                  <h5>{book.title}</h5>
                  <p className="user-email">
                    <strong>Category:</strong> {book.category}
                  </p>
                  <p className="user-role">
                    <strong>Class:</strong> {book.class}
                    {book.subject && <span> • <strong>Subject:</strong> {book.subject}</span>}
                  </p>
                  <div className="book-info">
                    {book.fileUrl && (
                      <span className="file-status">
                        <FaFilePdf /> PDF Attached
                      </span>
                    )}
                    <span className="views-count">
                      {book.viewCount || 0} views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bulk-delete-info">
              <div className="selected-count-badge">
                <FaTrash />
                <span>{itemCount} Study Note(s) Selected</span>
              </div>
              <div className="confirmation-input">
                <p>
                  To confirm deletion of multiple study notes, type <strong>DELETE</strong> below:
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
              <li>• Study note entry from the database</li>
              <li>• Uploaded PDF file (if exists)</li>
              <li>• Thumbnail image (if exists)</li>
              <li>• All view and download statistics</li>
              <li>• Any bookmarks or user references</li>
            </ul>
            <p className="note">
              <strong>Note:</strong> This action will permanently remove the study note and all associated data.
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
              {isDeleting ? 'Deleting...' : 'Delete Study Note(s)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyNotesDeleteModal;
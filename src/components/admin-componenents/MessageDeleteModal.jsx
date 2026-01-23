// src/src/components/admin-components/MessageDeleteModal.jsx
import React, { useState } from 'react';
import {
  FaTimes,
  FaTrash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEnvelope,
  FaUser,
  FaCalendar
} from 'react-icons/fa';
import '../../styles/Admin-Styles/MessageAdminModal.css';

const MessageDeleteModal = ({ message, selectedCount, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // Success is handled by parent
    } catch (err) {
      console.error('Error in delete confirmation:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaTrash /> {message ? 'Delete Message' : 'Delete Messages'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="delete-content">
          <div className="warning-section">
            <div className="warning-icon">
              <FaExclamationTriangle />
            </div>
            <h4>Warning: This action cannot be undone!</h4>
            
            {message ? (
              <div className="message-to-delete">
                <div className="message-preview">
                  <div className="preview-header">
                    <FaEnvelope />
                    <h5>{message.subject}</h5>
                  </div>
                  <div className="preview-details">
                    <div className="preview-item">
                      <FaUser />
                      <span>{message.name}</span>
                    </div>
                    <div className="preview-item">
                      <FaCalendar />
                      <span>{formatDate(message.createdAt)}</span>
                    </div>
                  </div>
                  <div className="preview-message">
                    <p>{message.message.length > 150 
                      ? message.message.substring(0, 150) + '...' 
                      : message.message}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bulk-delete-info">
                <p>You are about to delete <strong>{selectedCount}</strong> message{selectedCount > 1 ? 's' : ''}.</p>
                <p>This action will permanently remove all selected messages from the system.</p>
              </div>
            )}
            
            <p className="warning-text">
              Are you sure you want to proceed with this deletion?
            </p>
          </div>

          <div className="delete-footer">
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
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                'Deleting...'
              ) : (
                <>
                  <FaTrash /> Delete{message ? '' : ` ${selectedCount} Message${selectedCount > 1 ? 's' : ''}`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDeleteModal;
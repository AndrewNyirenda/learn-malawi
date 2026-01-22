// components/admin-componenents/UserDeleteModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import '../../styles/Admin-Styles/UserModals.css';

const UserDeleteModal = ({ user, selectedCount, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isSingleDelete = user !== null;
  const userName = isSingleDelete ? `${user.firstName} ${user.lastName}` : '';
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
      return `Are you sure you want to delete ${userName}? This action cannot be undone.`;
    } else {
      return `Are you sure you want to delete ${itemCount} selected user(s)? This action cannot be undone.`;
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
                  {user.firstName?.charAt(0) || 'U'}
                </div>
                <div className="user-details">
                  <h5>{userName}</h5>
                  <p className="user-email">{user.email}</p>
                  <p className="user-role">
                    Role: <span className={`role-tag ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bulk-delete-info">
              <div className="selected-count-badge">
                <FaTrash />
                <span>{itemCount} User(s) Selected</span>
              </div>
              <div className="confirmation-input">
                <p>
                  To confirm deletion of multiple users, type <strong>DELETE</strong> below:
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
              <li>• User account and profile information</li>
              <li>• User's refresh tokens (they will be logged out)</li>
              <li>• All user-associated data (if applicable)</li>
            </ul>
            <p className="note">
              <strong>Note:</strong> Some user activity logs may be retained for audit purposes.
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
              {isDeleting ? 'Deleting...' : 'Delete User(s)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
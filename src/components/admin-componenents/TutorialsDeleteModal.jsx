// src/components/admin-componenents/TutorialsDeleteModal.jsx
import React from 'react';
import { useTutorials } from '../../contexts/TutorialsContext';
import {
  FaTimes,
  FaTrash,
  FaExclamationTriangle,
  FaPlay,
  FaBook,
  FaGraduationCap,
  FaUserGraduate,
  FaVideo
} from 'react-icons/fa';
import '../../styles/Admin-Styles/TutorialsAdminModal.css';

const TutorialsDeleteModal = ({ tutorial, selectedCount, onClose, onConfirm }) => {
  const { deleteTutorial, loading, error, clearError } = useTutorials();

  const [deleting, setDeleting] = React.useState(false);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      
      if (tutorial) {
        // Delete single tutorial
        const token = localStorage.getItem('accessToken');
        await deleteTutorial(tutorial.id, token);
      } else {
        // In a real app, you would handle bulk deletion here
        console.log(`Would delete ${selectedCount} tutorials`);
      }
      
      setDeleteSuccess(true);
      setTimeout(() => {
        onConfirm();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error deleting tutorial:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaTrash /> {tutorial ? 'Delete Tutorial' : 'Delete Tutorials'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {deleteSuccess ? (
          <div className="tutorial-success">
            <div className="tutorial-success-icon">✓</div>
            <h4>{tutorial ? 'Tutorial Deleted' : 'Tutorials Deleted'} Successfully!</h4>
            <p>
              {tutorial 
                ? `"${tutorial.title}" has been permanently deleted.`
                : `${selectedCount} tutorial(s) have been permanently deleted.`
              }
            </p>
          </div>
        ) : (
          <div className="delete-content">
            {error && (
              <div className="form-error">
                <span>{error}</span>
                <button onClick={clearError} className="close-error">
                  <FaTimes />
                </button>
              </div>
            )}

            <div className="warning-section">
              <div className="warning-icon">
                <FaExclamationTriangle />
              </div>
              <h4>Are you sure?</h4>
              <p>
                {tutorial
                  ? `You are about to delete the tutorial "${tutorial.title}". This action cannot be undone.`
                  : `You are about to delete ${selectedCount} tutorial(s). This action cannot be undone.`
                }
              </p>
            </div>

            {tutorial && (
              <div className="tutorial-details-delete">
                <div className="detail-row">
                  <span className="detail-label-modal">Subject:</span>
                  <span className="detail-value-modal">{tutorial.subject}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-modal">Level:</span>
                  <span className="detail-value-modal">
                    {tutorial.level === 'primary' ? 'Primary' : 'Secondary'} - {tutorial.class}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-modal">Video:</span>
                  <span className="detail-value-modal">
                    {tutorial.videoUrl ? 'Available' : 'Not available'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-modal">Created:</span>
                  <span className="detail-value-modal">
                    {new Date(tutorial.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {!tutorial && selectedCount > 0 && (
              <div className="tutorial-bulk-delete">
                <h5>The following will be affected:</h5>
                <ul>
                  <li>{selectedCount} tutorial(s) will be permanently deleted</li>
                  <li>All associated video content will be removed</li>
                  <li>Any student progress data for these tutorials will be lost</li>
                  <li>This action cannot be reversed</li>
                </ul>
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-submit danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : (
                  <>
                    <FaTrash /> {tutorial ? 'Delete Tutorial' : `Delete ${selectedCount} Tutorials`}
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

export default TutorialsDeleteModal;
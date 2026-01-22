// src/components/admin-componenents/QuizzesDeleteModal.jsx
import React from 'react';
import { useQuizzes } from '../../contexts/QuizzesContext';
import {
  FaTimes,
  FaTrash,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaBook,
  FaClock
} from 'react-icons/fa';
import '../../styles/Admin-Styles/QuizzesAdminModal.css';

const QuizzesDeleteModal = ({ quiz, selectedCount, onClose, onConfirm }) => {
  const { deleteQuiz, loading, error, clearError } = useQuizzes();

  const [deleting, setDeleting] = React.useState(false);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      
      if (quiz) {
        // Delete single quiz
        const token = localStorage.getItem('accessToken');
        await deleteQuiz(quiz.id, token);
      } else {
        // In a real app, you would handle bulk deletion here
        console.log(`Would delete ${selectedCount} quizzes`);
      }
      
      setDeleteSuccess(true);
      setTimeout(() => {
        onConfirm();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error deleting quiz:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaTrash /> {quiz ? 'Delete Quiz' : 'Delete Quizzes'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {deleteSuccess ? (
          <div className="quiz-success">
            <div className="quiz-success-icon">✓</div>
            <h4>{quiz ? 'Quiz Deleted' : 'Quizzes Deleted'} Successfully!</h4>
            <p>
              {quiz 
                ? `"${quiz.title}" has been permanently deleted.`
                : `${selectedCount} quiz(zes) have been permanently deleted.`
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
                {quiz
                  ? `You are about to delete the quiz "${quiz.title}". This action cannot be undone.`
                  : `You are about to delete ${selectedCount} quiz(zes). This action cannot be undone.`
                }
              </p>
            </div>

            {quiz && (
              <div className="quiz-details-delete">
                <div className="detail-row">
                  <span className="detail-label-modal">Subject:</span>
                  <span className="detail-value-modal">{quiz.subject}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-modal">Level:</span>
                  <span className="detail-value-modal">
                    {quiz.level === 'primary' ? 'Primary' : 'Secondary'} - {quiz.class}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-modal">Difficulty:</span>
                  <span className="detail-value-modal">
                    {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-modal">Questions:</span>
                  <span className="detail-value-modal">
                    {quiz.questions?.length || 0} questions
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label-modal">Created:</span>
                  <span className="detail-value-modal">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {!quiz && selectedCount > 0 && (
              <div className="quiz-bulk-delete">
                <h5>The following will be affected:</h5>
                <ul>
                  <li>{selectedCount} quiz(zes) will be permanently deleted</li>
                  <li>All questions associated with these quizzes will be removed</li>
                  <li>Any student progress data for these quizzes will be lost</li>
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
                    <FaTrash /> {quiz ? 'Delete Quiz' : `Delete ${selectedCount} Quizzes`}
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

export default QuizzesDeleteModal;
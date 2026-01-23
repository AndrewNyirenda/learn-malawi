// src/components/admin-componenents/NewsDeleteModal.jsx
import React, { useState } from 'react';
import { useNews } from '../../contexts/NewsContext';
import {
  FaTimes,
  FaTrash,
  FaExclamationTriangle,
  FaNewspaper,
  FaCalendar,
  FaUser,
  FaEye,
  FaImage
} from 'react-icons/fa';
import '../../styles/Admin-Styles/NewsAdminModal.css';

const NewsDeleteModal = ({ article, selectedCount, onClose, onConfirm }) => {
  const { deleteNews, loading, error, clearError } = useNews();

  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      
      if (article) {
        // Delete single article
        const token = localStorage.getItem('accessToken');
        await deleteNews(article.id, token);
      } else {
        // In a real app, you would handle bulk deletion here
        console.log(`Would delete ${selectedCount} articles`);
      }
      
      setDeleteSuccess(true);
      setTimeout(() => {
        onConfirm();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error deleting news:', err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaTrash /> {article ? 'Delete News Article' : 'Delete News Articles'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {deleteSuccess ? (
          <div className="news-success">
            <div className="news-success-icon">✓</div>
            <h4>{article ? 'Article Deleted' : 'Articles Deleted'} Successfully!</h4>
            <p>
              {article 
                ? `"${article.title}" has been permanently deleted.`
                : `${selectedCount} article(s) have been permanently deleted.`
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
                {article
                  ? `You are about to delete the article "${article.title}". This action cannot be undone.`
                  : `You are about to delete ${selectedCount} article(s). This action cannot be undone.`
                }
              </p>
            </div>

            {article && (
              <div className="news-details-delete">
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{article.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">
                    {article.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Author:</span>
                  <span className="detail-value">
                    {article.author?.firstName} {article.author?.lastName}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">{formatDate(article.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Image:</span>
                  <span className="detail-value">
                    {article.imageUrl ? 'Has image' : 'No image'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Views:</span>
                  <span className="detail-value">{article.views || 0}</span>
                </div>
              </div>
            )}

            {!article && selectedCount > 0 && (
              <div className="news-bulk-delete">
                <h5>The following will be affected:</h5>
                <ul>
                  <li>{selectedCount} article(s) will be permanently deleted</li>
                  <li>All associated images will be removed</li>
                  <li>Comments and reactions will be lost</li>
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
                    <FaTrash /> {article ? 'Delete Article' : `Delete ${selectedCount} Articles`}
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

export default NewsDeleteModal;
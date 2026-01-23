// src/components/admin-components/CareerResourceDeleteModal.jsx
import React, { useState } from 'react';
import { useCareerResources } from '../../contexts/CareerResourcesContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaTimes,
  FaTrash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBullseye,
  FaFileAlt,
  FaComments,
  FaUsers,
  FaClock,
  FaCompass,
  FaRocket,
  FaLink
} from 'react-icons/fa';
import '../../styles/Admin-Styles/CareerResourceAdminModal.css';

const CareerResourceDeleteModal = ({ resource, selectedCount, onClose, onConfirm }) => {
  const { deleteCareerResource, loading, error, clearError } = useCareerResources();
  const { user } = useAuth();

  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get icon component
  const getIconComponent = (iconName) => {
    const iconMap = {
      'FaBullseye': FaBullseye,
      'FaFileAlt': FaFileAlt,
      'FaComments': FaComments,
      'FaUsers': FaUsers,
      'FaClock': FaClock,
      'FaCompass': FaCompass,
      'FaRocket': FaRocket,
      'default': FaLink,
    };
    
    const IconComponent = iconMap[iconName] || iconMap.default;
    return IconComponent ? <IconComponent /> : <FaLink />;
  };

  // Handle deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (resource) {
        // Delete single resource
        await deleteCareerResource(resource.id, token);
      } else if (selectedCount > 0) {
        // For multiple deletion, you might want to implement batch deletion
        // For now, we'll just close the modal
        console.log(`Would delete ${selectedCount} resources`);
      }
      
      setDeleteSuccess(true);
      setTimeout(() => {
        onConfirm();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error deleting career resource:', err);
      clearError();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaTrash /> {resource ? 'Delete Resource' : 'Delete Multiple Resources'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {deleteSuccess ? (
          <div className="delete-success">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h4>Resource{selectedCount > 1 ? 's' : ''} Deleted Successfully!</h4>
            <p>The resource{selectedCount > 1 ? 's have' : ' has'} been removed from the database.</p>
          </div>
        ) : (
          <div className="delete-content">
            <div className="warning-section">
              <div className="warning-icon">
                <FaExclamationTriangle />
              </div>
              <h4>Warning: This action cannot be undone!</h4>
              
              {resource ? (
                <div className="resource-to-delete">
                  <div className="resource-preview-small">
                    <div className="preview-icon-small">
                      {getIconComponent(resource.icon)}
                    </div>
                    <div className="preview-content-small">
                      <h5>{resource.title}</h5>
                      <p className="preview-description-small">
                        {resource.description.length > 100 
                          ? resource.description.substring(0, 100) + '...' 
                          : resource.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bulk-delete-info">
                  <p>You are about to delete <strong>{selectedCount}</strong> career resource{selectedCount > 1 ? 's' : ''}.</p>
                  <p>This action will permanently remove all selected resources from the system.</p>
                </div>
              )}
              
              <p className="warning-text">
                Are you sure you want to proceed with this deletion?
              </p>
            </div>

            {error && (
              <div className="error-message">
                <span>{error}</span>
                <button onClick={clearError} className="close-error">
                  <FaTimes />
                </button>
              </div>
            )}

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
                    <FaTrash /> Delete Resource{selectedCount > 1 ? 's' : ''}
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

export default CareerResourceDeleteModal;
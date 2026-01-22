// components/admin-componenents/UserEditModal.jsx
import React, { useState, useEffect } from 'react';
import { useUsers } from '../../contexts/UserContext';
import { FaTimes } from 'react-icons/fa';
import '../../styles/Admin-Styles/UserModals.css';

const UserEditModal = ({ user, onClose, onSave }) => {
  const { updateUser, loading, error, clearError } = useUsers();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Teacher'
  });
  
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'Teacher'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear API error
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role
      };
      
      const result = await updateUser(user.id, userData);
      
      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onSave();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit User</h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        {submitSuccess ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h4>User Updated Successfully!</h4>
            <p>The user information has been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="user-form">
            {error && (
              <div className="form-error">
                <span>{error}</span>
                <button onClick={clearError} className="close-error">
                  <FaTimes />
                </button>
              </div>
            )}
            
            <div className="user-info-summary">
              <div className="user-avatar-large">
                {user.firstName?.charAt(0) || 'U'}
              </div>
              <div className="user-details">
                <h4>{user.firstName} {user.lastName}</h4>
                <p className="user-email">{user.email}</p>
                <p className="user-role">
                  Role: <span className={`role-tag ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="Enter first name"
                  disabled={loading}
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="Enter last name"
                  disabled={loading}
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="user@example.com"
                disabled={loading}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            
            <div className="password-note">
              <p>
                <strong>Note:</strong> To change the user's password, use the "Reset Password" 
                feature from the user list. Password changes require the user's current password 
                or an admin reset.
              </p>
            </div>
            
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
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update User'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEditModal;
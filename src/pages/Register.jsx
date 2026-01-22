import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Teacher'
  });

  const [errors, setErrors] = useState({});
  const { register, loading, error: apiError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear API errors on user interaction
    if (apiError) {
      clearError();
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // First name validation
    if (!formData.firstName.trim()) {
      formErrors.firstName = 'First name is required';
      isValid = false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      formErrors.lastName = 'Last name is required';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      formErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Call register function from useAuth
    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
    
    if (result?.success) {
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    }
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role: role
    });
  };

  return (
    <>
      <Helmet>
        <title>Admin Registration</title>
        <meta name="description" content="Create an admin account to update and manage educational resources on Learn Malawi platform." />
      </Helmet>
      
      <div className="registration-page">
        <div className="registration-container">
          <div className="registration-header">
            <h1>Register Account</h1>
            <p className="page-description">
              This registration is for <strong>administrators and teachers</strong> who will update educational content. 
              All study resources are <strong>completely free</strong> and accessible to students without login.
            </p>
          </div>

          <div className="registration-card">
            <div className="info-note">
              <strong>Note:</strong> Students don't need to register. All learning materials are freely available on the homepage.
            </div>

            {apiError && (
              <div className="api-error-message">
                <span className="error-icon">!</span>
                <span className="error-text">{apiError}</span>
                <button onClick={clearError} className="error-close">
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="registration-form">
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
                    placeholder="Enter your first name"
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
                    placeholder="Enter your last name"
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
                  placeholder="Enter your email address"
                  disabled={loading}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Re-enter your password"
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="role">Account Type *</label>
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-option ${formData.role === 'Teacher' ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect('Teacher')}
                    disabled={loading}
                  >
                    <div className="role-icon">👨‍🏫</div>
                    <div className="role-text">
                      <h4>Content Manager</h4>
                      <p>Upload and manage educational resources</p>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    className={`role-option ${formData.role === 'Admin' ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect('Admin')}
                    disabled={loading}
                  >
                    <div className="role-icon">👨‍💼</div>
                    <div className="role-text">
                      <h4>Administrator</h4>
                      <p>Full platform access and management</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="form-group terms">
                <input 
                  type="checkbox" 
                  id="terms" 
                  required 
                  disabled={loading}
                />
                <label htmlFor="terms">
                  I agree to use this account only for updating educational content and abide by the platform guidelines.
                </label>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating Admin Account...
                  </>
                ) : (
                  'Create Admin Account'
                )}
              </button>

              <div className="auth-links">
                <div className="login-link">
                  Already have an admin account? <Link to="/admin/login">Sign in here</Link>
                </div>
                <div className="back-link">
                  <Link to="/">
                    ← Return to free resources
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
// pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUserPlus, FaTimes, FaExclamationCircle, FaUserTag } from 'react-icons/fa';
import Footer from '../components/Footer';
import '../styles/register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Teacher', // Default role
  });
  
  const [passwordError, setPasswordError] = useState('');
  
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear password error when user starts typing
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const validateForm = () => {
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    // Validate role
    if (!['Admin', 'Teacher'].includes(formData.role)) {
      setPasswordError('Please select a valid role');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };
    
    const result = await register(userData);
    
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <>
      <div className="register-wrapper">
        <div className="register-container">
          <div className="register-card">
            <div className="register-header">
              <h1>Create Account</h1>
              <p className="register-subtitle">Join Learn Malawi today</p>
            </div>

            {(error || passwordError) && (
              <div className="error-message">
                <div className="error-content">
                  <FaExclamationCircle className="error-icon" />
                  <span className="error-text">{error || passwordError}</span>
                </div>
                <button onClick={() => { clearError(); setPasswordError(''); }} className="close-btn">
                  <FaTimes />
                </button>
              </div>
            )}

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    First Name *
                    <span className="required-dot"></span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="John"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">
                    Last Name *
                    <span className="required-dot"></span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  Email *
                  <span className="required-dot"></span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">
                    Password *
                    <span className="required-dot"></span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                    disabled={loading}
                    minLength="6"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password *
                    <span className="required-dot"></span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm password"
                    disabled={loading}
                    minLength="6"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="role">
                  <FaUserTag /> Role *
                  <span className="required-dot"></span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="role-select"
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Administrator</option>
                </select>
                <div className="role-description">
                  {formData.role === 'Teacher' ? (
                    <p>Teachers can create and manage educational content</p>
                  ) : (
                    <p>Administrators have full system access and user management</p>
                  )}
                </div>
              </div>
              
              <div className="password-info">
                <p className="info-text">
                  <strong>Password Requirements:</strong>
                </p>
                <ul className="requirements-list">
                  <li className={formData.password.length >= 6 ? 'valid' : 'invalid'}>
                    ✓ At least 6 characters
                  </li>
                  <li>Use a strong, unique password</li>
                </ul>
              </div>
              
              <button 
                type="submit" 
                className={`register-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="register-links">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="register-link">
                  Sign In
                </Link>
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                <Link to="/" className="register-link">
                  Back to Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
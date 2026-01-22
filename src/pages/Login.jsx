// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSignInAlt, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import Footer from '../components/Footer';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p className="login-subtitle">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="error-message">
                <div className="error-content">
                  <FaExclamationCircle className="error-icon" />
                  <span className="error-text">{error}</span>
                </div>
                <button onClick={clearError} className="close-btn">
                  <FaTimes />
                </button>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">
                  Email *
                  <span className="required-dot"></span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">
                  Password *
                  <span className="required-dot"></span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
              
              <button 
                type="submit" 
                className={`login-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="login-links">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="login-link">
                  Create Account
                </Link>
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                <Link to="/" className="login-link">
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

export default Login;
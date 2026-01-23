// components/Contact.jsx
import React, { useState } from "react";
import { useContact } from '../contexts/ContactContext';
import "../styles/Contact.css";
import Footer from "../components/Footer.jsx";
import Header from '../components/Header';
import { 
  FaPaperPlane, 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaEnvelope
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  
  const { loading, error, success, sendMessage, clearError, clearSuccess } = useContact();

  const contactInfo = {
    email: "learnmalaw@gmail.com",
    whatsapp: "+265 997 674 758",
    phone: "+265 997 674 758",
    office: "Area 8, Biwi, Lilongwe"
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Clear previous states
      clearError();
      clearSuccess();
      
      // Send message to backend
      await sendMessage(formData);
      
      // Reset form on success
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      
    } catch (err) {
      // Error is already handled in the context
      console.error('Form submission error:', err);
    }
  };

  return (
    <>
       <Header />
      <div className="contact-wrapper">
        <div className="container">
          {/* Page Title */}
          <div className="page-title-section">
            <h1>Contact Us</h1>
            <p className="page-subtitle">
              Get in touch with our team. We're here to help you succeed.
            </p>
          </div>

          {/* Contact Info & Form Grid */}
          <div className="contact-grid">
            {/* Contact Information Sidebar */}
            <div className="contact-info-sidebar">
              <div className="info-header">
                <h2>Contact Information</h2>
                <p className="info-subtitle">Reach out through any of these channels</p>
              </div>

              <div className="info-cards">
                {/* Email */}
                <div className="info-card">
                  <div className="info-icon-container">
                    <FaEnvelope className="info-icon" />
                  </div>
                  <div className="info-content">
                    <h3>Email</h3>
                    <p>{contactInfo.email}</p>
                    <a href={`mailto:${contactInfo.email}`} className="info-link">
                      Send Email
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="info-card">
                  <div className="info-icon-container">
                    <FaWhatsapp className="info-icon" />
                  </div>
                  <div className="info-content">
                    <h3>WhatsApp</h3>
                    <p>{contactInfo.whatsapp}</p>
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="info-link"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Office Location */}
                <div className="info-card">
                  <div className="info-icon-container">
                    <FaMapMarkerAlt className="info-icon" />
                  </div>
                  <div className="info-content">
                    <h3>Office Location</h3>
                    <p>{contactInfo.office}</p>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.office)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-link"
                    >
                      View on Map
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-container">
                <div className="form-header">
                  <h2>Send Us a Message</h2>
                  <p className="form-subtitle">We'll get back to you within 24 hours</p>
                </div>

                {/* Simple status messages */}
                {success && (
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#e8f5e9',
                    border: '2px solid #4caf50',
                    borderRadius: '8px',
                    color: '#2e7d32',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    animation: 'fadeIn 0.5s ease'
                  }}>
                    ✓ Message Sent
                  </div>
                )}

                {error && (
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#ffebee',
                    border: '2px solid #f44336',
                    borderRadius: '8px',
                    color: '#c62828',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    animation: 'fadeIn 0.5s ease'
                  }}>
                    ✗ Message Failed
                    <button 
                      onClick={clearError}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0288d1',
                        cursor: 'pointer',
                        marginLeft: '1rem',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                )}

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">
                        Full Name *
                        <span className="required-dot"></span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">
                        Email Address *
                        <span className="required-dot"></span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+265 XXX XXX XXX"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">
                        Subject *
                        <span className="required-dot"></span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="General Inquiry"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      Message *
                      <span className="required-dot"></span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Please describe how we can assist you..."
                      disabled={loading}
                    ></textarea>
                  </div>

                  <div className="form-footer">
                    <p className="required-note">
                      <span className="required-dot"></span> Indicates required field
                    </p>
                    <button 
                      type="submit" 
                      className={`submit-btn ${loading ? 'submitting' : ''}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="spinner"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="btn-icon" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
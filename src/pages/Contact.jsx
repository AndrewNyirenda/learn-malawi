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
  FaEnvelope,
  FaPhone,
  FaClock,
  FaArrowRight
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

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email Address",
      details: "learnmalaw@gmail.com",
      link: "mailto:learnmalaw@gmail.com",
      action: "Send Email",
      description: "For general inquiries and support"
    },
    {
      icon: <FaWhatsapp />,
      title: "WhatsApp",
      details: "+265 997 674 758",
      link: "https://wa.me/265997674758",
      action: "Chat on WhatsApp",
      description: "Quick responses for urgent matters"
    },
    {
      icon: <FaPhone />,
      title: "Phone",
      details: "+265 997 674 758",
      link: "tel:+265997674758",
      action: "Call Us",
      description: "Available during business hours"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Office Location",
      details: "Area 8, Biwi, Lilongwe",
      link: "https://maps.google.com/?q=Area+8+Biwi+Lilongwe+Malawi",
      action: "View on Map",
      description: "Visit our office in Lilongwe"
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      details: "Monday - Friday: 8:00 AM - 5:00 PM",
      link: null,
      action: null,
      description: "Saturday: 9:00 AM - 1:00 PM"
    }
  ];

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
        {/* Hero Section */}
        <section className="contact-hero-section">
          <div className="contact-hero-content">
            <h1>Contact Learn Malawi</h1>
            <p className="contact-subtitle">National Digital Education Platform</p>
            <div className="contact-divider"></div>
            <p className="contact-description">
              Get in touch with our team. We're here to support your educational journey 
              and answer any questions about our platform and services.
            </p>
          </div>
        </section>

        {/* Contact Information Grid */}
        <section className="contact-info-section">
          <div className="section-header">
            <h2>Contact Information</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Multiple ways to reach our support team</p>
          </div>
          
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="info-icon-container">
                  {info.icon}
                </div>
                <div className="info-content">
                  <h3>{info.title}</h3>
                  <p className="info-details">{info.details}</p>
                  <p className="info-description">{info.description}</p>
                  {info.link && info.action && (
                    <a 
                      href={info.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="info-action"
                    >
                      {info.action} <FaArrowRight />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form-section">
          <div className="section-header">
            <h2>Send Us a Message</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">We'll respond within 24 hours</p>
          </div>

          <div className="contact-form-container">
            <div className="form-wrapper">
              {/* Status Messages */}
              {success && (
                <div className="success-message">
                  <div className="success-content">
                    <div className="success-icon">✓</div>
                    <div>
                      <h3>Message Sent Successfully</h3>
                      <p>Thank you for contacting Learn Malawi. We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <div className="error-content">
                    <div className="error-icon">✗</div>
                    <div>
                      <h3>Message Failed to Send</h3>
                      <p>Please try again or use one of our other contact methods.</p>
                      <button 
                        onClick={clearError}
                        className="retry-btn"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
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
                      className="form-input"
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
                      className="form-input"
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
                      className="form-input"
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
                      className="form-input"
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
                    className="form-textarea"
                  ></textarea>
                </div>

                <div className="form-footer">
                  <p className="required-note">
                    <span className="required-dot"></span> Indicates required field
                  </p>
                  
                  <button 
                    type="submit" 
                    className={`submit-btn ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Sending Message...
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
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
import React, { useState } from "react";
import "../styles/Contact.css";
import Footer from "../components/Footer.jsx";
import { 
  FaPaperPlane, 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaEnvelope,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  return (
    <>
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

                {/* Business Hours */}

              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-container">
                <div className="form-header">
                  <h2>Send Us a Message</h2>
                  <p className="form-subtitle">We'll get back to you within 24 hours</p>
                </div>

                {submitStatus === "success" && (
                  <div className="success-message">
                    <div className="success-content">
                      <FaCheckCircle className="success-icon" />
                      <div>
                        <h3>Message Sent Successfully!</h3>
                        <p>Thank you for contacting Learn Malawi. We'll respond within 24 hours.</p>
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
                    ></textarea>
                  </div>

                  <div className="form-footer">
                    <p className="required-note">
                      <span className="required-dot"></span> Indicates required field
                    </p>
                    <button 
                      type="submit" 
                      className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
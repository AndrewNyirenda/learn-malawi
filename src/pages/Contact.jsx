import React, { useState, useEffect } from "react";
import { useContact } from '../contexts/ContactContext';
import "../styles/Contact.css";
import Footer from "../components/Footer.jsx";
import Header from '../components/Header';
import PageHeader from '../components/page-header'; 
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

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      details: "Mon - Fri: 8:00 AM - 5:00 PM",
      link: null,
      action: null,
      description: "Saturday: 9:00 AM - 1:00 PM"
    }
  ];

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    clearSuccess();
    try {
      await sendMessage(formData);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div className="contact-wrapper">
        <PageHeader 
          title="Contact Learn Malawi"
          description="Reach our team for support or inquiries. We're committed to assisting your educational journey."
        />

        {/* Contact Info */}
        <section className="contact-info-section">
          <div className="section-header">
            <h2>Contact Information</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Multiple ways to reach our support team</p>
          </div>

          <div className="contact-info-grid">
            {contactInfo.map((info, i) => (
              <div key={i} className="contact-card">
                <div className="contact-icon">{info.icon}</div>
                <h3>{info.title}</h3>
                <p className="contact-details">{info.details}</p>
                <p className="contact-desc">{info.description}</p>
                {info.link && info.action && (
                  <a 
                    href={info.link} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    className="contact-action"
                  >
                    {info.action} <FaArrowRight />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section">
          <div className="section-header">
            <h2>Send Us a Message</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">We’ll respond within 24 hours</p>
          </div>

          <div className="contact-form-container">
            {success && (
              <div className="success-message">
                <div className="status-content">
                  <div className="status-icon">✓</div>
                  <div>
                    <h3>Message Sent Successfully</h3>
                    <p>Thank you! We'll respond within 24 hours.</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                <div className="status-content">
                  <div className="status-icon">✗</div>
                  <div>
                    <h3>Message Failed</h3>
                    <p>Please try again or use another contact method.</p>
                    <button className="retry-btn" onClick={clearError}>Try Again</button>
                  </div>
                </div>
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
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
                  <label>Email Address *</label>
                  <input
                    type="email"
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
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+265 XXX XXX XXX"
                    disabled={loading}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
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
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Please describe how we can assist you..."
                  disabled={loading}
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>Sending Message...</>
                ) : (
                  <>
                    <FaPaperPlane className="btn-icon" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
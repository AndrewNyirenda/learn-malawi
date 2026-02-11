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
      link: null,
      action: null,
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
      <div className="lm-contact-wrapper">
        <PageHeader 
          title="Contact Learn Malawi"
          description="Reach our team for support or inquiries. We're committed to assisting your educational journey."
        />

        <section className="lm-contact-info-section">
          <div className="lm-contact-info-grid">
            {contactInfo.map((info, i) => (
              <div key={i} className="lm-contact-card">
                <div className="lm-contact-icon">{info.icon}</div>
                <h3>{info.title}</h3>
                <p className="lm-contact-details">{info.details}</p>
                <p className="lm-contact-desc">{info.description}</p>
                {info.link && info.action && (
                  <a 
                    href={info.link} 
                    target="_blank" 
                    rel="noopener noreferrer nofollow"
                    className="lm-contact-action"
                  >
                    {info.action} <FaArrowRight />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="lm-contact-form-section">
          <div className="lm-section-header">
            <h2>Send Us a Message</h2>
            <p className="lm-section-subtitle">
              We'll respond within 24 hours — usually much sooner
            </p>
          </div>

          <div className="lm-contact-form-container">
            {success && (
              <div className="lm-success-message">
                <div className="lm-status-content">
                  <div className="lm-status-icon">✓</div>
                  <div>
                    <h3>Message Sent Successfully</h3>
                    <p>Thank you for reaching out. We'll respond within 24 hours.</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="lm-error-message">
                <div className="lm-status-content">
                  <div className="lm-status-icon">✗</div>
                  <div>
                    <h3>Message Failed to Send</h3>
                    <p>Please try again or use one of our alternative contact methods.</p>
                    <button className="lm-retry-btn" onClick={clearError}>
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form className="lm-contact-form" onSubmit={handleSubmit}>
              <div className="lm-form-row">
                <div className="lm-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Full Name"
                    disabled={loading}
                    className="lm-form-input"
                  />
                </div>
                <div className="lm-form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your Email Address"
                    disabled={loading}
                    className="lm-form-input"
                  />
                </div>
              </div>

              <div className="lm-form-row">
                <div className="lm-form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+265 XXX XXX XXX"
                    disabled={loading}
                    className="lm-form-input"
                  />
                </div>
                <div className="lm-form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    disabled={loading}
                    className="lm-form-input"
                  />
                </div>
              </div>

              <div className="lm-form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Please describe how we can assist you..."
                  disabled={loading}
                  className="lm-form-textarea"
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`lm-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>Sending Message...</>
                ) : (
                  <>
                    <FaPaperPlane className="lm-btn-icon" /> Send Message
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
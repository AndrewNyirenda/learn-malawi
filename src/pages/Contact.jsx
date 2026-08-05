// pages/Contact.jsx
import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/contact.css";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";

import contactHero from "../images/contact2.jpg";

import {
  FaHome,
  FaChevronRight,
  FaCommentDots,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaShieldAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaCheck,
} from "react-icons/fa";

// ─── Hero (stamp & quickbar removed) ──────────────────────────────
const Hero = () => (
  <div
    className="contact-hero"
    style={{ backgroundImage: `url(${contactHero})` }}
  >
    <div className="contact-hero-scrim" />

    <div className="contact-hero-inner">
      <nav className="contact-breadcrumb" aria-label="Breadcrumb">
        <Link to="/"><FaHome /> Home</Link>
        <FaChevronRight />
        <span className="contact-breadcrumb-current">Contact</span>
      </nav>

      <div className="contact-eyebrow">
        <span className="contact-eyebrow-icon">
          <FaCommentDots />
        </span>
        We'd Love to Hear From You
      </div>

      <h1 className="contact-hero-title">
        Let's Start a <span className="contact-hero-title-accent">Conversation</span>
      </h1>

      <p className="contact-hero-desc">
        Questions, partnership ideas, or feedback on the platform — our team
        reads every message and replies personally.
      </p>
    </div>
  </div>
);

// ─── Contact form ─────────────────────────────────────────────────
const initialForm = { name: "", email: "", subject: "", message: "" };

const ContactForm = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      await new Promise((res) => setTimeout(res, 900));
      setSubmitting(false);
      setSent(true);
      setForm(initialForm);
    },
    []
  );

  if (sent) {
    return (
      <div className="contact-form-card contact-form-success">
        <div className="contact-success-icon">
          <FaCheck />
        </div>
        <h3>Message sent</h3>
        <p>
          Thank you for reaching out — a member of the Learn Smart team will
          reply within one business day.
        </p>
        <button type="button" className="contact-success-reset" onClick={() => setSent(false)}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
      <span className="contact-form-eyebrow">Send a Message</span>
      <h2 className="contact-form-title">Tell us how we can help</h2>

      <div className="contact-field-row">
        <div className="contact-field">
          <input
            id="name"
            name="name"
            type="text"
            placeholder=" "
            value={form.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name">Full name</label>
        </div>

        <div className="contact-field">
          <input
            id="email"
            name="email"
            type="email"
            placeholder=" "
            value={form.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email address</label>
        </div>
      </div>

      <div className="contact-field">
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder=" "
          value={form.subject}
          onChange={handleChange}
          required
        />
        <label htmlFor="subject">Subject</label>
      </div>

      <div className="contact-field">
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder=" "
          value={form.message}
          onChange={handleChange}
          required
        />
        <label htmlFor="message">Your message</label>
      </div>

      <button type="submit" className="contact-submit" disabled={submitting}>
        {submitting ? (
          <span className="contact-submit-spinner" aria-hidden="true" />
        ) : (
          <>
            Send Message <FaPaperPlane />
          </>
        )}
      </button>

      <p className="contact-form-note">
        By submitting, you agree to be contacted by the Learn Smart team
        regarding your enquiry.
      </p>
    </form>
  );
};

// ─── Contact details panel ─────────────────────────────────────────
const details = [
  {
    icon: FaMapMarkerAlt,
    label: "Our Office",
    lines: ["Learn Smart HQ", "Lilongwe, Central Region", "Malawi"],
  },
  {
    icon: FaPhoneAlt,
    label: "Phone",
    lines: ["+265 888 000 000", "+265 999 000 000"],
  },
  {
    icon: FaEnvelope,
    label: "Email",
    lines: ["hello@learnmalawi.com", "support@learnmalawi.com"],
  },
  {
    icon: FaClock,
    label: "Office Hours",
    lines: ["Mon – Fri: 8:00 – 17:00", "Sat: 9:00 – 13:00"],
  },
];

const socials = [
  { icon: FaFacebookF, label: "Facebook", href: "#" },
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
];

const ContactDetails = () => (
  <aside className="contact-details-card">
    <span className="contact-form-eyebrow">Get in Touch</span>
    <h3 className="contact-details-title">Reach us directly</h3>

    <ul className="contact-details-list">
      {details.map(({ icon: Icon, label, lines }) => (
        <li key={label} className="contact-details-item">
          <span className="contact-details-icon">
            <Icon />
          </span>
          <span className="contact-details-text">
            <span className="contact-details-label">{label}</span>
            {lines.map((line) => (
              <span className="contact-details-line" key={line}>
                {line}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ul>

    <div className="contact-details-divider" />

    <div className="contact-social-block">
      <span className="contact-details-label">Follow Learn Smart</span>
      <div className="contact-social-row">
        {socials.map(({ icon: Icon, label, href }) => (
          <a key={label} href={href} aria-label={label} className="contact-social-link">
            <Icon />
          </a>
        ))}
      </div>
    </div>

    <div className="contact-trust-badge">
      <FaShieldAlt />
      <span>Every enquiry is reviewed by a real person on our team.</span>
    </div>
  </aside>
);

// ─── Main component ────────────────────────────────────────────────
const Contact = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <div className="contact-container">
        <Hero />

        <section className="contact-main">
          <ContactForm />
          <ContactDetails />
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
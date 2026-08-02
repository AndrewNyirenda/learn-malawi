// components/Footer.jsx
import Logo from "../images/Logo.png";
import { Link } from "react-router-dom";
import "../styles/footer.css";
import {
  FaBook,
  FaFileAlt,
  FaVideo,
  FaQuestionCircle,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  const contactDetails = {
    email: "learnmalaw@gmail.com",
    whatsapp: "+265 997 674 758",
    office: "Area 8, Biwi, Lilongwe",
  };

  const links = [
    { name: "Study Notes", link: "/study-notes", icon: <FaBook /> },
    { name: "Past Papers", link: "/past-papers", icon: <FaFileAlt /> },
    { name: "Video Tutorials", link: "/tutorials", icon: <FaVideo /> },
    { name: "Practice Quizzes", link: "/quizes", icon: <FaQuestionCircle /> },
  ];

  return (
    <footer className="FooterWrapper">
      <div className="footer-content">
        {/* Logo + tagline */}
        <div className="footer-section footer-logo">
          <Link to="/" aria-label="Go to homepage">
            <img
              src={Logo}
              alt="Learn Malawi Logo"
              className="footer-logo-image"   // isolated class
            />
          </Link>
          <p className="footer-tagline">
            Free educational resources for every Malawian learner —
            from secondary school to tertiary education.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            {links.map((item, index) => (
              <li key={index}>
                <Link to={item.link}>
                  {item.icon} <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Social */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>
            <FaEnvelope className="footer-icon" />
            <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
          </p>
          <p>
            <FaWhatsapp className="footer-icon" />
            <a
              href={`https://wa.me/${contactDetails.whatsapp.replace(/\s/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contactDetails.whatsapp}
            </a>
          </p>
          <p>
            <FaMapMarkerAlt className="footer-icon" /> {contactDetails.office}
          </p>

          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a
                href="https://x.com/LearnMalawi/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/LearnMalawi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/LearnMalawi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Learn Smart. All Rights Reserved.</p>
        <p className="footer-bottom-note">Built for learners, everywhere in Malawi.</p>
      </div>
    </footer>
  );
};

export default Footer;
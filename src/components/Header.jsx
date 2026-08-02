import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../images/Logo.png";
import "../styles/header.css";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isOpen, isMobile]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="HeaderWrapper">
      {/* Desktop Logo */}
      {!isMobile && (
        <div className="LogoWrapper">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Learn Malawi logo" id="Logo" />
          </Link>
        </div>
      )}

      {/* Mobile Top Bar */}
      <div className="mobile-top-bar">
        <div className="LogoWrapper">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Learn Malawi logo" id="Logo" />
          </Link>
        </div>

        <div className="mobile-actions">
          <div className="hamburger" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className={`Menu ${isOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/study-notes"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Study Notes
        </NavLink>
        <NavLink
          to="/past-papers"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Past Papers
        </NavLink>
        <NavLink
          to="/tutorials"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Tutorials
        </NavLink>
        <NavLink
          to="/quizes"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Quizzes
        </NavLink>
        <NavLink
          to="/career-resources"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Career Resources
        </NavLink>
        <NavLink
          to="/news"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          News
        </NavLink>
        <NavLink
          to="/abouts"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Contact
        </NavLink>
      </div>

      {/* Backdrop for mobile menu */}
      {isOpen && isMobile && (
        <div className="backdrop" onClick={closeMenu}></div>
      )}
    </header>
  );
};

export default Header;
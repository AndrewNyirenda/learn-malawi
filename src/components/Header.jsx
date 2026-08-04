// components/Header.jsx
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import logo from "../images/Logo.png";
import "../styles/header.css";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaFileAlt,
  FaBookOpen,
  FaBriefcase,
  FaChalkboardTeacher,
  FaArrowLeft,
} from "react-icons/fa";

const RESOURCE_LINKS = [
  {
    to: "/past-papers",
    label: "Past Papers",
    desc: "Exam papers & marking schemes",
    icon: FaFileAlt,
  },
  {
    to: "/study-notes",
    label: "Study Notes",
    desc: "Topic-by-topic summaries",
    icon: FaBookOpen,
  },
  {
    to: "/tutorials",
    label: "Tutorials",
    desc: "Step-by-step video & text guides",
    icon: FaChalkboardTeacher,
  },
  {
    to: "/career-resources",
    label: "Career Resources",
    desc: "Guides, CVs & scholarships",
    icon: FaBriefcase,
  },
];

const QUICK_LINKS = [
  { label: "Past Papers", to: "/past-papers" },
  { label: "Study Notes", to: "/study-notes" },
  { label: "Tutorials", to: "/tutorials" },
  { label: "Quizzes", to: "/quizes" },
  { label: "Career Resources", to: "/career-resources" },
  { label: "News", to: "/news" },
];

const MOBILE_BREAKPOINT = 1024; // covers phones + tablets/iPad

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false); // mobile drawer
  const [isMobile, setIsMobile] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false); // desktop dropdown
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false); // mobile accordion
  const [searchOpen, setSearchOpen] = useState(false); // used by both, but mobile = full overlay
  const [query, setQuery] = useState("");

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const accordionInnerRef = useRef(null);

  /* ---------- responsive check ---------- */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------- close everything on route change ---------- */
  useEffect(() => {
    setIsOpen(false);
    setMobileResourcesOpen(false);
    setSearchOpen(false);
    setResourcesOpen(false);
    setQuery("");
  }, [location.pathname]);

  /* ---------- scroll lock (iOS-safe) ---------- */
  useEffect(() => {
    const shouldLock = (isOpen && isMobile) || (searchOpen && isMobile);
    if (shouldLock) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.dataset.scrollY = String(scrollY);
    } else if (document.body.style.position === "fixed") {
      const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
  }, [isOpen, isMobile, searchOpen]);

  /* ---------- outside click (desktop dropdown / desktop search only) ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !isMobile &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setResourcesOpen(false);
      }
      if (
        !isMobile &&
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  /* ---------- Escape closes everything ---------- */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setResourcesOpen(false);
        setSearchOpen(false);
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  /* ---------- autofocus search input when opened ---------- */
  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => {
    setIsOpen(false);
    setMobileResourcesOpen(false);
  };

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      closeSearch();
      closeMenu();
    }
  };

  const filteredQuickLinks = query
    ? QUICK_LINKS.filter((l) => l.label.toLowerCase().includes(query.toLowerCase()))
    : QUICK_LINKS;

  const navLinkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  const resourcesActive = RESOURCE_LINKS.some((r) =>
    location.pathname.startsWith(r.to)
  );

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
          <button
            type="button"
            className="icon-btn"
            aria-label="Search"
            onClick={openSearch}
          >
            <FaSearch />
          </button>

          <button
            type="button"
            className="icon-btn hamburger"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={toggleMenu}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* ============ Desktop Nav ============ */}
      {!isMobile && (
        <nav className="Menu">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>

          <div
            className={`nav-dropdown ${resourcesOpen ? "dropdown-open" : ""}`}
            ref={dropdownRef}
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              type="button"
              className={`nav-link nav-dropdown-trigger ${
                resourcesOpen || resourcesActive ? "active" : ""
              }`}
              aria-haspopup="true"
              aria-expanded={resourcesOpen}
              onClick={() => setResourcesOpen((p) => !p)}
            >
              Resources
              <FaChevronDown className={`chevron ${resourcesOpen ? "flipped" : ""}`} />
            </button>

            <div className="dropdown-panel" role="menu">
              <div className="dropdown-panel-inner">
                {RESOURCE_LINKS.map(({ to, label, desc, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setResourcesOpen(false)}
                    className="dropdown-item"
                    role="menuitem"
                  >
                    <span className="dropdown-item-icon">
                      <Icon />
                    </span>
                    <span className="dropdown-item-text">
                      <span className="dropdown-item-label">{label}</span>
                      <span className="dropdown-item-desc">{desc}</span>
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <NavLink to="/quizes" className={navLinkClass}>
            Quizzes
          </NavLink>
          <NavLink to="/news" className={navLinkClass}>
            News
          </NavLink>
          <NavLink to="/abouts" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>
      )}

      {/* Desktop Search */}
      {!isMobile && (
        <div className={`desktop-search ${searchOpen ? "search-open" : ""}`} ref={searchRef}>
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <button
              type="button"
              className="search-icon-btn"
              aria-label="Toggle search"
              onClick={() => (searchOpen ? closeSearch() : openSearch())}
            >
              <FaSearch />
            </button>
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search past papers, notes, tutorials…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              tabIndex={searchOpen ? 0 : -1}
            />
          </form>

          {searchOpen && (
            <div className="search-suggestions">
              {filteredQuickLinks.length > 0 ? (
                filteredQuickLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="search-suggestion-chip" onClick={closeSearch}>
                    {l.label}
                  </Link>
                ))
              ) : (
                <span className="search-suggestion-empty">Press enter to search “{query}”</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============ Mobile Drawer ============ */}
      {isMobile && (
        <>
          <nav className={`MobileDrawer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
            <div className="drawer-header">
              <span className="drawer-title">Menu</span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <FaTimes />
              </button>
            </div>

            <div className="drawer-scroll">
              <NavLink to="/" onClick={closeMenu} className="drawer-link" end>
                Home
              </NavLink>

              {/* Resources accordion */}
              <div className="drawer-accordion">
                <button
                  type="button"
                  className={`drawer-link drawer-accordion-trigger ${
                    mobileResourcesOpen || resourcesActive ? "active" : ""
                  }`}
                  aria-expanded={mobileResourcesOpen}
                  onClick={() => setMobileResourcesOpen((p) => !p)}
                >
                  <span>Resources</span>
                  <FaChevronDown
                    className={`chevron ${mobileResourcesOpen ? "flipped" : ""}`}
                  />
                </button>

                <div
                  className="drawer-accordion-panel"
                  style={{
                    maxHeight: mobileResourcesOpen
                      ? accordionInnerRef.current?.scrollHeight ?? 0
                      : 0,
                  }}
                >
                  <div className="drawer-accordion-inner" ref={accordionInnerRef}>
                    {RESOURCE_LINKS.map(({ to, label, desc, icon: Icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={closeMenu}
                        className="drawer-sublink"
                      >
                        <span className="drawer-sublink-icon">
                          <Icon />
                        </span>
                        <span className="drawer-sublink-text">
                          <span className="drawer-sublink-label">{label}</span>
                          <span className="drawer-sublink-desc">{desc}</span>
                        </span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>

              <NavLink to="/quizes" onClick={closeMenu} className="drawer-link">
                Quizzes
              </NavLink>
              <NavLink to="/news" onClick={closeMenu} className="drawer-link">
                News
              </NavLink>
              <NavLink to="/abouts" onClick={closeMenu} className="drawer-link">
                About
              </NavLink>
              <NavLink to="/contact" onClick={closeMenu} className="drawer-link">
                Contact
              </NavLink>
            </div>
          </nav>

          {isOpen && <div className="backdrop" onClick={closeMenu}></div>}
        </>
      )}

      {/* ============ Mobile Full-Screen Search Overlay ============ */}
      {isMobile && (
        <div className={`mobile-search-overlay ${searchOpen ? "open" : ""}`}>
          <form className="mobile-search-bar" onSubmit={handleSearchSubmit}>
            <button
              type="button"
              className="icon-btn"
              aria-label="Close search"
              onClick={closeSearch}
            >
              <FaArrowLeft />
            </button>
            <input
              ref={searchInputRef}
              type="text"
              className="mobile-search-input"
              placeholder="Search past papers, notes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              tabIndex={searchOpen ? 0 : -1}
            />
            {query && (
              <button
                type="button"
                className="icon-btn"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <FaTimes />
              </button>
            )}
          </form>

          <div className="mobile-search-body">
            <span className="mobile-search-section-label">
              {query ? "Matching pages" : "Quick links"}
            </span>
            <div className="mobile-search-list">
              {filteredQuickLinks.length > 0 ? (
                filteredQuickLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="mobile-search-item" onClick={closeSearch}>
                    <FaSearch className="mobile-search-item-icon" />
                    {l.label}
                  </Link>
                ))
              ) : (
                <button className="mobile-search-item mobile-search-submit" onClick={handleSearchSubmit}>
                  Search for “{query}”
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
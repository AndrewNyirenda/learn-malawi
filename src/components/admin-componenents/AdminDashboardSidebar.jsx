import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBook,
  FaFileAlt,
  FaPlay,
  FaQuestionCircle,
  FaNewspaper,
  FaDownload,
  FaUsers,
  FaChartBar,
  FaCog,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaHome
} from 'react-icons/fa';
import '../../styles/Admin-Styles/AdminDashboardSidebar.css';

const AdminDashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
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

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FaTachometerAlt />,
      path: '/admin/dashboard'
    },
    {
      title: 'Content Management',
      icon: <FaBook />,
      submenu: [
        { title: 'Study Notes', path: '/admin/study-notes' },
        { title: 'Past Papers', path: '/admin/past-papers' },
        { title: 'Tutorials', path: '/admin/tutorials' },
        { title: 'Quizzes', path: '/admin/quizzes' },
        { title: 'News & Updates', path: '/admin/news' },
        { title: 'Career Resources', path: '/admin/career-resources' }
      ]
    },
    {
      title: 'User Management',
      icon: <FaUsers />,
      submenu: [
        { title: 'All Users', path: '/admin/users' },
        { title: 'Admins', path: '/admin/admins' },
        { title: 'Teachers', path: '/admin/teachers' },
        { title: 'Add New User', path: '/admin/users/new' }
      ]
    },
    {
      title: 'Analytics',
      icon: <FaChartBar />,
      path: '/admin/analytics'
    },
    {
      title: 'Notifications',
      icon: <FaBell />,
      path: '/admin/notifications'
    },
    {
      title: 'Settings',
      icon: <FaCog />,
      path: '/admin/settings'
    }
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      // Close sidebar when clicking on backdrop
      const sidebar = document.querySelector('.admin-sidebar');
      sidebar?.classList.remove('show');
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={`sidebar-backdrop ${isMobile ? 'show' : ''}`}
        onClick={handleBackdropClick}
        style={{
          display: isMobile ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease'
        }}
      />
      
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!collapsed && (
            <div className="logo-section">
              <div className="logo">LM</div>
              <div className="logo-text">
                <h3>Learn Malawi</h3>
                <p>Admin Portal</p>
              </div>
            </div>
          )}
          <button 
            className="collapse-btn" 
            onClick={toggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Back to Home"
            onClick={() => {
              if (isMobile) {
                document.querySelector('.admin-sidebar')?.classList.remove('show');
              }
            }}
          >
            <FaHome className="nav-icon" />
            {!collapsed && <span className="nav-text">Back to Home</span>}
          </NavLink>
          
          {menuItems.map((item, index) => (
            <div key={index} className="nav-section">
              {item.path ? (
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  title={item.title}
                  onClick={() => {
                    if (isMobile) {
                      document.querySelector('.admin-sidebar')?.classList.remove('show');
                    }
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-text">{item.title}</span>}
                </NavLink>
              ) : (
                <div className="nav-item-with-submenu">
                  <button 
                    className={`nav-item ${activeSubmenu === item.title ? 'active' : ''}`}
                    onClick={() => toggleSubmenu(item.title)}
                    title={item.title}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="nav-text">{item.title}</span>
                        <span className="submenu-arrow">
                          {activeSubmenu === item.title ? '▼' : '►'}
                        </span>
                      </>
                    )}
                  </button>
                  
                  {!collapsed && activeSubmenu === item.title && (
                    <div className="submenu">
                      {item.submenu.map((subItem, subIndex) => (
                        <NavLink 
                          key={subIndex}
                          to={subItem.path}
                          className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            if (isMobile) {
                              document.querySelector('.admin-sidebar')?.classList.remove('show');
                            }
                          }}
                        >
                          {subItem.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="quick-stats">
            {!collapsed && <h4>Quick Stats</h4>}
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">1,234</div>
                {!collapsed && <div className="stat-label">Users</div>}
              </div>
              <div className="stat-item">
                <div className="stat-value">456</div>
                {!collapsed && <div className="stat-label">Resources</div>}
              </div>
            </div>
          </div>
          
          <button 
            className="logout-btn-mobile"
            onClick={() => {
              console.log('Mobile logout clicked');
              // Add logout logic
            }}
          >
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminDashboardSidebar;
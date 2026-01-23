import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBook,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaHome,
  FaEnvelope
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import logo from "../../images/Logo.png";
import '../../styles/Admin-Styles/AdminDashboardSidebar.css';

const AdminDashboardSidebar = () => {
  const { user, logout } = useAuth(); // ✅ Added logout function
  const navigate = useNavigate(); // ✅ Added navigate for redirect
  const [collapsed, setCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
      path: '/admin/users'
    },
    {
      title: 'Messages',
      icon: <FaEnvelope />,
      path: '/admin/messages'
    }
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="logo-section">
            <div className="logo">
              <img src={logo} alt="Admin Logo" />
            </div>

            <div className="logo-text">
              <h3>Admin Portal</h3>
              <p>
                {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
              </p>
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
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-text">{item.title}</span>}
              </NavLink>
            ) : (
              <div className="nav-item-with-submenu">
                <button
                  className={`nav-item ${activeSubmenu === item.title ? 'active' : ''}`}
                  onClick={() => toggleSubmenu(item.title)}
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
                        className={({ isActive }) =>
                          `submenu-item ${isActive ? 'active' : ''}`
                        }
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
        {/* ✅ Updated logout button with onClick handler */}
        <button 
          className="logout-btn-mobile"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminDashboardSidebar;
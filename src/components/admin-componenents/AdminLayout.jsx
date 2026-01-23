import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboardSidebar from './AdminDashboardSidebar';
import '../../styles/Admin-Styles/AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('show');
      document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) {
      sidebar.classList.remove('show');
      document.body.style.overflow = '';
    }
  };

  // ✅ Handle logout
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    
    // Disable logout button and show loading state
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.disabled = true;
      logoutBtn.textContent = 'Logging out...';
    }
    
    try {
      // Call the logout function from AuthContext
      await logout();
      
      // Logout successful - redirect happens in AuthContext
      console.log('Logout successful');
      
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Re-enable button
      if (logoutBtn) {
        logoutBtn.disabled = false;
        logoutBtn.textContent = 'Logout';
      }
      
      // Show error message
      alert('Logout failed. Please try again.');
      
      // Fallback: Force logout locally
      localStorage.clear();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector('.admin-sidebar');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        if (sidebar && !sidebar.contains(e.target) && mobileBtn && !mobileBtn.contains(e.target)) {
          closeSidebar();
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  return (
    <div className="admin-layout">
      <AdminDashboardSidebar />

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
            <div>
              <h1>Learn Malawi Admin Portal</h1>
              <p className="admin-subtitle">Content Management System</p>
            </div>
          </div>

          {/* DESKTOP ONLY */}
          {!isMobile && (
            <div className="header-right">
              <div className="admin-user-info">
                <div className="user-details">
                  <span className="user-name">{user?.firstName} {user?.lastName}</span>
                  <span className="user-role">{user?.role}</span>
                </div>
              </div>
              {/* ✅ Updated logout button */}
              <button 
                className="logout-btn" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </header>

        <div className="admin-content" onClick={() => isMobile && sidebarOpen && closeSidebar()}>
          <Outlet />
        </div>

        <footer className="admin-footer">
          <p>© {new Date().getFullYear()} Learn Malawi Admin Portal. All rights reserved.</p>
          <p>Version 2.0.0 | Last updated: Today</p>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
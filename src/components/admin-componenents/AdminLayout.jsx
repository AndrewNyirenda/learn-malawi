import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminDashboardSidebar from './AdminDashboardSidebar';
import '../../styles/Admin-Styles/AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('show');
      
      // Toggle body overflow
      if (sidebar.classList.contains('show')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
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

  const handleLogout = () => {
    console.log('Logging out...');
    // Add your logout logic here
  };

  // Close sidebar when clicking on content area on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector('.admin-sidebar');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (sidebar && 
            !sidebar.contains(e.target) && 
            mobileMenuBtn && 
            !mobileMenuBtn.contains(e.target)) {
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
        <div className="admin-header">
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
          
          <div className="header-right">
            <div className="admin-user-info">
              <div className="user-avatar">A</div>
              <div className="user-details">
                <span className="user-name">Administrator</span>
                <span className="user-role">Super Admin</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        
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
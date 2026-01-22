import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminDashboardSidebar from './AdminDashboardSidebar';
import '../../styles/Admin-Styles/AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    // window.location.href = '/login';
  };

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
            >
              ☰
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
        
        <div className="admin-content">
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
import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaBook,
  FaFileAlt,
  FaPlay,
  FaQuestionCircle,
  FaNewspaper,
  FaChartLine,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaCog,
  FaEnvelope
} from 'react-icons/fa';
import '../../styles/Admin-Styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResources: 0,
    pendingApprovals: 0,
    activeSessions: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [quickStats, setQuickStats] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      // Mock data - replace with actual API calls
      setStats({
        totalUsers: 1234,
        totalResources: 456,
        pendingApprovals: 12,
        activeSessions: 89
      });

      setRecentActivity([
        { id: 1, user: 'John Doe', action: 'Uploaded new study notes', time: '10 min ago', type: 'upload' },
        { id: 2, user: 'Jane Smith', action: 'Approved tutorial video', time: '30 min ago', type: 'approve' },
        { id: 3, user: 'Admin', action: 'Updated system settings', time: '1 hour ago', type: 'update' },
        { id: 4, user: 'Teacher 1', action: 'Added new quiz', time: '2 hours ago', type: 'add' },
        { id: 5, user: 'Admin', action: 'Deleted outdated resource', time: '3 hours ago', type: 'delete' }
      ]);

      setQuickStats([
        { title: 'Study Notes', value: 120, change: '+12%', icon: <FaBook />, color: '#4a90e2' },
        { title: 'Past Papers', value: 85, change: '+5%', icon: <FaFileAlt />, color: '#36b37e' },
        { title: 'Tutorials', value: 45, change: '+8%', icon: <FaPlay />, color: '#ff5630' },
        { title: 'Quizzes', value: 67, change: '+15%', icon: <FaQuestionCircle />, color: '#6554c0' },
        { title: 'News Articles', value: 32, change: '+3%', icon: <FaNewspaper />, color: '#00b8d9' },
        { title: 'Career Resources', value: 28, change: '+20%', icon: <FaChartLine />, color: '#ffab00' }
      ]);
    };

    fetchDashboardData();
  }, []);

  const getActivityIcon = (type) => {
    switch(type) {
      case 'upload': return <FaArrowUp className="activity-icon upload" />;
      case 'approve': return <FaCheckCircle className="activity-icon approve" />;
      case 'update': return <FaClock className="activity-icon update" />;
      case 'add': return <FaArrowUp className="activity-icon add" />;
      case 'delete': return <FaExclamationCircle className="activity-icon delete" />;
      default: return <FaClock className="activity-icon" />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p className="dashboard-subtitle">Welcome to Learn Malawi Admin Portal</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon users">
            <FaUsers />
          </div>
          <div className="stat-card-content">
            <h3>{stats.totalUsers.toLocaleString()}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon resources">
            <FaBook />
          </div>
          <div className="stat-card-content">
            <h3>{stats.totalResources}</h3>
            <p>Total Resources</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon pending">
            <FaClock />
          </div>
          <div className="stat-card-content">
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon sessions">
            <FaUsers />
          </div>
          <div className="stat-card-content">
            <h3>{stats.activeSessions}</h3>
            <p>Active Sessions</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="dashboard-section">
        <h3>Resource Statistics</h3>
        <div className="quick-stats-grid">
          {quickStats.map((stat, index) => (
            <div key={index} className="quick-stat-card">
              <div className="quick-stat-header">
                <div className="quick-stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="quick-stat-change" style={{ color: stat.change.startsWith('+') ? '#36b37e' : '#ff5630' }}>
                  {stat.change}
                </div>
              </div>
              <h4>{stat.value}</h4>
              <p>{stat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Activity</h3>
          <button className="view-all-btn">View All</button>
        </div>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon-container">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <div className="activity-main">
                  <strong>{activity.user}</strong> {activity.action}
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button className="action-btn primary">
            <FaBook />
            <span>Add New Resource</span>
          </button>
          <button className="action-btn secondary">
            <FaUsers />
            <span>Manage Users</span>
          </button>
          <button className="action-btn tertiary">
            <FaChartLine />
            <span>View Analytics</span>
          </button>
          <button className="action-btn quaternary">
            <FaCog />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="dashboard-section">
        <h3>System Status</h3>
        <div className="system-status">
          <div className="status-item">
            <div className="status-indicator active"></div>
            <span>API Server</span>
            <span className="status-text">Operational</span>
          </div>
          <div className="status-item">
            <div className="status-indicator active"></div>
            <span>Database</span>
            <span className="status-text">Operational</span>
          </div>
          <div className="status-item">
            <div className="status-indicator warning"></div>
            <span>Storage</span>
            <span className="status-text">85% Used</span>
          </div>
          <div className="status-item">
            <div className="status-indicator active"></div>
            <span>CDN</span>
            <span className="status-text">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
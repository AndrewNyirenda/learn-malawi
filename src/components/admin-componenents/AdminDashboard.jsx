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
  FaEnvelope,
  FaDownload,
  FaEye,
  FaGraduationCap,
  FaUserPlus,
  FaPaperPlane,
  FaComments,
  FaSpinner,
  FaSync,
  FaTimesCircle,
  FaHistory,
  FaDatabase
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Admin-Styles/AdminDashboard.css';
import axios from 'axios';

// Use environment variable with fallback for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Cache constants
const DASHBOARD_CACHE_KEY = 'dashboard_stats_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('api'); // 'api' or 'cache'
  const [lastUpdated, setLastUpdated] = useState(null);

  // Save to cache
  const saveToCache = (data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION
      };
      localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(cacheData));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Failed to save dashboard data to cache:', err);
    }
  };

  // Load from cache
  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem(DASHBOARD_CACHE_KEY);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() > cacheData.expiresAt) {
        localStorage.removeItem(DASHBOARD_CACHE_KEY);
        return null;
      }

      return {
        data: cacheData.data,
        timestamp: cacheData.timestamp,
        source: 'cache'
      };
    } catch (err) {
      console.warn('Failed to load dashboard data from cache:', err);
      return null;
    }
  };

  // Clear cache
  const clearCache = () => {
    localStorage.removeItem(DASHBOARD_CACHE_KEY);
    setDataSource('api');
  };

  // Fetch from API
  const fetchFromAPI = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      // Save to cache
      saveToCache(response.data);
      
      return {
        data: response.data,
        source: 'api'
      };
    } catch (err) {
      throw err;
    }
  };

  const fetchDashboardStats = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (forceRefresh) {
        // Force refresh from API
        result = await fetchFromAPI();
        setDataSource('api');
      } else {
        // Try cache first
        const cached = loadFromCache();
        
        if (cached && !forceRefresh) {
          // Use cached data
          result = cached;
          setDataSource('cache');
        } else {
          // Fetch from API
          result = await fetchFromAPI();
          setDataSource('api');
        }
      }
      
      setDashboardData(result.data);
      setLastUpdated(new Date().toLocaleTimeString());
      
    } catch (err) {
      // If API fails, try cache as fallback
      const cached = loadFromCache();
      if (cached) {
        setDashboardData(cached.data);
        setDataSource('cache');
        setError('Using cached data (API unavailable)');
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch dashboard stats';
        setError(errorMessage);
        console.error('Dashboard fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardStats();
    
    // Set up periodic refresh (every 5 minutes)
    const refreshInterval = setInterval(() => {
      fetchDashboardStats(true); // Force refresh
    }, CACHE_DURATION);
    
    // Set up online/offline detection
    const handleOnline = () => {
      if (dataSource === 'cache') {
        fetchDashboardStats(true); // Refresh when back online
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleRefresh = () => {
    fetchDashboardStats(true); // Force refresh from API
  };

  const clearError = () => {
    setError(null);
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'upload': return <FaArrowUp className="activity-icon upload" />;
      case 'publish': return <FaPaperPlane className="activity-icon approve" />;
      case 'message': return <FaComments className="activity-icon update" />;
      case 'user': return <FaUserPlus className="activity-icon add" />;
      default: return <FaClock className="activity-icon" />;
    }
  };

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h2>Loading Dashboard...</h2>
        </div>
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" />
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardData) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h2>Dashboard Error</h2>
        </div>
        <div className="error-container">
          <div className="error-message">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
          <div className="error-actions">
            <button className="btn-retry" onClick={handleRefresh}>
              <FaSync /> Retry
            </button>
            <button className="btn-clear" onClick={clearError}>
              <FaTimesCircle /> Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h2>No Data Available</h2>
        </div>
        <div className="no-data">
          <p>Unable to load dashboard statistics</p>
          <button className="btn-retry" onClick={handleRefresh}>
            <FaSync /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const { summary, quickStats, recentActivity, systemStats } = dashboardData;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h2>Dashboard Overview</h2>
          <p className="dashboard-subtitle">Welcome back, {user?.firstName}!</p>
          <div className="data-source-info">
            <small>
              <FaDatabase /> Source: {dataSource === 'api' ? 'Live API' : 'Cached'}
              {lastUpdated && ` • Updated: ${lastUpdated}`}
            </small>
          </div>
        </div>
        <div className="header-right">
          <button 
            className="btn-refresh" 
            onClick={handleRefresh}
            title="Refresh Dashboard"
            disabled={loading}
          >
            <FaSync /> {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          {dataSource === 'cache' && (
            <button 
              className="btn-clear-cache" 
              onClick={clearCache}
              title="Clear Cache and Refresh"
            >
              <FaHistory /> Clear Cache
            </button>
          )}
        </div>
      </div>

      {/* Warning message when using cached data */}
      {dataSource === 'cache' && error && (
        <div className="cache-warning">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon users">
            <FaUsers />
          </div>
          <div className="stat-card-content">
            <h3>{summary.totalUsers.toLocaleString()}</h3>
            <p>Total Users</p>
            <small>Active Today: {systemStats.activeUsersToday}</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon resources">
            <FaBook />
          </div>
          <div className="stat-card-content">
            <h3>{summary.totalResources}</h3>
            <p>Total Resources</p>
            <small>Uploads Today: {systemStats.uploadsToday}</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon pending">
            <FaEnvelope />
          </div>
          <div className="stat-card-content">
            <h3>{summary.pendingMessages}</h3>
            <p>New Messages</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon sessions">
            <FaEye />
          </div>
          <div className="stat-card-content">
            <h3>{(summary.totalDownloads + summary.totalViews).toLocaleString()}</h3>
            <p>Total Engagements</p>
            <small>
              <FaDownload /> {summary.totalDownloads} | 
              <FaEye /> {summary.totalViews}
            </small>
          </div>
        </div>
      </div>

      {/* Resource Statistics */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Resource Statistics</h3>
          <div className="data-freshness">
            <small>
              {dataSource === 'cache' ? 'Cached data' : 'Live data'}
            </small>
          </div>
        </div>
        <div className="quick-stats-grid">
          {quickStats.map((stat, index) => (
            <div key={index} className="quick-stat-card">
              <div className="quick-stat-header">
                <div className="quick-stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                  {getResourceIcon(stat.title)}
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
        </div>
        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon-container">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <div className="activity-main">
                    <strong>{activity.user}</strong> {activity.action}: "{activity.resource}"
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-activity">
              <p>No recent activity to display</p>
            </div>
          )}
        </div>
      </div>

      {/* System Stats */}
      <div className="dashboard-section">
        <h3>System Statistics</h3>
        <div className="system-stats-grid">
          <div className="system-stat">
            <FaGraduationCap />
            <div>
              <h4>Primary Resources</h4>
              <p>{systemStats.booksByLevel.primary + systemStats.pastPapersByLevel.primary} total</p>
            </div>
          </div>
          <div className="system-stat">
            <FaGraduationCap />
            <div>
              <h4>Secondary Resources</h4>
              <p>{systemStats.booksByLevel.secondary + systemStats.pastPapersByLevel.secondary} total</p>
            </div>
          </div>
          <div className="system-stat">
            <FaUsers />
            <div>
              <h4>Active Users</h4>
              <p>{systemStats.activeUsersToday} today</p>
            </div>
          </div>
          <div className="system-stat">
            <FaArrowUp />
            <div>
              <h4>Daily Uploads</h4>
              <p>{systemStats.uploadsToday} today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button 
            className="action-btn primary"
            onClick={() => window.location.href = '/admin/study-notes?action=add'}
          >
            <FaBook />
            <span>Add Study Notes</span>
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => window.location.href = '/admin/past-papers?action=add'}
          >
            <FaFileAlt />
            <span>Add Past Papers</span>
          </button>
          <button 
            className="action-btn tertiary"
            onClick={() => window.location.href = '/admin/messages'}
          >
            <FaEnvelope />
            <span>View Messages</span>
          </button>
          <button 
            className="action-btn quaternary"
            onClick={() => window.location.href = '/admin/news?action=add'}
          >
            <FaNewspaper />
            <span>Add News</span>
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
            <span className="status-text">Connected</span>
          </div>
          <div className="status-item">
            <div className="status-indicator" style={{ 
              backgroundColor: systemStats.uploadsToday > 10 ? '#36b37e' : 
                             systemStats.uploadsToday > 5 ? '#ffab00' : '#ff5630' 
            }}></div>
            <span>Upload Activity</span>
            <span className="status-text">
              {systemStats.uploadsToday > 10 ? 'High' : 
               systemStats.uploadsToday > 5 ? 'Moderate' : 'Low'}
            </span>
          </div>
          <div className="status-item">
            <div className="status-indicator" style={{ 
              backgroundColor: dataSource === 'api' ? '#36b37e' : '#ffab00'
            }}></div>
            <span>Data Source</span>
            <span className="status-text">
              {dataSource === 'api' ? 'Live' : 'Cached'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get appropriate icons for resource types
const getResourceIcon = (title) => {
  switch(title) {
    case 'Study Notes': return <FaBook />;
    case 'Past Papers': return <FaFileAlt />;
    case 'Tutorials': return <FaPlay />;
    case 'Quizzes': return <FaQuestionCircle />;
    case 'News Articles': return <FaNewspaper />;
    case 'Career Resources': return <FaChartLine />;
    default: return <FaBook />;
  }
};

export default AdminDashboard;
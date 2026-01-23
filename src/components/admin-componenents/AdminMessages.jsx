// src/src/components/admin-components/AdminMessages.jsx
import React, { useState, useEffect } from 'react';
import { useMessages } from '../../contexts/MessagesContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaSync,
  FaChartBar,
  FaList,
  FaTh,
  FaTimesCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowUp,
  FaArrowDown,
  FaUser,
  FaPhone,
  FaCalendar,
  FaReply,
  FaClock,
  FaEnvelopeOpenText,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import '../../styles/Admin-Styles/AdminMessages.css';
import MessageViewModal from './MessageViewModal';
import MessageDeleteModal from './MessageDeleteModal';

const AdminMessages = () => {
  const {
    messages,
    loading,
    error,
    stats,
    fetchMessages,
    deleteMessage,
    markAsRead,
    markAsNew,
    fetchStats,
    clearError
  } = useMessages();

  const { user: currentAdmin, isAdmin } = useAuth();

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [expandedMessage, setExpandedMessage] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await fetchMessages(filters.status === 'all' ? '' : filters.status, filters.search);
      await fetchStats();
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  // Fetch messages when filters change
  useEffect(() => {
    const fetchFilteredMessages = async () => {
      await fetchMessages(filters.status === 'all' ? '' : filters.status, filters.search);
    };
    
    fetchFilteredMessages();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSelectedMessages([]);
    setExpandedMessage(null);
  };

  // Handle message selection
  const handleSelectMessage = (messageId) => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(selectedMessages.filter(id => id !== messageId));
    } else {
      setSelectedMessages([...selectedMessages, messageId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map(msg => msg.id));
    }
  };

  // Handle actions
  const handleViewMessage = (message) => {
    setCurrentMessage(message);
    setShowViewModal(true);
    // Mark as read when viewing
    if (message.status === 'new') {
      markAsRead(message.id);
    }
  };

  const handleDeleteMessage = (message) => {
    setCurrentMessage(message);
    setShowDeleteModal(true);
  };

  const handleDeleteMultiple = () => {
    setShowDeleteModal(true);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markAsRead(messageId);
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAsNew = async (messageId) => {
    try {
      await markAsNew(messageId);
    } catch (err) {
      console.error('Error marking as new:', err);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadData();
    clearError();
  };

  // Clear search
  const handleClearSearch = () => {
    handleFilterChange('search', '');
  };

  // Toggle message expansion
  const toggleExpandMessage = (messageId) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
    // Mark as read when expanding
    if (expandedMessage !== messageId) {
      const message = messages.find(m => m.id === messageId);
      if (message && message.status === 'new') {
        markAsRead(messageId);
      }
    }
  };

  // Filter and sort messages
  const filteredMessages = messages.filter(message => {
    if (!filters.search) return true;
    
    const searchTerm = filters.search.toLowerCase();
    return (
      message.name?.toLowerCase().includes(searchTerm) ||
      message.email?.toLowerCase().includes(searchTerm) ||
      message.subject?.toLowerCase().includes(searchTerm) ||
      message.message?.toLowerCase().includes(searchTerm)
    );
  });

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    let aValue = a[filters.sortBy] || '';
    let bValue = b[filters.sortBy] || '';
    
    if (filters.sortBy.includes('At') || filters.sortBy === 'createdAt' || filters.sortBy === 'updatedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (filters.sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'new':
        return { icon: <FaEnvelope />, color: '#ff4757', bgColor: '#ffe6e6', text: 'New' };
      case 'read':
        return { icon: <FaEnvelopeOpen />, color: '#36b37e', bgColor: '#e6f7f0', text: 'Read' };
      default:
        return { icon: <FaEnvelope />, color: '#666', bgColor: '#f8fafc', text: 'Unknown' };
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="admin-messages">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-messages">
      {/* Header */}
      <div className="messages-header">
        <div className="header-left">
          <h2>Messages Inbox</h2>
          <p>Manage contact form messages and inquiries</p>
        </div>
        <div className="header-right">
          <button 
            className="btn-refresh" 
            onClick={handleRefresh}
            title="Refresh"
          >
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <FaExclamationCircle />
          <span>{error}</span>
          <button onClick={clearError} className="close-error">
            <FaTimesCircle />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="messages-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaEnvelope />
          </div>
          <div className="stat-content">
            <h3>{stats?.total || 0}</h3>
            <p>Total Messages</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon new">
            <FaEnvelope />
          </div>
          <div className="stat-content">
            <h3>{stats?.new || 0}</h3>
            <p>New Messages</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon read">
            <FaEnvelopeOpen />
          </div>
          <div className="stat-content">
            <h3>{stats?.read || 0}</h3>
            <p>Read Messages</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon response">
            <FaReply />
          </div>
          <div className="stat-content">
            <h3>{messages.filter(m => m.status === 'read').length || 0}</h3>
            <p>Require Response</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="messages-controls">
        {/* Search Bar */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search messages by name, email, subject, or content..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          {filters.search && (
            <button 
              className="clear-search" 
              onClick={handleClearSearch}
              title="Clear search"
            >
              <FaTimesCircle />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="filters-row">
          <div className="filter-controls">
            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Messages</option>
                <option value="new">New Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>

            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                <option value="createdAt">Newest First</option>
                <option value="updatedAt">Last Updated</option>
                <option value="name">Sender Name</option>
              </select>
              <button 
                className="sort-order" 
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                title={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                {filters.sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <FaList />
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FaTh />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMessages.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            <FaCheckCircle />
            <span>{selectedMessages.length} message(s) selected</span>
          </div>
          <div className="action-buttons">
            <button 
              className="btn-bulk-mark-read"
              onClick={() => {
                selectedMessages.forEach(id => markAsRead(id));
                setSelectedMessages([]);
              }}
              disabled={!isAdmin() || loading}
            >
              <FaCheck /> Mark as Read
            </button>
            <button 
              className="btn-bulk-delete" 
              onClick={handleDeleteMultiple}
              disabled={!isAdmin()}
            >
              <FaTrash /> Delete Selected
            </button>
            <button 
              className="btn-clear-selection" 
              onClick={() => setSelectedMessages([])}
            >
              <FaTimesCircle /> Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="messages-container">
        {sortedMessages.length === 0 ? (
          <div className="no-messages">
            <FaEnvelope className="no-messages-icon" />
            <h3>No messages found</h3>
            <p>{filters.search ? 'Try a different search term' : 'No messages have been received yet'}</p>
          </div>
        ) : (
          <div className="messages-list">
            {sortedMessages.map(message => {
              const statusInfo = getStatusInfo(message.status);
              const isExpanded = expandedMessage === message.id;
              const isSelected = selectedMessages.includes(message.id);
              
              return (
                <div 
                  key={message.id} 
                  className={`message-item ${isSelected ? 'selected' : ''} ${message.status === 'new' ? 'new-message' : ''}`}
                >
                  {/* Message Header */}
                  <div className="message-header" onClick={() => toggleExpandMessage(message.id)}>
                    <div className="message-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectMessage(message.id);
                        }}
                        disabled={!isAdmin()}
                      />
                    </div>
                    
                    <div className="message-sender">
                      <div className="sender-avatar">
                        <FaUser />
                      </div>
                      <div className="sender-info">
                        <h4 className="sender-name">{message.name}</h4>
                        <p className="sender-email">{message.email}</p>
                      </div>
                    </div>
                    
                    <div className="message-subject">
                      <h4>{message.subject}</h4>
                      <p className="message-preview">
                        {message.message.length > 100 
                          ? message.message.substring(0, 100) + '...' 
                          : message.message}
                      </p>
                    </div>
                    
                    <div className="message-meta">
                      <div className="status-badge" style={{ 
                        color: statusInfo.color,
                        backgroundColor: statusInfo.bgColor
                      }}>
                        {statusInfo.icon}
                        <span>{statusInfo.text}</span>
                      </div>
                      
                      <div className="time-info">
                        <FaClock />
                        <span>{formatTimeAgo(message.createdAt)}</span>
                      </div>
                      
                      <div className="expand-toggle">
                        <button 
                          className="expand-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandMessage(message.id);
                          }}
                          title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <FaTimes /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="message-expanded">
                      <div className="expanded-header">
                        <div className="message-details">
                          <div className="detail-item">
                            <FaUser />
                            <span><strong>From:</strong> {message.name}</span>
                          </div>
                          <div className="detail-item">
                            <FaEnvelope />
                            <span><strong>Email:</strong> {message.email}</span>
                          </div>
                          {message.phone && (
                            <div className="detail-item">
                              <FaPhone />
                              <span><strong>Phone:</strong> {message.phone}</span>
                            </div>
                          )}
                          <div className="detail-item">
                            <FaCalendar />
                            <span><strong>Received:</strong> {formatDate(message.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="expanded-actions">
                          {message.status === 'new' ? (
                            <button 
                              className="btn-mark-read"
                              onClick={() => handleMarkAsRead(message.id)}
                              disabled={!isAdmin() || loading}
                            >
                              <FaCheck /> Mark as Read
                            </button>
                          ) : (
                            <button 
                              className="btn-mark-new"
                              onClick={() => handleMarkAsNew(message.id)}
                              disabled={!isAdmin() || loading}
                            >
                              <FaEnvelope /> Mark as New
                            </button>
                          )}
                          <button 
                            className="btn-view-details"
                            onClick={() => handleViewMessage(message)}
                            disabled={loading}
                          >
                            <FaEnvelopeOpenText /> View Details
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteMessage(message)}
                            disabled={!isAdmin()}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="message-content">
                        <h5>Message Content:</h5>
                        <div className="content-text">
                          {message.message.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Info */}
      {sortedMessages.length > 0 && (
        <div className="messages-pagination">
          <div className="pagination-info">
            Showing {sortedMessages.length} of {messages.length} messages
            {filters.status !== 'all' && ` (${filters.status} only)`}
          </div>
        </div>
      )}

      {/* Modals */}
      {showViewModal && currentMessage && (
        <MessageViewModal
          message={currentMessage}
          onClose={() => setShowViewModal(false)}
          onMarkAsRead={() => handleMarkAsRead(currentMessage.id)}
          onMarkAsNew={() => handleMarkAsNew(currentMessage.id)}
        />
      )}

      {showDeleteModal && (
        <MessageDeleteModal
          message={currentMessage}
          selectedCount={currentMessage ? 1 : selectedMessages.length}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            if (currentMessage) {
              deleteMessage(currentMessage.id);
            } else {
              // Handle multiple deletion
              selectedMessages.forEach(id => deleteMessage(id));
              setSelectedMessages([]);
            }
            setCurrentMessage(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default AdminMessages;
// components/admin-componenents/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { useUsers } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaUsers,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaSort,
  FaUserShield,
  FaUserGraduate,
  FaEnvelope,
  FaCalendar,
  FaSync,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaKey,
  FaDownload,
  FaUpload,
  FaBan,
  FaCheck
} from 'react-icons/fa';
import '../../styles/Admin-Styles/AdminUsers.css';
import UserAddModal from './UserAddModal'; 
import UserEditModal from './UserEditModal'; 
import UserDeleteModal from './UserDeleteModal'; 

const AdminUsers = () => {
  const { 
    users, 
    loading, 
    error, 
    getAllUsers, 
    deleteUser, 
    searchUsers,
    clearError 
  } = useUsers();
  
  const { user: currentAdmin, isAdmin } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUserForm, setNewUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Teacher',
    password: '',
    confirmPassword: ''
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    teacherUsers: 0,
    activeToday: 0
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    await getAllUsers();
  };

  // Update stats when users change
  useEffect(() => {
    if (users && users.length > 0) {
      const totalUsers = users.length;
      const adminUsers = users.filter(u => u.role === 'Admin').length;
      const teacherUsers = users.filter(u => u.role === 'Teacher').length;
      
      setStats({
        totalUsers,
        adminUsers,
        teacherUsers,
        activeToday: users.filter(u => {
          const updatedAt = new Date(u.updatedAt);
          const today = new Date();
          return updatedAt.toDateString() === today.toDateString();
        }).length
      });
    }
  }, [users]);

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower));
      
      // Role filter
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      // Handle dates
      if (sortBy.includes('At')) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Handle user selection
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  // Handle add user
  const handleAddUser = () => {
    setNewUserForm({
      firstName: '',
      lastName: '',
      email: '',
      role: 'Teacher',
      password: '',
      confirmPassword: ''
    });
    setShowAddModal(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  // Handle delete multiple users
  const handleDeleteMultiple = () => {
    setCurrentUser(null);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      if (currentUser) {
        // Delete single user
        await deleteUser(currentUser.id);
      } else if (selectedUsers.length > 0) {
        // Delete multiple users
        for (const userId of selectedUsers) {
          await deleteUser(userId);
        }
        setSelectedUsers([]);
      }
      setShowDeleteModal(false);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user(s):', err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      fetchUsers();
    } else {
      searchUsers(value);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    fetchUsers();
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchUsers();
    clearError();
  };

  // Export users (CSV)
  const handleExportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Created Date', 'Last Updated'],
      ...filteredUsers.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.role,
        formatDate(user.createdAt),
        formatDate(user.updatedAt)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading && users.length === 0) {
    return (
      <div className="admin-users">
        <div className="loading-users">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="users-header">
        <div className="header-left">
          <h2>User Management</h2>
          <p>Manage system users and their permissions</p>
        </div>
        <div className="header-right">
          <button 
            className="btn-refresh" 
            onClick={handleRefresh}
            title="Refresh users"
          >
            <FaSync /> Refresh
          </button>
          <button 
            className="btn-add-user" 
            onClick={handleAddUser}
            disabled={!isAdmin()}
            title={isAdmin() ? "Add new user" : "Admin access required"}
          >
            <FaUserPlus /> Add User
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
      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon admin">
            <FaUserShield />
          </div>
          <div className="stat-content">
            <h3>{stats.adminUsers}</h3>
            <p>Admins</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teacher">
            <FaUserGraduate />
          </div>
          <div className="stat-content">
            <h3>{stats.teacherUsers}</h3>
            <p>Teachers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">
            <FaCalendar />
          </div>
          <div className="stat-content">
            <h3>{stats.activeToday}</h3>
            <p>Active Today</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="users-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={handleClearSearch}
              title="Clear search"
            >
              <FaTimesCircle />
            </button>
          )}
        </div>
        
        <div className="control-group">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
          
          <div className="sort-group">
            <FaSort className="sort-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="firstName">Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Last Updated</option>
            </select>
            <button 
              className="sort-order" 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          
          <button 
            className="btn-export" 
            onClick={handleExportUsers}
            disabled={filteredUsers.length === 0}
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            <FaCheckCircle />
            <span>{selectedUsers.length} user(s) selected</span>
          </div>
          <div className="action-buttons">
            <button 
              className="btn-bulk-delete" 
              onClick={handleDeleteMultiple}
              disabled={!isAdmin()}
            >
              <FaTrash /> Delete Selected
            </button>
            <button 
              className="btn-clear-selection" 
              onClick={() => setSelectedUsers([])}
            >
              <FaTimesCircle /> Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="users-table-container">
        {filteredUsers.length === 0 ? (
          <div className="no-users">
            <FaUsers className="no-users-icon" />
            <h3>No users found</h3>
            <p>{searchTerm ? 'Try a different search term' : 'Add your first user to get started'}</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    disabled={!isAdmin()}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      disabled={!isAdmin() || user.id === currentAdmin?.id}
                    />
                  </td>
                  <td>
                    <div className="user-name">
                      <div className="avatar">
                        {user.firstName?.charAt(0) || 'U'}
                      </div>
                      <div className="name-info">
                        <strong>{user.firstName} {user.lastName}</strong>
                        {user.id === currentAdmin?.id && (
                          <span className="current-user">You</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="user-email">
                      <FaEnvelope />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role === 'Admin' ? <FaUserShield /> : <FaUserGraduate />}
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="date-info">
                      <FaCalendar />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <FaCalendar />
                      <span>{formatDate(user.updatedAt)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-view"
                        onClick={() => handleEditUser(user)}
                        title="View details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditUser(user)}
                        title="Edit user"
                        disabled={user.id === currentAdmin?.id && !isAdmin()}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user)}
                        title="Delete user"
                        disabled={!isAdmin() || user.id === currentAdmin?.id}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="users-pagination">
          <div className="pagination-info">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <UserAddModal
          onClose={() => setShowAddModal(false)}
          onSave={fetchUsers}
        />
      )}

      {showEditModal && currentUser && (
        <UserEditModal
          user={currentUser}
          onClose={() => setShowEditModal(false)}
          onSave={fetchUsers}
        />
      )}

      {showDeleteModal && (
        <UserDeleteModal
          user={currentUser}
          selectedCount={currentUser ? 1 : selectedUsers.length}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default AdminUsers;
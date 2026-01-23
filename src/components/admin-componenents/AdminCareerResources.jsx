// src/components/admin-components/AdminCareerResources.jsx
import React, { useState, useEffect } from 'react';
import { useCareerResources } from '../../contexts/CareerResourcesContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaBullseye,
  FaFileAlt,
  FaComments,
  FaUsers,
  FaClock,
  FaCompass,
  FaRocket,
  FaLink,
  FaPlus,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
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
  FaFileExport
} from 'react-icons/fa';
import '../../styles/Admin-Styles/AdminCareerResources.css';
import CareerResourceAddModal from './CareerResourceAddModal';
import CareerResourceEditModal from './CareerResourceEditModal';
import CareerResourceDeleteModal from './CareerResourceDeleteModal';

const AdminCareerResources = () => {
  const {
    careerResources,
    loading,
    error,
    fetchCareerResources,
    createCareerResource,
    updateCareerResource,
    deleteCareerResource,
    clearError,
    stats
  } = useCareerResources();

  const { user: currentAdmin, isAdmin } = useAuth();

  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'id',
    sortOrder: 'asc'
  });
  const [selectedResources, setSelectedResources] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Icon mapping for resources
  const iconMap = {
    'FaBullseye': FaBullseye,
    'FaFileAlt': FaFileAlt,
    'FaComments': FaComments,
    'FaUsers': FaUsers,
    'FaClock': FaClock,
    'FaCompass': FaCompass,
    'FaRocket': FaRocket,
    'default': FaLink,
  };

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchCareerResources();
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSelectedResources([]);
  };

  // Handle resource selection
  const handleSelectResource = (resourceId) => {
    if (selectedResources.includes(resourceId)) {
      setSelectedResources(selectedResources.filter(id => id !== resourceId));
    } else {
      setSelectedResources([...selectedResources, resourceId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedResources.length === filteredResources.length) {
      setSelectedResources([]);
    } else {
      setSelectedResources(filteredResources.map(resource => resource.id));
    }
  };

  // Handle actions
  const handleAddResource = () => {
    setShowAddModal(true);
  };

  const handleEditResource = (resource) => {
    setCurrentResource(resource);
    setShowEditModal(true);
  };

  const handleDeleteResource = (resource) => {
    setCurrentResource(resource);
    setShowDeleteModal(true);
  };

  const handleDeleteMultiple = () => {
    setShowDeleteModal(true);
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

  // Filter and sort resources
  const filteredResources = careerResources.filter(resource => {
    if (!filters.search) return true;
    
    const searchTerm = filters.search.toLowerCase();
    return (
      resource.title?.toLowerCase().includes(searchTerm) ||
      resource.description?.toLowerCase().includes(searchTerm) ||
      resource.link?.toLowerCase().includes(searchTerm)
    );
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    let aValue = a[filters.sortBy] || '';
    let bValue = b[filters.sortBy] || '';
    
    if (filters.sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Get icon component
  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName] || iconMap.default;
    return IconComponent ? <IconComponent /> : <FaLink />;
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

  if (loading && careerResources.length === 0) {
    return (
      <div className="admin-career-resources">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading career resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-career-resources">
      {/* Header */}
      <div className="resources-header">
        <div className="header-left">
          <h2>Career Resources Management</h2>
          <p>Manage valuable career guidance resources for students</p>
        </div>
        <div className="header-right">
          <button 
            className="btn-refresh" 
            onClick={handleRefresh}
            title="Refresh"
          >
            <FaSync /> Refresh
          </button>
          <button 
            className="btn-add-resource" 
            onClick={handleAddResource}
            disabled={!isAdmin()}
            title={isAdmin() ? "Add new career resource" : "Admin access required"}
          >
            <FaPlus /> Add Resource
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
      <div className="resources-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>{careerResources.length}</h3>
            <p>Total Resources</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon last-updated">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{careerResources.length > 0 ? formatDate(careerResources[0]?.updatedAt || careerResources[0]?.createdAt) : 'N/A'}</h3>
            <p>Last Updated</p>
          </div>
        </div>

        {stats && (
          <>
            <div className="stat-card">
              <div className="stat-icon views">
                <FaChartBar />
              </div>
              <div className="stat-content">
                <h3>{stats.totalViews || 0}</h3>
                <p>Total Views</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="resources-controls">
        {/* Search Bar */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search resources by title, description, or link..."
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
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                <option value="id">ID</option>
                <option value="title">Title A-Z</option>
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Last Updated</option>
              </select>
              <button 
                className="sort-order" 
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                title={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                {filters.sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
              </button>
            </div>

            {/* Export Button */}
            <button 
              className="btn-export"
              title="Export Resources"
              onClick={() => alert('Export feature coming soon!')}
            >
              <FaFileExport /> Export
            </button>
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FaTh />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedResources.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            <FaCheckCircle />
            <span>{selectedResources.length} resource(s) selected</span>
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
              onClick={() => setSelectedResources([])}
            >
              <FaTimesCircle /> Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Resources Gallery */}
      <div className="resources-gallery-container">
        {sortedResources.length === 0 ? (
          <div className="no-resources">
            <FaFileAlt className="no-resources-icon" />
            <h3>No career resources found</h3>
            <p>{filters.search ? 'Try a different search term' : 'Add your first career resource to get started'}</p>
            <button className="btn-add-resource" onClick={handleAddResource}>
              <FaPlus /> Add First Resource
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="resources-grid">
            {sortedResources.map(resource => (
              <div 
                key={resource.id} 
                className={`resource-card ${selectedResources.includes(resource.id) ? 'selected' : ''}`}
              >
                {/* Selection Checkbox */}
                <div className="resource-select">
                  <input
                    type="checkbox"
                    checked={selectedResources.includes(resource.id)}
                    onChange={() => handleSelectResource(resource.id)}
                    disabled={!isAdmin()}
                  />
                </div>

                {/* Resource Icon */}
                <div className="resource-icon-container">
                  <div className="resource-icon-display">
                    {getIconComponent(resource.icon)}
                  </div>
                </div>

                {/* Resource Info */}
                <div className="resource-info">
                  <h3 className="resource-title">{resource.title}</h3>
                  
                  <p className="resource-description">
                    {resource.description?.length > 120 
                      ? resource.description.substring(0, 120) + '...' 
                      : resource.description}
                  </p>

                  <div className="resource-link-display">
                    <FaExternalLinkAlt />
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link-preview"
                      title={resource.link}
                    >
                      {resource.link.length > 40 
                        ? resource.link.substring(0, 40) + '...' 
                        : resource.link}
                    </a>
                  </div>

                  <div className="resource-meta">
                    <div className="meta-item">
                      <span>ID: {resource.id}</span>
                    </div>
                    <div className="meta-item">
                      <FaClock />
                      <span>Updated: {formatDate(resource.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="resource-actions">
                  <button 
                    className="btn-action preview"
                    onClick={() => window.open(resource.link, '_blank', 'noopener,noreferrer')}
                    title="Preview Resource"
                  >
                    <FaExternalLinkAlt />
                  </button>
                  
                  <button 
                    className="btn-action edit"
                    onClick={() => handleEditResource(resource)}
                    title="Edit Resource"
                    disabled={!isAdmin()}
                  >
                    <FaEdit />
                  </button>
                  
                  <button 
                    className="btn-action delete"
                    onClick={() => handleDeleteResource(resource)}
                    title="Delete Resource"
                    disabled={!isAdmin()}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="resources-list">
            <table className="resources-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedResources.length === sortedResources.length && sortedResources.length > 0}
                      onChange={handleSelectAll}
                      disabled={!isAdmin()}
                    />
                  </th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Link</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedResources.map(resource => (
                  <tr key={resource.id} className={selectedResources.includes(resource.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedResources.includes(resource.id)}
                        onChange={() => handleSelectResource(resource.id)}
                        disabled={!isAdmin()}
                      />
                    </td>
                    <td>{resource.id}</td>
                    <td>
                      <div className="resource-title-cell">
                        <div className="resource-icon-small">
                          {getIconComponent(resource.icon)}
                        </div>
                        <strong>{resource.title}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="resource-description-cell">
                        {resource.description?.length > 80 
                          ? resource.description.substring(0, 80) + '...' 
                          : resource.description}
                      </div>
                    </td>
                    <td>
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="link-cell"
                        title={resource.link}
                      >
                        <FaExternalLinkAlt /> View
                      </a>
                    </td>
                    <td>{formatDate(resource.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-action edit"
                          onClick={() => handleEditResource(resource)}
                          title="Edit"
                          disabled={!isAdmin()}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-action delete"
                          onClick={() => handleDeleteResource(resource)}
                          title="Delete"
                          disabled={!isAdmin()}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      {sortedResources.length > 0 && (
        <div className="resources-pagination">
          <div className="pagination-info">
            Showing {sortedResources.length} of {careerResources.length} resources
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <CareerResourceAddModal
          onClose={() => setShowAddModal(false)}
          onSave={loadData}
        />
      )}

      {showEditModal && currentResource && (
        <CareerResourceEditModal
          resource={currentResource}
          onClose={() => setShowEditModal(false)}
          onSave={loadData}
        />
      )}

      {showDeleteModal && (
        <CareerResourceDeleteModal
          resource={currentResource}
          selectedCount={currentResource ? 1 : selectedResources.length}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={loadData}
        />
      )}
    </div>
  );
};

export default AdminCareerResources;
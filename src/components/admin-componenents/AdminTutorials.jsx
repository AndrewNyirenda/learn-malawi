// src/components/admin-componenents/AdminTutorials.jsx
import React, { useState, useEffect } from 'react';
import { useTutorials } from '../../contexts/TutorialsContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaPlay,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCopy,
  FaTimes,
  FaSort,
  FaCheck,
  FaChartLine,
  FaSync,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendar,
  FaUserGraduate,
  FaGraduationCap,
  FaArrowUp,
  FaArrowDown,
  FaTh,
  FaList,
  FaClock,
  FaBook,
  FaVideo,
  FaYoutube
} from 'react-icons/fa';
import '../../styles/Admin-Styles/AdminTutorials.css';
import TutorialsAddModal from './TutorialsAddModal';
import TutorialsEditModal from './TutorialsEditModal';
import TutorialsDeleteModal from './TutorialsDeleteModal';
import TutorialsPreviewModal from './TutorialsPreviewModal';

const AdminTutorials = () => {
  const {
    tutorials,
    loading,
    error,
    fetchTutorials,
    fetchLevels,
    fetchSubjects,
    fetchClasses,
    clearError
  } = useTutorials();

  const { user: currentAdmin, isAdmin } = useAuth();

  const [filters, setFilters] = useState({
    level: 'secondary',
    subject: 'all',
    class: 'all',
    search: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTutorials, setSelectedTutorials] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({
    totalTutorials: 0,
    primaryTutorials: 0,
    secondaryTutorials: 0,
    totalVideos: 0
  });

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [levelsData, subjectsData, classesData, tutorialsData] = await Promise.all([
        fetchLevels(),
        fetchSubjects(filters.level),
        fetchClasses(filters.level),
        fetchTutorials(filters)
      ]);

      setLevels(levelsData);
      setSubjects(subjectsData);
      setClasses(classesData);

      // Calculate stats
      const totalTutorials = tutorialsData.data?.length || 0;
      const primaryTutorials = tutorialsData.data?.filter(t => t.level === 'primary').length || 0;
      const secondaryTutorials = tutorialsData.data?.filter(t => t.level === 'secondary').length || 0;
      const totalVideos = totalTutorials; // Each tutorial has one video

      setStats({
        totalTutorials,
        primaryTutorials,
        secondaryTutorials,
        totalVideos
      });
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  // Fetch tutorials when filters change
  useEffect(() => {
    const levelEnum = filters.level === 'primary' ? 'primary' : 'secondary';
    
    const filterParams = {
      level: levelEnum,
      ...(filters.subject !== 'all' && { subject: filters.subject }),
      ...(filters.class !== 'all' && { class: filters.class })
    };
    
    fetchTutorials(filterParams);
    
    // Update subjects and classes based on level
    fetchSubjects(levelEnum);
    fetchClasses(levelEnum);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSelectedTutorials([]);
  };

  // Handle tutorial selection
  const handleSelectTutorial = (tutorialId) => {
    if (selectedTutorials.includes(tutorialId)) {
      setSelectedTutorials(selectedTutorials.filter(id => id !== tutorialId));
    } else {
      setSelectedTutorials([...selectedTutorials, tutorialId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTutorials.length === tutorials.length) {
      setSelectedTutorials([]);
    } else {
      setSelectedTutorials(tutorials.map(tutorial => tutorial.id));
    }
  };

  // Handle actions
  const handleAddTutorial = () => {
    setShowAddModal(true);
  };

  const handleEditTutorial = (tutorial) => {
    setCurrentTutorial(tutorial);
    setShowEditModal(true);
  };

  const handleDeleteTutorial = (tutorial) => {
    setCurrentTutorial(tutorial);
    setShowDeleteModal(true);
  };

  const handlePreviewTutorial = (tutorial) => {
    setCurrentTutorial(tutorial);
    setShowPreviewModal(true);
  };

  const handleDeleteMultiple = () => {
    setCurrentTutorial(null);
    setShowDeleteModal(true);
  };

  const handleCopyTutorial = (tutorial) => {
    // Create a copy of the tutorial
    const tutorialCopy = {
      ...tutorial,
      title: `${tutorial.title} (Copy)`,
      id: null // Let backend generate new ID
    };
    
    setCurrentTutorial(tutorialCopy);
    setShowAddModal(true);
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

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
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

  // Filter tutorials by search term
  const filteredTutorials = tutorials.filter(tutorial => {
    if (!filters.search) return true;
    
    const searchTerm = filters.search.toLowerCase();
    return (
      tutorial.title?.toLowerCase().includes(searchTerm) ||
      tutorial.subject?.toLowerCase().includes(searchTerm) ||
      tutorial.description?.toLowerCase().includes(searchTerm) ||
      tutorial.class?.toLowerCase().includes(searchTerm)
    );
  });

  if (loading && tutorials.length === 0) {
    return (
      <div className="admin-tutorials">
        <div className="loading-tutorials">
          <div className="spinner"></div>
          <p>Loading tutorials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-tutorials">
      {/* Header */}
      <div className="tutorials-header">
        <div className="header-left">
          <h2>Tutorials Management</h2>
          <p>Manage video tutorials and educational content</p>
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
            className="btn-add-tutorial" 
            onClick={handleAddTutorial}
            disabled={!isAdmin() && currentAdmin?.role !== 'TEACHER'}
            title={isAdmin() || currentAdmin?.role === 'TEACHER' ? "Add new tutorial" : "Admin/Teacher access required"}
          >
            <FaPlus /> Add Tutorial
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
      <div className="tutorials-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaPlay />
          </div>
          <div className="stat-content">
            <h3>{stats.totalTutorials}</h3>
            <p>Total Tutorials</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">
            <FaGraduationCap />
          </div>
          <div className="stat-content">
            <h3>{stats.primaryTutorials}</h3>
            <p>Primary Level</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">
            <FaUserGraduate />
          </div>
          <div className="stat-content">
            <h3>{stats.secondaryTutorials}</h3>
            <p>Secondary Level</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon videos">
            <FaVideo />
          </div>
          <div className="stat-content">
            <h3>{stats.totalVideos}</h3>
            <p>Video Content</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="tutorials-controls">
        {/* Search Bar */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tutorials by title, subject, or description..."
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
          {/* Level Tabs */}
          <div className="level-tabs">
            <button
              className={filters.level === 'primary' ? 'active' : ''}
              onClick={() => handleFilterChange('level', 'primary')}
            >
              <FaGraduationCap /> Primary
            </button>
            <button
              className={filters.level === 'secondary' ? 'active' : ''}
              onClick={() => handleFilterChange('level', 'secondary')}
            >
              <FaUserGraduate /> Secondary
            </button>
          </div>

          {/* Filter Controls */}
          <div className="filter-controls">
            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select 
                value={filters.subject} 
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select 
                value={filters.class} 
                onChange={(e) => handleFilterChange('class', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <FaSort className="filter-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="createdAt">Newest First</option>
                <option value="title">Title A-Z</option>
                <option value="subject">Subject</option>
                <option value="class">Class</option>
              </select>
              <button 
                className="sort-order" 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
              </button>
            </div>
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
      {selectedTutorials.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            <FaCheckCircle />
            <span>{selectedTutorials.length} tutorial(s) selected</span>
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
              onClick={() => setSelectedTutorials([])}
            >
              <FaTimesCircle /> Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Tutorials Gallery */}
      <div className="tutorials-gallery-container">
        {filteredTutorials.length === 0 ? (
          <div className="no-tutorials">
            <FaPlay className="no-tutorials-icon" />
            <h3>No tutorials found</h3>
            <p>{filters.search ? 'Try a different search term' : 'Add your first tutorial to get started'}</p>
            <button className="btn-add-tutorial" onClick={handleAddTutorial}>
              <FaPlus /> Add First Tutorial
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="tutorials-grid">
            {filteredTutorials.map(tutorial => (
              <div 
                key={tutorial.id} 
                className={`tutorial-card ${selectedTutorials.includes(tutorial.id) ? 'selected' : ''}`}
              >
                {/* Selection Checkbox */}
                <div className="tutorial-select">
                  <input
                    type="checkbox"
                    checked={selectedTutorials.includes(tutorial.id)}
                    onChange={() => handleSelectTutorial(tutorial.id)}
                    disabled={!isAdmin()}
                  />
                </div>

                {/* Thumbnail */}
                <div className="tutorial-thumbnail" onClick={() => handlePreviewTutorial(tutorial)}>
                  <div className="tutorial-thumbnail-content">
                    <FaVideo className="tutorial-thumbnail-icon" />
                    <h4>{tutorial.title}</h4>
                    <p>{tutorial.subject} • {tutorial.class}</p>
                  </div>
                  <div className="thumbnail-overlay">
                    <button className="view-btn-overlay" title="Preview Tutorial">
                      <FaEye />
                    </button>
                  </div>
                </div>

                {/* Tutorial Info */}
                <div className="tutorial-info">
                  <h3 className="tutorial-title">{tutorial.title}</h3>
                  
                  <div className="tutorial-meta">
                    <span className="tutorial-level">
                      {tutorial.level === 'primary' ? <FaGraduationCap /> : <FaUserGraduate />}
                      {tutorial.level === 'primary' ? 'Primary' : 'Secondary'}
                    </span>
                    <span className="tutorial-subject">
                      <FaBook /> {tutorial.subject}
                    </span>
                    <span className="tutorial-class">
                      <FaBook /> {tutorial.class}
                    </span>
                    <span className="tutorial-type">
                      <FaVideo /> Video
                    </span>
                  </div>

                  <div className="tutorial-details">
                    <div className="detail-item">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">
                        {tutorial.description?.substring(0, 80)}...
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Video URL:</span>
                      <span className="detail-value">
                        {tutorial.videoUrl ? (
                          <a 
                            href={tutorial.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{ color: '#4a90e2', textDecoration: 'none' }}
                          >
                            <FaYoutube /> Watch
                          </a>
                        ) : 'Not set'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Added:</span>
                      <span className="detail-value">{formatDate(tutorial.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="tutorial-actions">
                  <button 
                    className="btn-action preview"
                    onClick={() => handlePreviewTutorial(tutorial)}
                    title="Preview Tutorial"
                  >
                    <FaEye />
                  </button>
                  
                  <button 
                    className="btn-action copy"
                    onClick={() => handleCopyTutorial(tutorial)}
                    title="Duplicate Tutorial"
                  >
                    <FaCopy />
                  </button>
                  
                  <button 
                    className="btn-action edit"
                    onClick={() => handleEditTutorial(tutorial)}
                    title="Edit Tutorial"
                    disabled={!isAdmin() && tutorial.createdBy !== currentAdmin?.id}
                  >
                    <FaEdit />
                  </button>
                  
                  <button 
                    className="btn-action delete"
                    onClick={() => handleDeleteTutorial(tutorial)}
                    title="Delete Tutorial"
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
          <div className="tutorials-list">
            <table className="tutorials-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedTutorials.length === filteredTutorials.length && filteredTutorials.length > 0}
                      onChange={handleSelectAll}
                      disabled={!isAdmin()}
                    />
                  </th>
                  <th>Tutorial Title</th>
                  <th>Level</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Video</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTutorials.map(tutorial => (
                  <tr key={tutorial.id} className={selectedTutorials.includes(tutorial.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTutorials.includes(tutorial.id)}
                        onChange={() => handleSelectTutorial(tutorial.id)}
                        disabled={!isAdmin()}
                      />
                    </td>
                    <td>
                      <div className="tutorial-title-cell">
                        <div className="tutorial-icon">
                          <FaVideo />
                        </div>
                        <div>
                          <strong>{tutorial.title}</strong>
                          <small>{tutorial.description?.substring(0, 50)}...</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`level-badge ${tutorial.level}`}>
                        {tutorial.level === 'primary' ? 'Primary' : 'Secondary'}
                      </span>
                    </td>
                    <td>
                      <span className="subject-badge">{tutorial.subject}</span>
                    </td>
                    <td>{tutorial.class}</td>
                    <td>
                      {tutorial.videoUrl ? (
                        <span className="video-status available">
                          <FaCheck /> Available
                        </span>
                      ) : (
                        <span className="video-status missing">
                          <FaTimes /> Missing
                        </span>
                      )}
                    </td>
                    <td>{formatDate(tutorial.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-action preview"
                          onClick={() => handlePreviewTutorial(tutorial)}
                          title="Preview"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn-action copy"
                          onClick={() => handleCopyTutorial(tutorial)}
                          title="Duplicate"
                        >
                          <FaCopy />
                        </button>
                        <button 
                          className="btn-action edit"
                          onClick={() => handleEditTutorial(tutorial)}
                          title="Edit"
                          disabled={!isAdmin() && tutorial.createdBy !== currentAdmin?.id}
                        >
                          <FaEdit />
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

      {/* Pagination */}
      {filteredTutorials.length > 0 && (
        <div className="tutorials-pagination">
          <div className="pagination-info">
            Showing {filteredTutorials.length} of {tutorials.length} tutorials
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <TutorialsAddModal
          onClose={() => setShowAddModal(false)}
          onSave={loadData}
          tutorialToCopy={currentTutorial}
        />
      )}

      {showEditModal && currentTutorial && (
        <TutorialsEditModal
          tutorial={currentTutorial}
          onClose={() => setShowEditModal(false)}
          onSave={loadData}
        />
      )}

      {showDeleteModal && (
        <TutorialsDeleteModal
          tutorial={currentTutorial}
          selectedCount={currentTutorial ? 1 : selectedTutorials.length}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={loadData}
        />
      )}

      {showPreviewModal && currentTutorial && (
        <TutorialsPreviewModal
          tutorial={currentTutorial}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};

export default AdminTutorials;
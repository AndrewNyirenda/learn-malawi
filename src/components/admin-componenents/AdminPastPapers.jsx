// src/components/admin-componenents/AdminPastPapers.jsx
import React, { useState, useEffect } from 'react';
import { usePastPapers } from '../../contexts/PastPapersContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaFileAlt,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaUpload,
  FaTimes,
  FaSort,
  FaCheck,
  FaFilePdf,
  FaImage,
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
  FaUniversity,
  FaCalendarAlt
} from 'react-icons/fa';
import '../../styles/Admin-Styles/AdminPastPapers.css';
import PastPapersAddModal from './PastPapersAddModal';
import PastPapersEditModal from './PastPapersEditModal';
import PastPapersDeleteModal from './PastPapersDeleteModal';
import PastPapersUploadModal from './PastPapersUploadModal';

const AdminPastPapers = () => {
  const {
    pastPapers,
    categories,
    classes,
    years,
    examinationBodies,
    loading,
    error,
    fetchPastPapers,
    fetchCategories,
    fetchClasses,
    fetchYears,
    fetchExaminationBodies,
    fetchStats,
    clearError
  } = usePastPapers();

  const { user: currentAdmin, isAdmin } = useAuth();

  const [filters, setFilters] = useState({
    level: 'secondary',
    category: 'all',
    class: 'all',
    year: 'all',
    examinationBody: 'all',
    search: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPaper, setCurrentPaper] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [stats, setStats] = useState({
    totalPastPapers: 0,
    totalDownloads: 0,
    totalViews: 0,
    pastPapersByLevel: []
  });

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const levelEnum = filters.level === 'primary' ? 'primary' : 'secondary';
    
    await Promise.all([
      fetchCategories(levelEnum),
      fetchClasses(levelEnum),
      fetchYears(levelEnum),
      fetchExaminationBodies(levelEnum),
      fetchPastPapers(1, 50, filters)
    ]);
    
    // Fetch stats if admin
    if (isAdmin()) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const statsData = await fetchStats(token);
        if (statsData) setStats(statsData);
      }
    }
  };

  // Fetch papers when filters change
  useEffect(() => {
    const levelEnum = filters.level === 'primary' ? 'primary' : 'secondary';
    
    const filterParams = {
      level: levelEnum,
      ...(filters.category !== 'all' && { category: filters.category }),
      ...(filters.class !== 'all' && { class: filters.class }),
      ...(filters.year !== 'all' && { year: filters.year }),
      ...(filters.examinationBody !== 'all' && { examinationBody: filters.examinationBody }),
      ...(filters.search && { search: filters.search })
    };
    
    fetchPastPapers(1, 50, filterParams);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSelectedPapers([]);
  };

  // Handle paper selection
  const handleSelectPaper = (paperId) => {
    if (selectedPapers.includes(paperId)) {
      setSelectedPapers(selectedPapers.filter(id => id !== paperId));
    } else {
      setSelectedPapers([...selectedPapers, paperId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedPapers.length === pastPapers.length) {
      setSelectedPapers([]);
    } else {
      setSelectedPapers(pastPapers.map(paper => paper.id));
    }
  };

  // Handle actions
  const handleAddPaper = () => {
    setShowAddModal(true);
  };

  const handleEditPaper = (paper) => {
    setCurrentPaper(paper);
    setShowEditModal(true);
  };

  const handleDeletePaper = (paper) => {
    setCurrentPaper(paper);
    setShowDeleteModal(true);
  };

  const handleUploadFile = (paper) => {
    setCurrentPaper(paper);
    setShowUploadModal(true);
  };

  const handleDeleteMultiple = () => {
    setCurrentPaper(null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // Implement delete logic here
    console.log('Delete papers:', currentPaper ? [currentPaper.id] : selectedPapers);
    setShowDeleteModal(false);
    await loadData();
  };

  // View PDF in new tab
  const handleViewPDF = (paper) => {
    if (paper.fileUrl) {
      window.open(paper.fileUrl, '_blank');
    }
  };

  // Download PDF
  const handleDownloadPDF = (paper) => {
    if (paper.fileUrl) {
      const link = document.createElement('a');
      link.href = paper.fileUrl;
      link.download = paper.fileName || paper.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  // Handle refresh
  const handleRefresh = () => {
    loadData();
    clearError();
  };

  // Clear search
  const handleClearSearch = () => {
    handleFilterChange('search', '');
  };

  // Get available data
  const allCategories = ["all", ...categories.map(cat => cat.category)].filter(Boolean);
  const availableClasses = ["all", ...classes.map(cls => cls.class)].filter(Boolean);
  const availableYears = ["all", ...years.map(y => y.year.toString())].filter(Boolean);
  const availableExaminationBodies = ["all", ...examinationBodies.map(eb => eb.examinationBody)].filter(Boolean);

  if (loading && pastPapers.length === 0) {
    return (
      <div className="admin-past-papers">
        <div className="loading-papers">
          <div className="spinner"></div>
          <p>Loading past papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-past-papers">
      {/* Header */}
      <div className="papers-header">
        <div className="header-left">
          <h2>Past Papers Management</h2>
          <p>Manage examination past papers and answer keys</p>
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
            className="btn-add-paper" 
            onClick={handleAddPaper}
            disabled={!isAdmin()}
            title={isAdmin() ? "Add new past paper" : "Admin access required"}
          >
            <FaPlus /> Add New
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
      <div className="papers-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>{stats.totalPastPapers || pastPapers.length}</h3>
            <p>Total Papers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon downloads">
            <FaDownload />
          </div>
          <div className="stat-content">
            <h3>{stats.totalDownloads || 0}</h3>
            <p>Downloads</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon views">
            <FaEye />
          </div>
          <div className="stat-content">
            <h3>{stats.totalViews || 0}</h3>
            <p>Views</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">
            <FaGraduationCap />
          </div>
          <div className="stat-content">
            <h3>
              {stats.pastPapersByLevel?.find(b => b.level === 'primary')?.count || 
               pastPapers.filter(p => p.level === 'primary').length}
            </h3>
            <p>Primary</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="papers-controls">
        {/* Search Bar */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search past papers by title, subject, or exam body..."
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
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {allCategories.filter(cat => cat !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
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
                {availableClasses.filter(cls => cls !== 'all').map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <FaCalendarAlt className="filter-icon" />
              <select 
                value={filters.year} 
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Years</option>
                {availableYears.filter(year => year !== 'all').map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <FaUniversity className="filter-icon" />
              <select 
                value={filters.examinationBody} 
                onChange={(e) => handleFilterChange('examinationBody', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Exam Bodies</option>
                {availableExaminationBodies.filter(eb => eb !== 'all').map(eb => (
                  <option key={eb} value={eb}>{eb}</option>
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
                <option value="year">Year (Newest)</option>
                <option value="title">Title A-Z</option>
                <option value="downloadCount">Most Downloads</option>
                <option value="viewCount">Most Views</option>
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
      {selectedPapers.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            <FaCheckCircle />
            <span>{selectedPapers.length} paper(s) selected</span>
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
              onClick={() => setSelectedPapers([])}
            >
              <FaTimesCircle /> Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Papers Gallery */}
      <div className="papers-gallery-container">
        {pastPapers.length === 0 ? (
          <div className="no-papers">
            <FaFileAlt className="no-papers-icon" />
            <h3>No past papers found</h3>
            <p>{filters.search ? 'Try a different search term' : 'Add your first past paper to get started'}</p>
            <button className="btn-add-paper" onClick={handleAddPaper}>
              <FaPlus /> Add First Paper
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="papers-grid">
            {pastPapers.map(paper => (
              <div 
                key={paper.id} 
                className={`paper-card ${selectedPapers.includes(paper.id) ? 'selected' : ''}`}
              >
                {/* Selection Checkbox */}
                <div className="paper-select">
                  <input
                    type="checkbox"
                    checked={selectedPapers.includes(paper.id)}
                    onChange={() => handleSelectPaper(paper.id)}
                    disabled={!isAdmin()}
                  />
                </div>

                {/* Thumbnail */}
                <div className="paper-thumbnail" onClick={() => handleViewPDF(paper)}>
                  {paper.thumbnailUrl ? (
                    <img 
                      src={paper.thumbnailUrl} 
                      alt={paper.title}
                      onError={(e) => {
                        e.target.src = '/images/pdf.png';
                        e.target.className = 'thumbnail-fallback';
                      }}
                    />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <FaFilePdf />
                      <span>{paper.year}</span>
                    </div>
                  )}
                  <div className="thumbnail-overlay">
                    <button className="view-btn-overlay" title="View PDF">
                      <FaEye />
                    </button>
                  </div>
                </div>

                {/* Paper Info */}
                <div className="paper-info">
                  <h3 className="paper-title">{paper.title}</h3>
                  
                  <div className="paper-meta">
                    <span className="paper-year">
                      <FaCalendarAlt /> {paper.year}
                    </span>
                    <span className="paper-category">{paper.category}</span>
                    <span className="paper-class">{paper.class}</span>
                    {paper.examinationBody && (
                      <span className="paper-exam-body">
                        <FaUniversity /> {paper.examinationBody}
                      </span>
                    )}
                  </div>

                  <div className="paper-details">
                    {paper.subject && (
                      <div className="detail-item">
                        <span className="detail-label">Subject:</span>
                        <span className="detail-value">{paper.subject}</span>
                      </div>
                    )}
                    {paper.paperNumber && (
                      <div className="detail-item">
                        <span className="detail-label">Paper:</span>
                        <span className="detail-value">{paper.paperNumber}</span>
                      </div>
                    )}
                    {paper.paperType && (
                      <div className="detail-item">
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{paper.paperType}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Added:</span>
                      <span className="detail-value">{formatDate(paper.createdAt)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="paper-stats">
                    <div className="stat">
                      <FaEye />
                      <span>{paper.viewCount || 0}</span>
                    </div>
                    <div className="stat">
                      <FaDownload />
                      <span>{paper.downloadCount || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="paper-actions">
                  <button 
                    className="btn-action view"
                    onClick={() => handleViewPDF(paper)}
                    title="View PDF"
                  >
                    <FaEye />
                  </button>
                  
                  <button 
                    className="btn-action download"
                    onClick={() => handleDownloadPDF(paper)}
                    title="Download PDF"
                  >
                    <FaDownload />
                  </button>
                  
                  <button 
                    className="btn-action edit"
                    onClick={() => handleEditPaper(paper)}
                    title="Edit"
                    disabled={paper.uploadedById !== currentAdmin?.id && !isAdmin()}
                  >
                    <FaEdit />
                  </button>
                  
                  <button 
                    className="btn-action delete"
                    onClick={() => handleDeletePaper(paper)}
                    title="Delete"
                    disabled={!isAdmin()}
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Upload Status */}
                {!paper.fileUrl && (
                  <div className="upload-status">
                    <span className="status-badge warning">
                      <FaFileAlt /> No PDF uploaded
                    </span>
                    <button 
                      className="btn-upload-small"
                      onClick={() => handleUploadFile(paper)}
                      title="Upload PDF"
                    >
                      <FaUpload /> Upload
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="papers-list">
            <table className="papers-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedPapers.length === pastPapers.length && pastPapers.length > 0}
                      onChange={handleSelectAll}
                      disabled={!isAdmin()}
                    />
                  </th>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Class</th>
                  <th>Exam Body</th>
                  <th>File</th>
                  <th>Views</th>
                  <th>Downloads</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pastPapers.map(paper => (
                  <tr key={paper.id} className={selectedPapers.includes(paper.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPapers.includes(paper.id)}
                        onChange={() => handleSelectPaper(paper.id)}
                        disabled={!isAdmin()}
                      />
                    </td>
                    <td>
                      <div className="paper-title-cell">
                        <div className="paper-icon">
                          <FaFileAlt />
                        </div>
                        <div>
                          <strong>{paper.title}</strong>
                          <small>{paper.subject} • {paper.category}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="year-badge">{paper.year}</span>
                    </td>
                    <td>{paper.class}</td>
                    <td>
                      <span className="exam-body">{paper.examinationBody || 'N/A'}</span>
                    </td>
                    <td>
                      {paper.fileUrl ? (
                        <span className="file-status success">
                          <FaCheck /> Uploaded
                        </span>
                      ) : (
                        <span className="file-status warning">
                          <FaTimes /> Missing
                        </span>
                      )}
                    </td>
                    <td>{paper.viewCount || 0}</td>
                    <td>{paper.downloadCount || 0}</td>
                    <td>{formatDate(paper.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-action"
                          onClick={() => handleViewPDF(paper)}
                          title="View"
                          disabled={!paper.fileUrl}
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn-action"
                          onClick={() => handleDownloadPDF(paper)}
                          title="Download"
                          disabled={!paper.fileUrl}
                        >
                          <FaDownload />
                        </button>
                        <button 
                          className="btn-action"
                          onClick={() => handleEditPaper(paper)}
                          title="Edit"
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
      {pastPapers.length > 0 && (
        <div className="papers-pagination">
          <div className="pagination-info">
            Showing {pastPapers.length} of {stats.totalPastPapers || pastPapers.length} papers
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <PastPapersAddModal
          onClose={() => setShowAddModal(false)}
          onSave={loadData}
        />
      )}

      {showEditModal && currentPaper && (
        <PastPapersEditModal
          paper={currentPaper}
          onClose={() => setShowEditModal(false)}
          onSave={loadData}
        />
      )}

      {showDeleteModal && (
        <PastPapersDeleteModal
          paper={currentPaper}
          selectedCount={currentPaper ? 1 : selectedPapers.length}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}

      {showUploadModal && currentPaper && (
        <PastPapersUploadModal
          paper={currentPaper}
          onClose={() => setShowUploadModal(false)}
          onSave={loadData}
        />
      )}
    </div>
  );
};

export default AdminPastPapers;
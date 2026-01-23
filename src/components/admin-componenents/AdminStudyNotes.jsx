// src/components/admin-componenents/AdminStudyNotes.jsx
import React, { useState, useEffect } from 'react';
import { useStudyNotes } from '../../contexts/StudyNotesContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaBook,
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
  FaUsers,
  FaSync,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendar,
  FaUserGraduate,
  FaGraduationCap,
  FaArrowUp,
  FaArrowDown,
  FaCog,
  FaFileAlt,
  FaTh,
  FaList,
  FaEyeSlash,
  FaExternalLinkAlt,
  FaFileMedical,
  FaCopy,
  FaShare,
  FaRegBookmark,
  FaBookmark
} from 'react-icons/fa';
import '../../styles/Admin-Styles/AdminStudyNotes.css';
import StudyNotesAddModal from './StudyNotesAddModal';
import StudyNotesEditModal from './StudyNotesEditModal';
import StudyNotesDeleteModal from './StudyNotesDeleteModal';
import StudyNotesUploadModal from './StudyNotesUploadModal';

const AdminStudyNotes = () => {
  const {
    books,
    categories,
    classes,
    loading,
    error,
    fetchBooks,
    fetchCategories,
    fetchClasses,
    fetchStats,
    clearError,
    deleteBook
  } = useStudyNotes();

  const { user: currentAdmin, isAdmin } = useAuth();

  const [filters, setFilters] = useState({
    level: 'secondary',
    category: 'all',
    class: 'all',
    search: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalDownloads: 0,
    totalViews: 0,
    booksByLevel: []
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
      fetchBooks(1, 50, filters) // Show 50 items for admin gallery
    ]);
    
    // Fetch stats if admin
    if (isAdmin()) {
      const token = localStorage.getItem('accessToken');
      const statsData = await fetchStats(token);
      if (statsData) setStats(statsData);
    }
  };

  // Fetch books when filters change
  useEffect(() => {
    const levelEnum = filters.level === 'primary' ? 'primary' : 'secondary';
    
    const filterParams = {
      level: levelEnum,
      ...(filters.category !== 'all' && { category: filters.category }),
      ...(filters.class !== 'all' && { class: filters.class }),
      ...(filters.search && { search: filters.search })
    };
    
    fetchBooks(1, 50, filterParams);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSelectedBooks([]); // Clear selection when filters change
  };

  // Handle book selection
  const handleSelectBook = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === books.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(books.map(book => book.id));
    }
  };

  // Handle actions
  const handleAddBook = () => {
    setShowAddModal(true);
  };

  const handleEditBook = (book) => {
    setCurrentBook(book);
    setShowEditModal(true);
  };

  const handleDeleteBook = (book) => {
    setCurrentBook(book);
    setShowDeleteModal(true);
  };

  const handleUploadFile = (book) => {
    setCurrentBook(book);
    setShowUploadModal(true);
  };

  const handleDeleteMultiple = () => {
    setCurrentBook(null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Authentication required. Please login again.');
    }

    if (currentBook) {
      // Delete single book
      const result = await deleteBook(currentBook.id, token);
      if (result && result.success) {
        console.log('✅ Book deleted successfully:', currentBook.title);
      } else {
        const errorMsg = result?.error || 'Failed to delete book';
        throw new Error(errorMsg);
      }
    } else if (selectedBooks.length > 0) {
      // Delete multiple books
      const deletePromises = selectedBooks.map(bookId => 
        deleteBook(bookId, token)
      );
      
      const results = await Promise.allSettled(deletePromises);
      
      // Check for any failures
      const failures = results.filter(result => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && !result.value?.success)
      );
      
      if (failures.length > 0) {
        throw new Error(`${failures.length} books failed to delete`);
      }
      
      console.log(`✅ ${selectedBooks.length} books deleted successfully`);
      setSelectedBooks([]); // Clear selection after deletion
    }

    setShowDeleteModal(false);
    setCurrentBook(null);
    
    // Refresh the data
    await loadData();
    
  } catch (error) {
    console.error('❌ Delete failed:', error);
    // You could show an error message to the user here
  }
};

  // View PDF in new tab
  const handleViewPDF = (book) => {
    if (book.fileUrl) {
      window.open(book.fileUrl, '_blank');
    }
  };

  // Download PDF
  const handleDownloadPDF = (book) => {
    if (book.fileUrl) {
      const link = document.createElement('a');
      link.href = book.fileUrl;
      link.download = book.fileName || book.title;
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

  // Get available categories and classes
  const allCategories = ["all", ...categories.map(cat => cat.category)].filter(Boolean);
  const availableClasses = ["all", ...classes.map(cls => cls.class)].filter(Boolean);

  if (loading && books.length === 0) {
    return (
      <div className="admin-study-notes">
        <div className="loading-books">
          <div className="spinner"></div>
          <p>Loading study notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-study-notes">
      {/* Header */}
      <div className="books-header">
        <div className="header-left">
          <h2>Study Notes Management</h2>
          <p>Manage PDFs and educational materials</p>
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
            className="btn-add-book" 
            onClick={handleAddBook}
            disabled={!isAdmin()}
            title={isAdmin() ? "Add new study note" : "Admin access required"}
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

      {/* Stats Cards - Mobile Friendly */}
      <div className="books-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaBook />
          </div>
          <div className="stat-content">
            <h3>{stats.totalBooks || books.length}</h3>
            <p>Total Notes</p>
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
              {stats.booksByLevel?.find(b => b.level === 'primary')?.count || 
               books.filter(b => b.level === 'primary').length}
            </h3>
            <p>Primary</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="books-controls">
        {/* Search Bar */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search notes by title, author, or subject..."
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
              <FaSort className="filter-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="createdAt">Newest First</option>
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
      {selectedBooks.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            <FaCheckCircle />
            <span>{selectedBooks.length} note(s) selected</span>
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
              onClick={() => setSelectedBooks([])}
            >
              <FaTimesCircle /> Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Books Gallery */}
      <div className="books-gallery-container">
        {books.length === 0 ? (
          <div className="no-books">
            <FaBook className="no-books-icon" />
            <h3>No study notes found</h3>
            <p>{filters.search ? 'Try a different search term' : 'Add your first study note to get started'}</p>
            <button className="btn-add-book" onClick={handleAddBook}>
              <FaPlus /> Add First Note
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="books-grid">
            {books.map(book => (
              <div 
                key={book.id} 
                className={`book-card ${selectedBooks.includes(book.id) ? 'selected' : ''}`}
              >
                {/* Selection Checkbox */}
                <div className="book-select">
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book.id)}
                    onChange={() => handleSelectBook(book.id)}
                    disabled={!isAdmin()}
                  />
                </div>

                {/* Thumbnail */}
                <div className="book-thumbnail" onClick={() => handleViewPDF(book)}>
                  {book.thumbnailUrl ? (
                    <img 
                      src={book.thumbnailUrl} 
                      alt={book.title}
                      onError={(e) => {
                        e.target.src = '/images/pdf.png';
                        e.target.className = 'thumbnail-fallback';
                      }}
                    />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <FaFilePdf />
                      <span>PDF</span>
                    </div>
                  )}
                  <div className="thumbnail-overlay">
                    <button className="view-btn-overlay" title="View PDF">
                      <FaEye />
                    </button>
                  </div>
                </div>

                {/* Book Info */}
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  
                  <div className="book-meta">
                    <span className="book-category">{book.category}</span>
                    <span className="book-class">{book.class}</span>
                    {book.subject && <span className="book-subject">{book.subject}</span>}
                  </div>

                  <div className="book-details">
                    {book.author && (
                      <div className="detail-item">
                        <span className="detail-label">Author:</span>
                        <span className="detail-value">{book.author}</span>
                      </div>
                    )}
                    {book.year && (
                      <div className="detail-item">
                        <span className="detail-label">Year:</span>
                        <span className="detail-value">{book.year}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Added:</span>
                      <span className="detail-value">{formatDate(book.createdAt)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="book-stats">
                    <div className="stat">
                      <FaEye />
                      <span>{book.viewCount || 0}</span>
                    </div>
                    <div className="stat">
                      <FaDownload />
                      <span>{book.downloadCount || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="book-actions">
                  <button 
                    className="btn-action view"
                    onClick={() => handleViewPDF(book)}
                    title="View PDF"
                  >
                    <FaEye />
                  </button>
                  
                  <button 
                    className="btn-action download"
                    onClick={() => handleDownloadPDF(book)}
                    title="Download PDF"
                  >
                    <FaDownload />
                  </button>
                  
                  <button 
                    className="btn-action edit"
                    onClick={() => handleEditBook(book)}
                    title="Edit"
                    disabled={book.uploadedById !== currentAdmin?.id && !isAdmin()}
                  >
                    <FaEdit />
                  </button>
                  
                  <button 
                    className="btn-action delete"
                    onClick={() => handleDeleteBook(book)}
                    title="Delete"
                    disabled={!isAdmin()}
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Upload Status */}
                {!book.fileUrl && (
                  <div className="upload-status">
                    <span className="status-badge warning">
                      <FaFileMedical /> No PDF uploaded
                    </span>
                    <button 
                      className="btn-upload-small"
                      onClick={() => handleUploadFile(book)}
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
          <div className="books-list">
            <table className="books-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedBooks.length === books.length && books.length > 0}
                      onChange={handleSelectAll}
                      disabled={!isAdmin()}
                    />
                  </th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Class</th>
                  <th>File</th>
                  <th>Views</th>
                  <th>Downloads</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id} className={selectedBooks.includes(book.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => handleSelectBook(book.id)}
                        disabled={!isAdmin()}
                      />
                    </td>
                    <td>
                      <div className="book-title-cell">
                        <div className="book-icon">
                          <FaFilePdf />
                        </div>
                        <div>
                          <strong>{book.title}</strong>
                          {book.author && <small>{book.author}</small>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{book.category}</span>
                    </td>
                    <td>{book.class}</td>
                    <td>
                      {book.fileUrl ? (
                        <span className="file-status success">
                          <FaCheck /> Uploaded
                        </span>
                      ) : (
                        <span className="file-status warning">
                          <FaTimes /> Missing
                        </span>
                      )}
                    </td>
                    <td>{book.viewCount || 0}</td>
                    <td>{book.downloadCount || 0}</td>
                    <td>{formatDate(book.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-action"
                          onClick={() => handleViewPDF(book)}
                          title="View"
                          disabled={!book.fileUrl}
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn-action"
                          onClick={() => handleDownloadPDF(book)}
                          title="Download"
                          disabled={!book.fileUrl}
                        >
                          <FaDownload />
                        </button>
                        <button 
                          className="btn-action"
                          onClick={() => handleEditBook(book)}
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
      {books.length > 0 && (
        <div className="books-pagination">
          <div className="pagination-info">
            Showing {books.length} of {stats.totalBooks || books.length} notes
          </div>
          {/* Add pagination controls here if needed */}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <StudyNotesAddModal
          onClose={() => setShowAddModal(false)}
          onSave={loadData}
        />
      )}

      {showEditModal && currentBook && (
        <StudyNotesEditModal
          book={currentBook}
          onClose={() => setShowEditModal(false)}
          onSave={loadData}
        />
      )}

      {showDeleteModal && (
        <StudyNotesDeleteModal
          book={currentBook}
          selectedCount={currentBook ? 1 : selectedBooks.length}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}

      {showUploadModal && currentBook && (
        <StudyNotesUploadModal
          book={currentBook}
          onClose={() => setShowUploadModal(false)}
          onSave={loadData}
        />
      )}
    </div>
  );
};

export default AdminStudyNotes;
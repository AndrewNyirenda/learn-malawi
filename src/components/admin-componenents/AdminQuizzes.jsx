// src/components/admin-componenents/AdminQuizzes.jsx
import React, { useState, useEffect } from 'react';
import { useQuizzes } from '../../contexts/QuizzesContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaQuestionCircle,
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
  FaBrain
} from 'react-icons/fa';
import '../../styles/Admin-Styles/AdminQuizzes.css';
import QuizzesAddModal from './QuizzesAddModal';
import QuizzesEditModal from './QuizzesEditModal';
import QuizzesDeleteModal from './QuizzesDeleteModal';
import QuizzesPreviewModal from './QuizzesPreviewModal';

const AdminQuizzes = () => {
  const {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    fetchLevels,
    fetchSubjects,
    fetchClasses,
    clearError
  } = useQuizzes();

  const { user: currentAdmin, isAdmin } = useAuth();

  const [filters, setFilters] = useState({
    level: 'all',
    subject: 'all',
    difficulty: 'all',
    class: 'all',
    search: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalCompleted: 0,
    quizzesByLevel: []
  });

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [levelsData, subjectsData, classesData, quizzesData] = await Promise.all([
        fetchLevels(),
        fetchSubjects(filters.level),
        fetchClasses(filters.level),
        fetchQuizzes(filters)
      ]);

      setLevels(levelsData);
      setSubjects(subjectsData);
      setClasses(classesData);

      // Calculate stats
      const totalQuizzes = quizzesData.data?.length || 0;
      const totalQuestions = quizzesData.data?.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0) || 0;
      
      // Simulate completed quizzes (in real app, fetch from API)
      const totalCompleted = Math.floor(totalQuizzes * 0.3); // 30% completion rate

      setStats({
        totalQuizzes,
        totalQuestions,
        totalCompleted,
        quizzesByLevel: [
          { level: 'primary', count: quizzesData.data?.filter(q => q.level === 'primary').length || 0 },
          { level: 'secondary', count: quizzesData.data?.filter(q => q.level === 'secondary').length || 0 }
        ]
      });
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  // Fetch quizzes when filters change
  useEffect(() => {
    const levelEnum = filters.level === 'primary' ? 'primary' : 'secondary';
    
    const filterParams = {
      level: levelEnum,
      ...(filters.subject !== 'all' && { subject: filters.subject }),
      ...(filters.difficulty !== 'all' && { difficulty: filters.difficulty }),
      ...(filters.class !== 'all' && { class: filters.class })
    };
    
    fetchQuizzes(filterParams);
    
    // Update subjects and classes based on level
    fetchSubjects(levelEnum);
    fetchClasses(levelEnum);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSelectedQuizzes([]);
  };

  // Handle quiz selection
  const handleSelectQuiz = (quizId) => {
    if (selectedQuizzes.includes(quizId)) {
      setSelectedQuizzes(selectedQuizzes.filter(id => id !== quizId));
    } else {
      setSelectedQuizzes([...selectedQuizzes, quizId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedQuizzes.length === quizzes.length) {
      setSelectedQuizzes([]);
    } else {
      setSelectedQuizzes(quizzes.map(quiz => quiz.id));
    }
  };

  // Handle actions
  const handleAddQuiz = () => {
    setShowAddModal(true);
  };

  const handleEditQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setShowEditModal(true);
  };

  const handleDeleteQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setShowDeleteModal(true);
  };

  const handlePreviewQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setShowPreviewModal(true);
  };

  const handleDeleteMultiple = () => {
    setCurrentQuiz(null);
    setShowDeleteModal(true);
  };

  const handleCopyQuiz = (quiz) => {
    // Create a copy of the quiz
    const quizCopy = {
      ...quiz,
      title: `${quiz.title} (Copy)`,
      id: null // Let backend generate new ID
    };
    
    setCurrentQuiz(quizCopy);
    setShowAddModal(true);
  };

  // Calculate total time for quiz
  const calculateTotalTime = (questions) => {
    if (!questions || questions.length === 0) return 0;
    return questions.reduce((sum, q) => sum + (q.timeLimit || 0), 0);
  };

  // Format time in minutes:seconds
  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
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

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return 'easy';
    }
  };

  // Filter quizzes by search term
  const filteredQuizzes = quizzes.filter(quiz => {
    if (!filters.search) return true;
    
    const searchTerm = filters.search.toLowerCase();
    return (
      quiz.title?.toLowerCase().includes(searchTerm) ||
      quiz.subject?.toLowerCase().includes(searchTerm) ||
      quiz.description?.toLowerCase().includes(searchTerm)
    );
  });

  if (loading && quizzes.length === 0) {
    return (
      <div className="admin-quizzes">
        <div className="loading-quizzes">
          <div className="spinner"></div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-quizzes">
      {/* Header */}
      <div className="quizzes-header">
        <div className="header-left">
          <h2>Quizzes Management</h2>
          <p>Create and manage interactive quizzes for students</p>
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
            className="btn-add-quiz" 
            onClick={handleAddQuiz}
            disabled={!isAdmin() && currentAdmin?.role !== 'TEACHER'}
            title={isAdmin() || currentAdmin?.role === 'TEACHER' ? "Create new quiz" : "Admin/Teacher access required"}
          >
            <FaPlus /> Create Quiz
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
      <div className="quizzes-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaQuestionCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.totalQuizzes}</h3>
            <p>Total Quizzes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon questions">
            <FaBrain />
          </div>
          <div className="stat-content">
            <h3>{stats.totalQuestions}</h3>
            <p>Total Questions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.totalCompleted}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">
            <FaGraduationCap />
          </div>
          <div className="stat-content">
            <h3>
              {stats.quizzesByLevel?.find(b => b.level === 'primary')?.count || 0}
            </h3>
            <p>Primary Level</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="quizzes-controls">
        {/* Search Bar */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search quizzes by title, subject, or description..."
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
                value={filters.difficulty} 
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
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
                <option value="difficulty">Difficulty</option>
                <option value="questionCount">Most Questions</option>
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
      {selectedQuizzes.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            <FaCheckCircle />
            <span>{selectedQuizzes.length} quiz(zes) selected</span>
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
              onClick={() => setSelectedQuizzes([])}
            >
              <FaTimesCircle /> Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Quizzes Gallery */}
      <div className="quizzes-gallery-container">
        {filteredQuizzes.length === 0 ? (
          <div className="no-quizzes">
            <FaQuestionCircle className="no-quizzes-icon" />
            <h3>No quizzes found</h3>
            <p>{filters.search ? 'Try a different search term' : 'Create your first quiz to get started'}</p>
            <button className="btn-add-quiz" onClick={handleAddQuiz}>
              <FaPlus /> Create First Quiz
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="quizzes-grid">
            {filteredQuizzes.map(quiz => (
              <div 
                key={quiz.id} 
                className={`quiz-card ${selectedQuizzes.includes(quiz.id) ? 'selected' : ''}`}
              >
                {/* Selection Checkbox */}
                <div className="quiz-select">
                  <input
                    type="checkbox"
                    checked={selectedQuizzes.includes(quiz.id)}
                    onChange={() => handleSelectQuiz(quiz.id)}
                    disabled={!isAdmin()}
                  />
                </div>

                {/* Thumbnail */}
                <div className="quiz-thumbnail" onClick={() => handlePreviewQuiz(quiz)}>
                  <div className="quiz-thumbnail-content">
                    <FaQuestionCircle className="quiz-thumbnail-icon" />
                    <h4>{quiz.title}</h4>
                    <p>{quiz.subject} • {quiz.class}</p>
                  </div>
                  <div className="thumbnail-overlay">
                    <button className="view-btn-overlay" title="Preview Quiz">
                      <FaEye />
                    </button>
                  </div>
                </div>

                {/* Quiz Info */}
                <div className="quiz-info">
                  <h3 className="quiz-title">{quiz.title}</h3>
                  
                  <div className="quiz-meta">
                    <span className="quiz-level">
                      <FaGraduationCap /> {quiz.level === 'primary' ? 'Primary' : 'Secondary'}
                    </span>
                    <span className={`quiz-difficulty ${getDifficultyColor(quiz.difficulty)}`}>
                      <FaBrain /> {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
                    </span>
                    <span className="quiz-class">
                      <FaBook /> {quiz.class}
                    </span>
                    <span className="quiz-questions">
                      <FaQuestionCircle /> {quiz.questions?.length || 0} Qs
                    </span>
                  </div>

                  <div className="quiz-details">
                    <div className="detail-item">
                      <span className="detail-label">Subject:</span>
                      <span className="detail-value">{quiz.subject}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Time:</span>
                      <span className="detail-value">{formatTime(calculateTotalTime(quiz.questions))}</span>
                    </div>
                    {quiz.description && (
                      <div className="detail-item">
                        <span className="detail-label">Description:</span>
                        <span className="detail-value">{quiz.description.substring(0, 60)}...</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="quiz-stats">
                    <div className="stat">
                      <FaClock />
                      <span>Avg: {quiz.questions?.length > 0 ? formatTime(calculateTotalTime(quiz.questions) / quiz.questions.length) : '0s'}</span>
                    </div>
                    <div className="stat">
                      <FaCheckCircle />
                      <span>0% completion</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="quiz-actions">
                  <button 
                    className="btn-action preview"
                    onClick={() => handlePreviewQuiz(quiz)}
                    title="Preview Quiz"
                  >
                    <FaEye />
                  </button>
                  
                  <button 
                    className="btn-action copy"
                    onClick={() => handleCopyQuiz(quiz)}
                    title="Duplicate Quiz"
                  >
                    <FaCopy />
                  </button>
                  
                  <button 
                    className="btn-action edit"
                    onClick={() => handleEditQuiz(quiz)}
                    title="Edit Quiz"
                    disabled={!isAdmin() && quiz.createdBy !== currentAdmin?.id}
                  >
                    <FaEdit />
                  </button>
                  
                  <button 
                    className="btn-action delete"
                    onClick={() => handleDeleteQuiz(quiz)}
                    title="Delete Quiz"
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
          <div className="quizzes-list">
            <table className="quizzes-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedQuizzes.length === filteredQuizzes.length && filteredQuizzes.length > 0}
                      onChange={handleSelectAll}
                      disabled={!isAdmin()}
                    />
                  </th>
                  <th>Quiz Title</th>
                  <th>Level</th>
                  <th>Subject</th>
                  <th>Difficulty</th>
                  <th>Questions</th>
                  <th>Total Time</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.map(quiz => (
                  <tr key={quiz.id} className={selectedQuizzes.includes(quiz.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedQuizzes.includes(quiz.id)}
                        onChange={() => handleSelectQuiz(quiz.id)}
                        disabled={!isAdmin()}
                      />
                    </td>
                    <td>
                      <div className="quiz-title-cell">
                        <div className="quiz-icon">
                          <FaQuestionCircle />
                        </div>
                        <div>
                          <strong>{quiz.title}</strong>
                          <small>{quiz.class} • {quiz.description?.substring(0, 50)}...</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`difficulty-badge ${quiz.level}`}>
                        {quiz.level === 'primary' ? 'Primary' : 'Secondary'}
                      </span>
                    </td>
                    <td>
                      <span className="quiz-subject">{quiz.subject}</span>
                    </td>
                    <td>
                      <span className={`difficulty-badge ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="question-count">
                        <FaQuestionCircle /> {quiz.questions?.length || 0}
                      </span>
                    </td>
                    <td>{formatTime(calculateTotalTime(quiz.questions))}</td>
                    <td>{formatDate(quiz.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-action preview"
                          onClick={() => handlePreviewQuiz(quiz)}
                          title="Preview"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn-action copy"
                          onClick={() => handleCopyQuiz(quiz)}
                          title="Duplicate"
                        >
                          <FaCopy />
                        </button>
                        <button 
                          className="btn-action edit"
                          onClick={() => handleEditQuiz(quiz)}
                          title="Edit"
                          disabled={!isAdmin() && quiz.createdBy !== currentAdmin?.id}
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
      {filteredQuizzes.length > 0 && (
        <div className="quizzes-pagination">
          <div className="pagination-info">
            Showing {filteredQuizzes.length} of {quizzes.length} quizzes
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <QuizzesAddModal
          onClose={() => setShowAddModal(false)}
          onSave={loadData}
          quizToCopy={currentQuiz}
        />
      )}

      {showEditModal && currentQuiz && (
        <QuizzesEditModal
          quiz={currentQuiz}
          onClose={() => setShowEditModal(false)}
          onSave={loadData}
        />
      )}

      {showDeleteModal && (
        <QuizzesDeleteModal
          quiz={currentQuiz}
          selectedCount={currentQuiz ? 1 : selectedQuizzes.length}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={loadData}
        />
      )}

      {showPreviewModal && currentQuiz && (
        <QuizzesPreviewModal
          quiz={currentQuiz}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};

export default AdminQuizzes;
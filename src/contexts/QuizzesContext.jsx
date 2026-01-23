// src/contexts/QuizzesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('Response error:', {
      message: errorMessage,
      status: error.response?.status,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

const QuizzesContext = createContext();

export const useQuizzes = () => {
  const context = useContext(QuizzesContext);
  if (!context) {
    throw new Error('useQuizzes must be used within a QuizzesProvider');
  }
  return context;
};

export const QuizzesProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [quizDetail, setQuizDetail] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);

  // Fetch all quizzes with filters
  const fetchQuizzes = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        ...(filters.level && { level: filters.level }),
        ...(filters.subject && filters.subject !== 'all' && { subject: filters.subject }),
        ...(filters.difficulty && filters.difficulty !== 'all' && { difficulty: filters.difficulty }),
        ...(filters.class && filters.class !== 'all' && { class: filters.class }),
      });

      const response = await api.get(`/quizzes?${params}`);
      
      if (response.data) {
        setQuizzes(response.data);
        return {
          data: response.data,
          total: response.data.length,
        };
      }
      return { data: [], total: 0 };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch quizzes';
      setError(errorMessage);
      console.error('Error fetching quizzes:', {
        message: err.message,
        status: err.response?.status,
      });
      
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  // Fetch single quiz by ID
  const fetchQuizById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/quizzes/${id}`);
      setQuizDetail(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch quiz';
      setError(errorMessage);
      console.error('Error fetching quiz by ID:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Start a quiz
  const startQuiz = (quiz) => {
    setActiveQuiz({
      ...quiz,
      currentQuestionIndex: 0,
      userAnswers: [],
      startTime: Date.now(),
      questionStartTime: Date.now(),
    });
  };

  // Submit answer for current question
  const submitAnswer = (answer, questionIndex, timeSpent) => {
    if (!activeQuiz) return;

    const question = activeQuiz.questions[questionIndex];
    const isCorrect = answer === question.answer;
    
    setActiveQuiz(prev => ({
      ...prev,
      userAnswers: [...prev.userAnswers, {
        questionIndex,
        answer,
        isCorrect,
        timeSpent
      }],
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      questionStartTime: Date.now()
    }));
  };

  // Complete quiz and calculate results
  const completeQuiz = () => {
    if (!activeQuiz) return;

    const totalQuestions = activeQuiz.questions.length;
    const correctAnswers = activeQuiz.userAnswers.filter(ans => ans.isCorrect).length;
    const totalTime = Date.now() - activeQuiz.startTime;
    const averageTimePerQuestion = totalTime / totalQuestions;

    const results = {
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      totalQuestions,
      correctAnswers,
      score: Math.round((correctAnswers / totalQuestions) * 100),
      totalTime,
      averageTimePerQuestion,
      userAnswers: [...activeQuiz.userAnswers]
    };

    setQuizResults(results);
    setActiveQuiz(null);
    return results;
  };

  // Fetch levels
  const fetchLevels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/quizzes/levels');
      setLevels(response.data.levels || []);
      return response.data.levels || [];
    } catch (err) {
      console.error('Error fetching levels:', err);
      // Return default levels if endpoint doesn't exist
      const defaultLevels = ['primary', 'secondary'];
      setLevels(defaultLevels);
      return defaultLevels;
    } finally {
      setLoading(false);
    }
  };



const fetchSubjects = async (level = null) => {
  setLoading(true);
  setError(null);
  
  try {
    const params = new URLSearchParams();
    // Only send level if it's 'primary' or 'secondary'
    if (level && level !== 'all' && (level === 'primary' || level === 'secondary')) {
      params.append('level', level);
    }

    const response = await api.get(`/quizzes/subjects?${params}`);
    setSubjects(response.data.subjects || []);
    return response.data.subjects || [];
  } catch (err) {
    console.error('Error fetching subjects:', err);
    // Return default subjects
    const defaultSubjects = level === 'primary' 
      ? ['Mathematics', 'English', 'Science', 'Social Studies']
      : ['Mathematics', 'Biology', 'Physics', 'Chemistry', 'Geography', 'English'];
    setSubjects(defaultSubjects);
    return defaultSubjects;
  } finally {
    setLoading(false);
  }
};

const fetchClasses = async (level = null) => {
  setLoading(true);
  setError(null);
  
  try {
    const params = new URLSearchParams();
    if (level && level !== 'all' && (level === 'primary' || level === 'secondary')) {
      params.append('level', level);
    }

    const response = await api.get(`/quizzes/classes?${params}`);
    setClasses(response.data.classes || []);
    return response.data.classes || [];
  } catch (err) {
    console.error('Error fetching classes:', err);
    // Return default classes based on level
    const defaultClasses = level === 'primary' 
      ? ['Standard 1', 'Standard 2', 'Standard 3', 'Standard 4', 'Standard 5', 'Standard 6', 'Standard 7', 'Standard 8']
      : ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
    setClasses(defaultClasses);
    return defaultClasses;
  } finally {
    setLoading(false);
  }
};

const createQuiz = async (quizData, token) => {
  setLoading(true);
  setError(null);
  
  try {
    // Calculate totalTime from all questions' timeLimit
    const totalTime = quizData.questions?.reduce((sum, q) => {
      // Convert timeLimit to number and ensure it's at least 1
      const time = parseInt(q.timeLimit) || 30;
      return sum + Math.max(1, time); // Ensure each question has at least 1 second
    }, 0) || 60; // Default to 60 seconds if no questions
    
    // Ensure totalTime is at least 1
    const finalTotalTime = Math.max(1, totalTime);
    
    // Prepare the payload matching your DTO structure
    const payload = {
      title: quizData.title,
      description: quizData.description || '',
      level: quizData.level,
      subject: quizData.subject,
      difficulty: quizData.difficulty,
      class: quizData.class,
      questions: quizData.questions.map(q => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        timeLimit: Math.max(1, parseInt(q.timeLimit) || 30) // Ensure each question has at least 1 second
      })),
      totalTime: finalTotalTime // Send as number
    };
    
    console.log('Sending quiz payload:', payload);
    
    const response = await api.post('/quizzes', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    // Add to local state
    setQuizzes(prevQuizzes => [response.data, ...prevQuizzes]);
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to create quiz';
    setError(errorMessage);
    console.error('Error creating quiz:', err.response?.data || err);
    throw err;
  } finally {
    setLoading(false);
  }
};

// Also update the updateQuiz function:
const updateQuiz = async (id, quizData, token) => {
  setLoading(true);
  setError(null);
  
  try {
    // Calculate totalTime from all questions' timeLimit
    const totalTime = quizData.questions?.reduce((sum, q) => {
      const time = parseInt(q.timeLimit) || 30;
      return sum + Math.max(1, time);
    }, 0) || 60;
    
    const finalTotalTime = Math.max(1, totalTime);
    
    const payload = {
      title: quizData.title,
      description: quizData.description || '',
      level: quizData.level,
      subject: quizData.subject,
      difficulty: quizData.difficulty,
      class: quizData.class,
      questions: quizData.questions.map(q => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        timeLimit: Math.max(1, parseInt(q.timeLimit) || 30)
      })),
      totalTime: finalTotalTime
    };
    
    console.log('Updating quiz payload:', payload);
    
    const response = await api.patch(`/quizzes/${id}`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    // Update in local state
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz =>
        quiz.id === parseInt(id) ? response.data : quiz
      )
    );
    
    if (quizDetail?.id === parseInt(id)) {
      setQuizDetail(response.data);
    }
    
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to update quiz';
    setError(errorMessage);
    console.error('Error updating quiz:', err.response?.data || err);
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Delete quiz (admin/teacher only)
  const deleteQuiz = async (id, token) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/quizzes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Remove from local state
      setQuizzes(prevQuizzes =>
        prevQuizzes.filter(quiz => quiz.id !== parseInt(id))
      );
      
      if (quizDetail?.id === parseInt(id)) {
        setQuizDetail(null);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete quiz';
      setError(errorMessage);
      console.error('Error deleting quiz:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset quiz state
  const resetQuiz = () => {
    setActiveQuiz(null);
    setQuizResults(null);
  };

  // Test API connection
  const testConnection = async () => {
    try {
      console.log('Testing connection to quizzes API...');
      const response = await axios.get(`${API_BASE_URL}/quizzes?limit=1`, { timeout: 5000 });
      console.log('Connection successful:', response.status);
      return true;
    } catch (err) {
      console.error('Connection failed:', err.message);
      return false;
    }
  };

  // Initialize with data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      
      try {
        await Promise.all([
          fetchQuizzes(),
          fetchLevels(),
        ]);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const value = {
    quizzes,
    quizDetail,
    activeQuiz,
    quizResults,
    levels,
    subjects,
    classes,
    loading,
    error,
    fetchQuizzes,
    fetchQuizById,
    fetchLevels,
    fetchSubjects,
    fetchClasses,
    startQuiz,
    submitAnswer,
    completeQuiz,
    resetQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    testConnection,
    clearError: () => setError(null),
    clearQuizDetail: () => setQuizDetail(null),
  };

  return (
    <QuizzesContext.Provider value={value}>
      {children}
    </QuizzesContext.Provider>
  );
};

export default QuizzesContext;
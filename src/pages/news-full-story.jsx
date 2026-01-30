import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/news-full-story.css";
import Footer from "../components/Footer.jsx";
import { useNews } from "../contexts/NewsContext";
import Header from '../components/Header';

const NewsFullStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchNewsById, news, fetchNews, loading: newsLoading, error: newsError } = useNews();
  
  const [imageError, setImageError] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

 // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // Load article data
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;

      try {
        // Try to find article in cached news first
        const cachedArticle = news.find(item => item.id === id);
        
        if (cachedArticle) {
          setArticle(cachedArticle);
          findRelatedArticles(cachedArticle);
        } else {
          // Fetch article by ID from API
          const articleData = await fetchNewsById(id);
          setArticle(articleData);
          findRelatedArticles(articleData);
        }
      } catch (err) {
        console.error("Error loading article:", err);
      }
    };

    loadArticle();
  }, [id, news, fetchNewsById]);

  // Find related articles based on category
  const findRelatedArticles = (currentArticle) => {
    if (!currentArticle || !currentArticle.category) return;
    
    const related = news
      .filter(item => 
        item.id !== currentArticle.id && 
        item.category === currentArticle.category
      )
      .slice(0, 3);
    
    setRelatedArticles(related);
  };

  // Load comments from localStorage on component mount
  useEffect(() => {
    if (!id) return;
    const savedComments = localStorage.getItem(`news_comments_${id}`);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (err) {
        console.error("Error loading comments:", err);
      }
    }
  }, [id]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (!id) return;
    localStorage.setItem(`news_comments_${id}`, JSON.stringify(comments));
  }, [comments, id]);

  // If article not found, redirect or show error
  if (newsError && !article) {
    return (
      <div className="article-not-found">
        <h1>Error Loading Article</h1>
        <p>{newsError}</p>
        <button onClick={() => navigate("/news")}>Back to News</button>
      </div>
    );
  }

  if (newsLoading && !article) {
    return (
      <div className="article-not-found">
        <div className="loading-spinner-large"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-not-found">
        <h1>Article Not Found</h1>
        <p>The news article you're looking for doesn't exist.</p>
        <button onClick={() => navigate("/news")}>Back to News</button>
      </div>
    );
  }

  const handleImageError = () => {
    setImageError(true);
  };

  const getFallbackImage = () => {
    const gradients = [
      'linear-gradient(135deg, #3b8efc, #2df87c)',
      'linear-gradient(135deg, #ff6b6b, #ff4757)',
      'linear-gradient(135deg, #10b981, #059669)',
      'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      'linear-gradient(135deg, #f59e0b, #d97706)',
      'linear-gradient(135deg, #ec4899, #be185d)'
    ];
    // Use article ID or random index for gradient
    const articleId = article.id || '';
    const hash = articleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  // Split content into paragraphs
  const paragraphs = article.content ? article.content.split('\n') : [];

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAuthorName = () => {
    if (!article.author) return "Unknown Author";
    if (typeof article.author === 'object') {
      const name = `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim();
      return name || article.author.email || "Unknown Author";
    }
    return article.author;
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.name.trim() || !newComment.comment.trim()) {
      alert("Please enter both name and comment");
      return;
    }

    setLoading(true);
    
    
    setTimeout(() => {
      const commentToAdd = {
        id: Date.now(),
        name: newComment.name.trim(),
        comment: newComment.comment.trim(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: formatTime(new Date()),
        likes: 0
      };

      setComments([commentToAdd, ...comments]);
      setNewComment({ name: "", comment: "" });
      setLoading(false);
    }, 500);
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    }));
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => alert("Link copied to clipboard!"))
      .catch(err => console.error("Failed to copy link:", err));
  };

  return (
    <>
       <Header />
      <div className="full-story-wrapper">
        {/* Back Navigation */}
        <div className="back-navigation">
          <button className="back-btn" onClick={() => navigate("/news")}>
            ← Back to News
          </button>
          <div className="breadcrumb">
            <span onClick={() => navigate("/")}>Home</span>
            <span> / </span>
            <span onClick={() => navigate("/news")}>News</span>
            <span> / </span>
            <span className="current">{article.title?.substring(0, 30)}...</span>
          </div>
        </div>

        {/* Article Header */}
        <div className="article-header">
          {article.category && (
            <div className="article-category-badge">{article.category}</div>
          )}
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <div className="meta-item">
              <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            </div>
            <div className="meta-item">
              <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{article.readTime || '5'} min read</span>
            </div>
            <div className="meta-item">
              <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>By {getAuthorName()}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="featured-image-container">
          {imageError || !article.imageUrl ? (
            <div 
              className="image-placeholder-large"
              style={{ background: getFallbackImage() }}
            >
              <span className="placeholder-text-large">{article.category || "News"}</span>
            </div>
          ) : (
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="featured-image"
              onError={handleImageError}
            />
          )}
          <div className="image-caption">Photo: {article.title}</div>
        </div>

        {/* Article Content */}
        <div className="article-content-container">
          {/* Introduction */}
          <div className="article-intro">
            <p className="lead-text">{article.description}</p>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <p key={index} className="content-paragraph">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="content-paragraph">{article.content}</p>
            )}
          </div>

          {/* Share Options */}
          <div className="share-section">
            <h3>Share this article</h3>
            <div className="share-buttons">
              <button 
                className="share-btn facebook"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
                Facebook
              </button>
              <button 
                className="share-btn twitter"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
                Twitter
              </button>
              <button 
                className="share-btn whatsapp"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`, '_blank')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.663 4.1 1.793 5.717L.667 23.333l5.715-1.128A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
                WhatsApp
              </button>
              <button 
                className="share-btn copy-link"
                onClick={handleCopyLink}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h2 className="section-title">Comments ({comments.length})</h2>
          
          {/* Add Comment Form */}
          <div className="add-comment-form">
            <h3>Add a Comment</h3>
            <form onSubmit={handleCommentSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newComment.name}
                  onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                  required
                  className="comment-input"
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Write your comment here..."
                  value={newComment.comment}
                  onChange={(e) => setNewComment({...newComment, comment: e.target.value})}
                  required
                  rows="4"
                  className="comment-textarea"
                />
              </div>
              <button type="submit" className="submit-comment-btn" disabled={loading}>
                {loading ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <div className="comment-author">
                      <div className="author-avatar">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="author-info">
                        <h4>{comment.name}</h4>
                        <span className="comment-time">
                          {comment.date} at {comment.time}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="delete-comment-btn"
                      onClick={() => handleDeleteComment(comment.id)}
                      title="Delete comment"
                    >
                      ×
                    </button>
                  </div>
                  <div className="comment-body">
                    <p>{comment.comment}</p>
                  </div>
                  <div className="comment-footer">
                    <button 
                      className="like-btn"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      Like ({comment.likes})
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="related-articles">
            <h2 className="section-title">Related Articles</h2>
            <div className="related-grid">
              {relatedArticles.map(related => (
                <div 
                  key={related.id} 
                  className="related-card"
                  onClick={() => navigate(`/news/${related.id}`)}
                >
                  <div className="related-image">
                    <img 
                      src={related.imageUrl || "/default-news-image.jpg"} 
                      alt={related.title}
                      onError={(e) => {
                        e.target.src = "/default-news-image.jpg";
                      }}
                    />
                  </div>
                  <div className="related-content">
                    <div className="related-category">{related.category}</div>
                    <h3 className="related-title">{related.title}</h3>
                    <p className="related-description">
                      {related.description?.substring(0, 80) || ''}...
                    </p>
                    <div className="related-meta">
                      <span>{formatDate(related.publishedAt || related.createdAt)}</span>
                      <span>•</span>
                      <span>{related.readTime || '5'} min read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default NewsFullStory;
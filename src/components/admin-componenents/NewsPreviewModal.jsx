// src/components/admin-componenents/NewsPreviewModal.jsx
import React, { useState } from 'react';
import {
  FaTimes,
  FaNewspaper,
  FaCalendar,
  FaUser,
  FaClock,
  FaEye,
  FaShareAlt,
  FaPrint,
  FaCopy,
  FaBookmark,
  FaArrowLeft,
  FaImage,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp
} from 'react-icons/fa';
import '../../styles/Admin-Styles/NewsAdminModal.css';

const NewsPreviewModal = ({ article, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link to clipboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(article.title);
  const shareText = encodeURIComponent(article.description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}&summary=${shareText}`,
    whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content news-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaNewspaper /> Article Preview
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="preview-news-container">
          <div className="full-news-content">
            {/* Header */}
            <div className="full-news-header">
              <h1 className="full-news-title">{article.title}</h1>
              
              <div className="full-news-meta">
                <div className="full-meta-item">
                  <FaCalendar />
                  <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                </div>
                <div className="full-meta-item">
                  <FaUser />
                  <span>{article.author?.firstName} {article.author?.lastName}</span>
                </div>
                <div className="full-meta-item">
                  <FaClock />
                  <span>{article.readTime || 5} min read</span>
                </div>
                <div className="full-meta-item">
                  <FaGlobe />
                  <span>{article.category}</span>
                </div>
                <div className="full-meta-item">
                  <FaEye />
                  <span>{article.views || 0} views</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`status-badge ${article.isPublished ? 'published' : 'draft'}`}>
                {article.isPublished ? 'PUBLISHED' : 'DRAFT'}
              </div>
            </div>

            {/* Featured Image */}
            {article.imageUrl && (
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="full-news-image"
              />
            )}

            {/* Content */}
            <div className="full-news-content">
              <div className="news-description">
                <p style={{ 
                  fontSize: '1.2rem', 
                  color: '#666', 
                  fontStyle: 'italic',
                  marginBottom: '30px'
                }}>
                  {article.description}
                </p>
              </div>
              
              {/* Render content with basic formatting */}
              {article.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index}>{paragraph.substring(2)}</h1>;
                } else if (paragraph.startsWith('## ')) {
                  return <h2 key={index}>{paragraph.substring(3)}</h2>;
                } else if (paragraph.startsWith('### ')) {
                  return <h3 key={index}>{paragraph.substring(4)}</h3>;
                } else if (paragraph.startsWith('> ')) {
                  return (
                    <blockquote key={index} style={{
                      borderLeft: '4px solid #4a90e2',
                      paddingLeft: '20px',
                      margin: '20px 0',
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      {paragraph.substring(2)}
                    </blockquote>
                  );
                } else if (paragraph.startsWith('- ')) {
                  return <li key={index}>{paragraph.substring(2)}</li>;
                } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <strong key={index}>{paragraph.substring(2, paragraph.length - 2)}</strong>;
                } else if (paragraph.startsWith('*') && paragraph.endsWith('*') && !paragraph.startsWith('**')) {
                  return <em key={index}>{paragraph.substring(1, paragraph.length - 1)}</em>;
                } else if (paragraph.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index}>{paragraph}</p>;
                }
              })}
            </div>

            {/* Footer */}
            <div className="full-news-footer">
              <div className="article-actions" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={handleCopyLink}
                  className="btn-action"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#f8fafc',
                    color: '#666',
                    border: '1px solid #e1e5eb',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <FaCopy /> {copied ? 'Copied!' : 'Copy Link'}
                </button>
                
                <button 
                  onClick={handlePrint}
                  className="btn-action"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#f8fafc',
                    color: '#666',
                    border: '1px solid #e1e5eb',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <FaPrint /> Print
                </button>
                
                <button 
                  className="btn-action"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#f8fafc',
                    color: '#666',
                    border: '1px solid #e1e5eb',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <FaBookmark /> Bookmark
                </button>
              </div>

              <div className="share-section" style={{
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '1px solid #e1e5eb'
              }}>
                <h4 style={{ marginBottom: '15px', textAlign: 'center' }}>Share This Article</h4>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  <a 
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: '#1877f2',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <FaFacebook /> Facebook
                  </a>
                  
                  <a 
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: '#1da1f2',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <FaTwitter /> Twitter
                  </a>
                  
                  <a 
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: '#0077b5',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <FaLinkedin /> LinkedIn
                  </a>
                  
                  <a 
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: '#25d366',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                </div>
              </div>

              <p style={{ marginTop: '30px', color: '#999', fontSize: '0.9rem' }}>
                Last updated: {formatDate(article.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            <FaArrowLeft /> Back to List
          </button>
          <div className="preview-actions">
            <button className="btn-primary" onClick={onClose}>
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPreviewModal;
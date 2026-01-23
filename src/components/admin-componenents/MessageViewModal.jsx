// src/src/components/admin-components/MessageViewModal.jsx
import React from 'react';
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaCheck,
  FaEnvelopeOpen,
  FaReply,
  FaPrint,
  FaCopy
} from 'react-icons/fa';
import '../../styles/Admin-Styles/MessageAdminModal.css';

const MessageViewModal = ({ message, onClose, onMarkAsRead, onMarkAsNew }) => {
  if (!message) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  // Print message
  const printMessage = () => {
    const printContent = `
      <html>
        <head>
          <title>Message Details - ${message.subject}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .print-header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .print-section { margin-bottom: 15px; }
            .print-label { font-weight: bold; color: #666; }
            .message-content { white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>${message.subject}</h2>
            <p>Received: ${formatDate(message.createdAt)}</p>
          </div>
          
          <div class="print-section">
            <p><span class="print-label">From:</span> ${message.name}</p>
            <p><span class="print-label">Email:</span> ${message.email}</p>
            ${message.phone ? `<p><span class="print-label">Phone:</span> ${message.phone}</p>` : ''}
          </div>
          
          <div class="print-section">
            <p><span class="print-label">Status:</span> ${message.status}</p>
            <p><span class="print-label">Message:</span></p>
            <div class="message-content">${message.message}</div>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content message-view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaEnvelopeOpen /> Message Details
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="message-view-content">
          {/* Message Header */}
          <div className="message-header-details">
            <div className="message-title-section">
              <h4 className="message-subject">{message.subject}</h4>
              <div className="message-status-badge">
                <span className={`status-indicator ${message.status}`}>
                  {message.status === 'new' ? 'NEW' : 'READ'}
                </span>
                <span className="time-ago">{formatTimeAgo(message.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Sender Information */}
          <div className="sender-information">
            <h5>Sender Information</h5>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <FaUser />
                </div>
                <div className="info-content">
                  <label>Name</label>
                  <p>{message.name}</p>
                </div>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(message.name)}
                  title="Copy name"
                >
                  <FaCopy />
                </button>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div className="info-content">
                  <label>Email</label>
                  <p>{message.email}</p>
                </div>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(message.email)}
                  title="Copy email"
                >
                  <FaCopy />
                </button>
              </div>

              {message.phone && (
                <div className="info-item">
                  <div className="info-icon">
                    <FaPhone />
                  </div>
                  <div className="info-content">
                    <label>Phone</label>
                    <p>{message.phone}</p>
                  </div>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(message.phone)}
                    title="Copy phone"
                  >
                    <FaCopy />
                  </button>
                </div>
              )}

              <div className="info-item">
                <div className="info-icon">
                  <FaCalendar />
                </div>
                <div className="info-content">
                  <label>Received</label>
                  <p>{formatDate(message.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="message-content-section">
            <h5>Message Content</h5>
            <div className="message-text">
              {message.message.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph || <br />}</p>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="message-actions">
            <div className="status-actions">
              {message.status === 'new' ? (
                <button 
                  className="btn-mark-read"
                  onClick={() => {
                    onMarkAsRead();
                    onClose();
                  }}
                >
                  <FaCheck /> Mark as Read
                </button>
              ) : (
                <button 
                  className="btn-mark-new"
                  onClick={() => {
                    onMarkAsNew();
                    onClose();
                  }}
                >
                  <FaEnvelope /> Mark as New
                </button>
              )}
            </div>

            <div className="utility-actions">
              <button 
                className="btn-reply"
                onClick={() => {
                  window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
                }}
              >
                <FaReply /> Reply
              </button>
              <button 
                className="btn-print"
                onClick={printMessage}
              >
                <FaPrint /> Print
              </button>
              <button 
                className="btn-copy"
                onClick={() => copyToClipboard(`${message.name} <${message.email}>\n\n${message.message}`)}
              >
                <FaCopy /> Copy All
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageViewModal;
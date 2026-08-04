import React from 'react';
import '../styles/page-header.css';

const PageHeader = ({ title, description }) => {
  return (
    <header className="page-header" style={{ background: '#ff0000' }}>
      <div className="page-header-inner">
        <h1 className="page-title" style={{ fontSize: '4rem !important', color: '#ff0000' }}>
          {title}
        </h1>
        {description && (
          <p className="page-subtitle" style={{ fontSize: '2rem !important' }}>
            {description}
          </p>
        )}
        <div className="page-header-divider" />
      </div>
    </header>
  );
};

export default PageHeader;
import React from 'react';
import '../styles/global.css';

const PageHeader = ({ title, description }) => {
  return (
    <header className="page-header">
      <div className="page-header-inner">
        <h1 className="page-title">{title}</h1>
        <div className="page-title-accent"></div>
        {description && (
          <p className="page-subtitle">{description}</p>
        )}
      </div>
    </header>
  );
};

export default PageHeader;

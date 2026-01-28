import React from 'react';
import '../styles/page-header.css';

const PageHeader = ({ title, description }) => {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      {description && <p className="page-subtitle">{description}</p>}
    </div>
  );
};

export default PageHeader;
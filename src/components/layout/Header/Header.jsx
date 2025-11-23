import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">📊 Excel Dataset Viewer</h1>
        <div className="header-actions">
          <span className="user-info">Usuario</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
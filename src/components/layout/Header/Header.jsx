import React from 'react';
import './Header.css';

const Header = () => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-info">
          <h1 className="header-title">Optimización de gestión de efectivo - BCP</h1>
        </div>
        
        <div className="header-right">
          <div className="date-display">
            <span className="date-icon">📅</span>
            <span className="date-text">{currentDate}</span>
          </div>
          
          <div className="user-profile">
            <div className="user-avatar">
              <span>UE</span>
            </div>
            <div className="user-details">
              <span className="user-name">Empresas Ejecutiva</span>
              <span className="user-status">
                <span className="status-dot"></span>
                Conectado
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
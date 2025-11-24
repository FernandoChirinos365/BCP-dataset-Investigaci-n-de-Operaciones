import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: '📊', label: 'Resumen Ejecutivo', path: '/' },
    { icon: '📈', label: 'Predicción de Demanda', path: '/prediction' },
    { icon: '⚙️', label: 'Optimización', path: '/optimizer' },
    { icon: '🔄', label: 'Simulación de Escenarios', path: '/simulation' },
    { icon: '🎯', label: 'Análisis de Sensibilidad', path: '/sensitivity' },
    { icon: '📋', label: 'Reportes', path: '/reports' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="bcp-logo">BCP</div>
          <h1 className="sidebar-title">Gestión de Efectivo</h1>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            <div className="active-indicator"></div>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">UE</div>
          <div className="user-details">
            <span className="user-name">Empresas Ejecutiva</span>
            <span className="user-role">Universidad Nacional de Ingeniería</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
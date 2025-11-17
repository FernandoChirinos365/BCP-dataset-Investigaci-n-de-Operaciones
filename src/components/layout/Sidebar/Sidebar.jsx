import React from 'react';
import './Sidebar.css';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📈' },
    { id: 'dataview', label: 'Ver Datos', icon: '📋' },
    { id: 'upload', label: 'Subir Excel', icon: '📤' },
  ];

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId)
    window.location.hash = pageId
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => handleNavigation(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
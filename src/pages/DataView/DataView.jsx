import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/data/DataTable/DataTable';
import Filters from '../../components/data/Filters/Filters';
import Button from '../../components/ui/Button/Button';
import './DataView.css';

const DataView = () => {
  const { excelData, headers } = useData();
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Aplicar filtros a los datos
  const filteredData = useMemo(() => {
    if (!excelData) return [];
    
    const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '');
    
    if (activeFilters.length === 0) return excelData;

    return excelData.filter(row =>
      activeFilters.every(([column, filterValue]) => {
        const cellValue = String(row[column] || '').toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      })
    );
  }, [excelData, filters]);

  const handleFilterChange = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (!excelData || excelData.length === 0) {
    return (
      <div className="dataview-empty">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No hay datos para mostrar</h2>
          <p>Sube un archivo Excel en la pestaña de Upload para ver los datos aquí</p>
          <Button 
            onClick={() => window.location.hash = '#upload'}
            variant="primary"
            size="large"
          >
            Ir a Subir Archivo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dataview">
      <div className="dataview-header">
        <div className="header-info">
          <h1>Vista de Datos</h1>
          <p>Explora y filtra tu dataset completo</p>
        </div>
        
        <div className="header-actions">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "primary" : "secondary"}
          >
            {showFilters ? '🙈 Ocultar Filtros' : '🔍 Mostrar Filtros'}
          </Button>
          
          <Button 
            onClick={handleClearFilters}
            variant="secondary"
            disabled={Object.values(filters).every(value => value === '')}
          >
            🗑️ Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="dataview-stats">
        <div className="stat-item">
          <span className="stat-label">Total Registros:</span>
          <span className="stat-value">{excelData.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Filtrados:</span>
          <span className="stat-value">{filteredData.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Columnas:</span>
          <span className="stat-value">{headers.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Filtros Activos:</span>
          <span className="stat-value">
            {Object.values(filters).filter(value => value !== '').length}
          </span>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Filters
          headers={headers}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Tabla de Datos */}
      <DataTable 
        data={filteredData}
        headers={headers}
      />

      {/* Resumen de Filtros */}
      {Object.values(filters).some(value => value !== '') && (
        <div className="active-filters">
          <h4>Filtros Activos:</h4>
          <div className="filters-list">
            {Object.entries(filters)
              .filter(([_, value]) => value !== '')
              .map(([column, value]) => (
                <span key={column} className="filter-tag">
                  {column}: <strong>"{value}"</strong>
                </span>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default DataView;
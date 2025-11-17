import React from 'react';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button/Button';
import { useExcelData } from '../../hooks/useExcelData';
import './Dashboard.css';

const Dashboard = () => {
  const { excelData, headers, currentFile } = useData();
  const hasData = excelData && excelData.length > 0;

  // Calcular métricas básicas
  const metrics = hasData ? {
    totalRecords: excelData.length,
    totalColumns: headers.length,
    sampleData: excelData.slice(0, 5),
    columnNames: headers
  } : null;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Vista general de tu dataset</p>
      </div>

      {!hasData ? (
        <div className="dashboard-empty">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h2>No hay datos cargados</h2>
            <p>Comienza subiendo un archivo Excel para visualizar tus datos</p>
            <Button 
              onClick={() => window.location.hash = '#upload'}
              variant="primary"
              size="large"
            >
              Subir Primer Archivo
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Métricas */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">📁</div>
              <div className="metric-content">
                <h3>Archivo Actual</h3>
                <p className="metric-value">{currentFile}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <h3>Total de Registros</h3>
                <p className="metric-value">{metrics.totalRecords}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📋</div>
              <div className="metric-content">
                <h3>Columnas</h3>
                <p className="metric-value">{metrics.totalColumns}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🔍</div>
              <div className="metric-content">
                <h3>Vista Previa</h3>
                <p className="metric-value">5 registros</p>
              </div>
            </div>
          </div>

          {/* Columnas del Dataset */}
          <div className="dashboard-section">
            <h2>Columnas del Dataset</h2>
            <div className="columns-grid">
              {metrics.columnNames.map((column, index) => (
                <div key={index} className="column-card">
                  <span className="column-index">#{index + 1}</span>
                  <span className="column-name">{column}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vista Previa */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Vista Previa de Datos</h2>
              <Button 
                onClick={() => window.location.hash = '#dataview'}
                variant="primary"
              >
                Ver Todos los Datos
              </Button>
            </div>
            
            <div className="preview-table">
              <table className="preview-table">
                <thead>
                  <tr>
                    {metrics.columnNames.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.sampleData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {metrics.columnNames.map((header, cellIndex) => (
                        <td key={cellIndex}>
                          {row[header] ?? '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="preview-footer">
              <p>Mostrando 5 de {metrics.totalRecords} registros</p>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="dashboard-section">
            <h2>Acciones Rápidas</h2>
            <div className="actions-grid">
              <Button 
                onClick={() => window.location.hash = '#dataview'}
                variant="primary"
                size="large"
              >
                📋 Ver Todos los Datos
              </Button>
              
              <Button 
                onClick={() => window.location.hash = '#upload'}
                variant="secondary"
                size="large"
              >
                📤 Subir Nuevo Archivo
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

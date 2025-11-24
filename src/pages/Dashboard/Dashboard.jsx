import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import './Dashboard.css';

const Dashboard = () => {
  const { excelData, headers, currentFile, setExcelData, setHeaders, setCurrentFile } = useData();
  const navigate = useNavigate();
  const hasData = excelData && excelData.length > 0;
  
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Función para subir archivo DIRECTAMENTE
  const handleFileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls,.csv';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const { readExcelFile } = await import('../../services/excelParser');
          const result = await readExcelFile(file);
          
          setExcelData(result.data);
          setHeaders(result.headers);
          setCurrentFile(file.name);
          setCurrentPage(1); // Resetear a primera página
          
          console.log('✅ Archivo cargado:', result.data);
          alert(`✅ ${file.name} cargado\n${result.data.length} registros procesados`);
          
        } catch (error) {
          console.error('Error:', error);
          alert(`❌ Error: ${error.message}`);
        }
      }
    };
    
    fileInput.click();
  };

  // Calcular métricas básicas
  const metrics = hasData ? {
    totalRecords: excelData.length,
    totalColumns: headers.length,
    columnNames: headers
  } : null;

  // Calcular datos para la paginación
  const totalPages = hasData ? Math.ceil(excelData.length / recordsPerPage) : 0;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = hasData ? excelData.slice(startIndex, endIndex) : [];

  // Funciones de paginación
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        {hasData && (
          <div className="header-actions">
            <Button 
              onClick={handleFileUpload}
              variant="outline"
              size="medium"
            >
              📤 Cambiar Archivo
            </Button>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="dashboard-empty">
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <h2>Proyecto de Gestión de Efectivo del Banco</h2>
            <p>Comience subiendo su archivo Excel para analizar y optimizar la gestión de efectivo</p>
            
            <div className="feature-list">
              <div className="feature-list-item">
                <span className="feature-bullet">•</span>
                <span className="feature-text">Análisis Exploratorio</span>
              </div>
              <div className="feature-list-item">
                <span className="feature-bullet">•</span>
                <span className="feature-text">Predicción de Demanda</span>
              </div>
              <div className="feature-list-item">
                <span className="feature-bullet">•</span>
                <span className="feature-text">Optimización Avanzada</span>
              </div>
            </div>

            <Button 
              onClick={handleFileUpload}
              variant="primary"
              size="large"
              className="upload-btn"
            >
              Comenzar Ahora
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Métricas Principales */}
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-icon">📁</div>
              <div className="metric-content">
                <h3>Archivo Actual</h3>
                <p className="metric-value">{currentFile}</p>
                <span className="metric-label">Dataset cargado</span>
              </div>
            </div>

            <div className="metric-card success">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <h3>Total de Registros</h3>
                <p className="metric-value">{metrics.totalRecords.toLocaleString()}</p>
                <span className="metric-label">Transacciones</span>
              </div>
            </div>

            <div className="metric-card warning">
              <div className="metric-icon">📋</div>
              <div className="metric-content">
                <h3>Variables</h3>
                <p className="metric-value">{metrics.totalColumns}</p>
                <span className="metric-label">Columnas analizadas</span>
              </div>
            </div>

            <div className="metric-card info">
              <div className="metric-icon">🔍</div>
              <div className="metric-content">
                <h3>Página Actual</h3>
                <p className="metric-value">{currentPage}</p>
                <span className="metric-label">de {totalPages} páginas</span>
              </div>
            </div>
          </div>

          {/* Vista Previa CON PAGINACIÓN */}
          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title">
                <h2>Vista de Datos de Entrada</h2>
                <p>Navega por los registros del dataset</p>
              </div>
              <div className="pagination-info">
                <span>Página {currentPage} de {totalPages}</span>
              </div>
            </div>
            
            <div className="preview-container">
              <div className="preview-table">
                <table>
                  <thead>
                    <tr>
                      {metrics.columnNames.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((row, rowIndex) => (
                      <tr key={startIndex + rowIndex}>
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
            </div>
            
            {/* CONTROLES DE PAGINACIÓN CENTRADOS */}
            <div className="pagination-controls-centered">
              <button 
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="pagination-btn prev-next"
              >
                ← Anterior
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="pagination-btn prev-next"
              >
                Siguiente →
              </button>
            </div>
            
            <div className="preview-footer">
              <div className="footer-info">
                <span className="records-count">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, metrics.totalRecords)} de {metrics.totalRecords.toLocaleString()} registros
                </span>
                <span className="data-size">
                  • Dataset actual: {Math.round(metrics.totalRecords * metrics.totalColumns * 0.1).toLocaleString()} KB
                </span>
              </div>
            </div>
          </div>

          {/* Resto de tu código se mantiene igual */}
          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title">
                <h2>Análisis Exploratorio</h2>
                <p>Herramientas avanzadas para la gestión de efectivo</p>
              </div>
            </div>
            
            <div className="horizontal-cards">
              <div className="analysis-card">
                <h3>📊 Predicción de Demanda</h3>
                <ul>
                  <li>Análisis de series temporales</li>
                  <li>Modelos predictivos avanzados</li>
                  <li>Forecasting de flujo de caja</li>
                  <li>Indicadores de precisión</li>
                </ul>
                <button 
                  className="card-btn" 
                  onClick={() => navigate('/prediction')}
                >
                  Explorar →
                </button>
              </div>
              
              <div className="analysis-card">
                <h3>⚙️ Optimización Avanzada</h3>
                <ul>
                  <li>Algoritmos de optimización</li>
                  <li>Minimización de costos</li>
                  <li>Maximización de rendimiento</li>
                  <li>Análisis de restricciones</li>
                </ul>
                <button 
                  className="card-btn" 
                  onClick={() => navigate('/optimizer')}
                >
                  Optimizar →
                </button>
              </div>
              
              <div className="analysis-card">
                <h3>🔮 Simulación de Escenarios</h3>
                <ul>
                  <li>Análisis de múltiples escenarios</li>
                  <li>Pruebas de estrés financiero</li>
                  <li>Modelos probabilísticos</li>
                  <li>Evaluación de riesgos</li>
                </ul>
                <button 
                  className="card-btn" 
                  onClick={() => navigate('/simulation')}
                >
                  Simular →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
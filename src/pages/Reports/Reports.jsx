import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import ReportGenerator from '../../components/Reports/ReportGenerator';
import './Reports.css';

const Reports = () => {
  const { excelData, predictions, optimizationResult, simulationScenarios, sensitivityAnalysis } = useData();
  const [selectedReportType, setSelectedReportType] = useState('executive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState([
    {
      id: 1,
      type: 'sensitivity',
      name: 'Análisis de Sensibilidad',
      timestamp: '23/11/2025, 18:34:04',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 2,
      type: 'scenario',
      name: 'Análisis de Escenarios',
      timestamp: '23/11/2025, 18:33:38',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 3,
      type: 'operational',
      name: 'Reporte Operativo',
      timestamp: '23/11/2025, 18:34:52',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 4,
      type: 'executive',
      name: 'Resumen Ejecutivo',
      timestamp: '23/11/2025, 18:34:46',
      status: 'completed',
      downloadUrl: '#'
    }
  ]);

  const reportTypes = [
    {
      id: 'executive',
      name: 'Resumen Ejecutivo',
      description: 'Reporte consolidado para alta dirección con KPIs clave',
      icon: '📄',
      requirements: ['excelData']
    },
    {
      id: 'operational',
      name: 'Reporte Operativo',
      description: 'Análisis detallado de operaciones diarias y métricas',
      icon: '📊',
      requirements: ['excelData', 'predictions']
    },
    {
      id: 'optimization',
      name: 'Reporte de Optimización',
      description: 'Resultados del plan óptimo de abastecimiento',
      icon: '⚙️',
      requirements: ['excelData', 'optimizationResult']
    },
    {
      id: 'scenario',
      name: 'Análisis de Escenarios',
      description: 'Comparativa de diferentes condiciones operativas',
      icon: '🔮',
      requirements: ['excelData', 'simulationScenarios']
    },
    {
      id: 'sensitivity',
      name: 'Análisis de Sensibilidad',
      description: 'Impacto de variaciones paramétricas en resultados',
      icon: '🎯',
      requirements: ['excelData', 'sensitivityAnalysis']
    },
    {
      id: 'comprehensive',
      name: 'Reporte Integral',
      description: 'Compilado completo de todos los análisis',
      icon: '📋',
      requirements: ['excelData', 'predictions', 'optimizationResult', 'simulationScenarios', 'sensitivityAnalysis']
    }
  ];

  const checkRequirements = (requirements) => {
    const dataAvailability = {
      excelData: !!excelData,
      predictions: !!predictions,
      optimizationResult: !!optimizationResult,
      simulationScenarios: !!simulationScenarios,
      sensitivityAnalysis: !!sensitivityAnalysis
    };

    return requirements.every(req => dataAvailability[req]);
  };

  const handleGenerateReport = async (reportType) => {
    const selectedReport = reportTypes.find(r => r.id === reportType);
    
    if (!checkRequirements(selectedReport.requirements)) {
      alert(`No se puede generar el reporte. Faltan datos requeridos.`);
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulación de generación de reporte
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newReport = {
        id: Date.now(),
        type: reportType,
        name: selectedReport.name,
        timestamp: new Date().toLocaleString(),
        status: 'completed',
        downloadUrl: '#'
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      
      alert(`Reporte "${selectedReport.name}" generado exitosamente`);
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = (reportId) => {
    const report = generatedReports.find(r => r.id === reportId);
    if (report) {
      // Simular descarga
      alert(`Descargando: ${report.name}`);
      // Aquí iría la lógica real de descarga
      console.log(`Descargando reporte: ${report.name}`);
    }
  };

  const handleViewReport = (reportId) => {
    const report = generatedReports.find(r => r.id === reportId);
    if (report) {
      // Simular visualización
      alert(`Vista previa: ${report.name}`);
      // Aquí iría la lógica real para mostrar el reporte
      console.log(`Mostrando reporte: ${report.name}`);
    }
  };

  const handleRegenerateReport = (reportId) => {
    const report = generatedReports.find(r => r.id === reportId);
    if (report) {
      // Simular regeneración
      alert(`Regenerando: ${report.name}`);
      handleGenerateReport(report.type);
    }
  };

  const handleExportPDF = () => {
    alert('Exportando a PDF...');
    // Lógica para exportar a PDF
    console.log('Exportando a PDF');
  };

  const handleExportExcel = () => {
    alert('Exportando a Excel...');
    // Lógica para exportar a Excel
    console.log('Exportando a Excel');
  };

  const handleGenerateHTML = () => {
    alert('Generando Dashboard HTML...');
    // Lógica para generar HTML
    console.log('Generando Dashboard HTML');
  };

  const handleCreatePPT = () => {
    alert('Creando presentación PPT...');
    // Lógica para crear PPT
    console.log('Creando presentación PPT');
  };

  const getReportStatus = () => {
    const status = {
      excelData: { available: !!excelData, label: 'Datos Base' },
      predictions: { available: !!predictions, label: 'Predicciones' },
      optimizationResult: { available: !!optimizationResult, label: 'Optimización' },
      simulationScenarios: { available: !!simulationScenarios, label: 'Escenarios' },
      sensitivityAnalysis: { available: !!sensitivityAnalysis, label: 'Sensibilidad' }
    };
    
    return status;
  };

  const operationalRecommendations = [
    {
      priority: 'high',
      title: 'Acciones Inmediatas',
      items: [
        'Optimizar rutas de cajeros Tipo A en zona norte',
        'Aumentar capacidad viernes en cajeros estratégicos',
        'Revisar niveles de seguridad en cajeros de alto tráfico'
      ]
    },
    {
      priority: 'medium',
      title: 'Mejoras de Proceso',
      items: [
        'Implementar sistema de alertas tempranas',
        'Automatizar reportes de desempeño semanal',
        'Capacitar equipo en análisis predictivo'
      ]
    },
    {
      priority: 'low',
      title: 'Planes Estratégicos',
      items: [
        'Evaluar implementación de cajeros inteligentes',
        'Desarrollar modelo de machine learning avanzado',
        'Integrar con sistemas de logística corporativa'
      ]
    }
  ];

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>📋 Gestión de Reportes - BGP</h1>
        <p>Sistema integral de generación y exportación de reportes ejecutivos</p>
      </div>

      <div className="reports-status card">
        <h2>Estado de Datos Disponibles</h2>
        <div className="status-grid">
          {Object.entries(getReportStatus()).map(([key, status]) => (
            <div key={key} className={`status-item ${status.available ? 'available' : 'missing'}`}>
              <span className="status-indicator"></span>
              <span className="status-label">{status.label}</span>
              <span className="status-text">
                {status.available ? 'Disponible' : 'Faltante'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="reports-generator card">
        <h2>Generación de Reportes Automáticos</h2>
        <div className="reports-grid">
          {reportTypes.map(report => (
            <div 
              key={report.id}
              className={`report-type-card ${checkRequirements(report.requirements) ? 'available' : 'disabled'}`}
            >
              <div className="report-header">
                <span className="report-icon">{report.icon}</span>
                <div className="report-info">
                  <h3>{report.name}</h3>
                  <p>{report.description}</p>
                </div>
              </div>
              
              <div className="report-requirements">
                <h4>Requisitos:</h4>
                <ul>
                  {report.requirements.map(req => (
                    <li 
                      key={req} 
                      className={getReportStatus()[req]?.available ? 'met' : 'unmet'}
                    >
                      {getReportStatus()[req]?.label}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="report-actions">
                <button 
                  className={`btn ${checkRequirements(report.requirements) ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={!checkRequirements(report.requirements) || isGenerating}
                >
                  {isGenerating ? 'Generando...' : 'Generar Reporte'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isGenerating && (
        <div className="generation-progress card">
          <div className="progress-content">
            <div className="progress-spinner"></div>
            <div>
              <h3>Generando Reporte</h3>
              <p>Compilando datos y generando formato ejecutivo...</p>
              <div className="progress-steps">
                <span className="step active">Recopilando datos</span>
                <span className="step">Generando gráficos</span>
                <span className="step">Formateando documento</span>
                <span className="step">Finalizando</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="recommendations-section card">
        <h2>💡 Recomendaciones Operativas</h2>
        <div className="recommendations-grid">
          {operationalRecommendations.map((category, index) => (
            <div key={index} className={`recommendation-category ${category.priority}`}>
              <h3>
                {category.priority === 'high' ? '✅' : 
                 category.priority === 'medium' ? '💡' : '🔮'} 
                {category.title}
              </h3>
              <ul>
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {generatedReports.length > 0 && (
        <div className="reports-history card">
          <h2>📚 Historial de Reportes Generados</h2>
          <div className="reports-list">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Reporte</th>
                  <th>Fecha de Generación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {generatedReports.map(report => (
                  <tr key={report.id}>
                    <td className="report-name">
                      <span className="report-icon">
                        {reportTypes.find(r => r.id === report.type)?.icon}
                      </span>
                      {report.name}
                    </td>
                    <td className="report-date">{report.timestamp}</td>
                    <td className="report-status">
                      <span className={`status-badge ${report.status}`}>
                        {report.status === 'completed' ? 'Completado' : 'En progreso'}
                      </span>
                    </td>
                    <td className="report-actions">
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        📥 Descargar
                      </button>
                      <button 
                        className="btn btn-info btn-sm"
                        onClick={() => handleViewReport(report.id)}
                      >
                        👁️ Ver
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRegenerateReport(report.id)}
                      >
                        🔄 Regenerar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="export-options card">
        <h2>📤 Opciones de Exportación</h2>
        <div className="export-grid">
          <div className="export-option">
            <h3>📄 Formato PDF</h3>
            <p>Documento listo para presentación ejecutiva</p>
            <button 
              className="btn btn-primary"
              onClick={handleExportPDF}
            >
              Exportar a PDF
            </button>
          </div>
          <div className="export-option">
            <h3>📊 Formato Excel</h3>
            <p>Datos tabulares para análisis adicional</p>
            <button 
              className="btn btn-success"
              onClick={handleExportExcel}
            >
              Exportar a Excel
            </button>
          </div>
          <div className="export-option">
            <h3>🌐 Dashboard HTML</h3>
            <p>Panel interactivo para compartir online</p>
            <button 
              className="btn btn-info"
              onClick={handleGenerateHTML}
            >
              Generar HTML
            </button>
          </div>
          <div className="export-option">
            <h3>💼 Presentación</h3>
            <p>Diapositivas para reuniones ejecutivas</p>
            <button 
              className="btn btn-warning"
              onClick={handleCreatePPT}
            >
              Crear PPT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
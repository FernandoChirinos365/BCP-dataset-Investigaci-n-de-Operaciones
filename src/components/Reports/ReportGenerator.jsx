import React, { useState } from 'react';
import './Reports.css';

const ReportGenerator = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'executive',
      title: 'Resumen Ejecutivo',
      description: 'Reporte consolidado para alta dirección',
      icon: '📄'
    },
    {
      id: 'dashboard',
      title: 'Dashboard Interactivo',
      description: 'Panel interactivo con todos los indicadores',
      icon: '📊'
    },
    {
      id: 'charts',
      title: 'Gráficos Consolidados',
      description: 'Compilado de todos los gráficos generados',
      icon: '📈'
    },
    {
      id: 'presentation',
      title: 'Presentación Ejecutiva',
      description: 'Diapositivas listas para presentación',
      icon: '💼'
    },
    {
      id: 'atm',
      title: 'Reporte por Cajero',
      description: 'Análisis detallado por cajero específico',
      icon: '🏦'
    },
    {
      id: 'comparative',
      title: 'Reporte Comparativo',
      description: 'Comparativa entre diferentes períodos',
      icon: '🔄'
    }
  ];

  const handleGenerateReport = async () => {
    if (!selectedReport) return;
    
    setIsGenerating(true);
    // Simular generación de reporte
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    alert(`Reporte ${reportTypes.find(r => r.id === selectedReport)?.title} generado exitosamente en formato ${format.toUpperCase()}`);
  };

  return (
    <div className="report-generator">
      <h3>Generación de Reportes Automáticos</h3>
      
      <div className="report-options">
        <div className="format-selector">
          <label>Formato de salida:</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="html">HTML</option>
            <option value="ppt">PowerPoint</option>
          </select>
        </div>
      </div>

      <div className="reports-grid">
        {reportTypes.map(report => (
          <div 
            key={report.id}
            className={`report-card ${selectedReport === report.id ? 'selected' : ''}`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="report-icon">{report.icon}</div>
            <div className="report-info">
              <h4>{report.title}</h4>
              <p>{report.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="report-actions">
        <button 
          className="btn btn-primary"
          onClick={handleGenerateReport}
          disabled={!selectedReport || isGenerating}
        >
          {isGenerating ? 'Generando...' : 'Generar Reporte Completado'}
        </button>
        
        <button className="btn btn-success" disabled={isGenerating}>
          Reporte por Cajero
        </button>
        
        <button className="btn btn-info" disabled={isGenerating}>
          Reporte Comparativo
        </button>
      </div>

      {isGenerating && (
        <div className="generation-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p>Generando reporte, por favor espere...</p>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
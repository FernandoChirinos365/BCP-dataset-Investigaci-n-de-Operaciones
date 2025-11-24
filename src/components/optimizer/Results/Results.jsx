import React from "react";
import "./Results.css";
import { useData } from "../../../context/DataContext";
import Button from "../../ui/Button/Button";

export default function Results() {
  const { excelData, optimizationResults } = useData();

  const handleExportResults = () => {
    if (!optimizationResults) {
      alert('❌ Primero debe ejecutar la optimización');
      return;
    }

    try {
      const blob = new Blob([JSON.stringify(optimizationResults, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `optimizacion_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('✅ Resultados exportados exitosamente');
    } catch (error) {
      console.error('Error exportando resultados:', error);
      alert('❌ Error al exportar resultados');
    }
  };

  if (!excelData || excelData.length === 0) {
    return (
      <div className="results-card">
        <h3>Resultados de Optimización</h3>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>No hay datos cargados aún.</p>
        </div>
      </div>
    );
  }

  if (!optimizationResults) {
    return (
      <div className="results-card">
        <h3>Resultados de Optimización</h3>
        <div className="empty-state">
          <div className="empty-icon">⚙️</div>
          <p>Ejecuta la optimización para ver los resultados.</p>
          <ul>
            <li>• Registros cargados: {excelData.length.toLocaleString()}</li>
            <li>• Plan de reposición semanal</li>
            <li>• Análisis de costos y riesgos</li>
            <li>• Recomendaciones de optimización</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="results-card">
      <div className="results-header">
        <h3>🎯 Resultados de Optimización</h3>
        <Button
          onClick={handleExportResults}
          variant="outline"
          className="export-btn"
        >
          📥 Exportar Resultados
        </Button>
      </div>

      {/* Métricas principales */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-value">S/ {optimizationResults.totalCost.toLocaleString()}</div>
          <div className="metric-label">Costo Total</div>
        </div>
        <div className="metric-card success">
          <div className="metric-value">{optimizationResults.costReduction}%</div>
          <div className="metric-label">Reducción vs Actual</div>
        </div>
        <div className="metric-card warning">
          <div className="metric-value">{optimizationResults.serviceLevel}%</div>
          <div className="metric-label">Nivel de Servicio</div>
        </div>
        <div className="metric-card info">
          <div className="metric-value">{optimizationResults.recordsProcessed.toLocaleString()}</div>
          <div className="metric-label">Registros Procesados</div>
        </div>
      </div>

      {/* Plan de reposición */}
      <div className="plan-section">
        <h4>📋 Plan Semanal de Reposición</h4>
        <div className="table-container">
          <table className="optimization-table">
            <thead>
              <tr>
                <th>Día</th>
                <th>Cajeros Tipo A</th>
                <th>Cajeros Tipo B</th>
                <th>Monto Total (S/)</th>
              </tr>
            </thead>
            <tbody>
              {optimizationResults.weeklyPlan.map((day, index) => (
                <tr key={index}>
                  <td className="day-cell">{day.day}</td>
                  <td className="count">{day.typeA}</td>
                  <td className="count">{day.typeB}</td>
                  <td className="amount">{day.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="recommendations-section">
        <h4>💡 Recomendaciones</h4>
        <ul className="recommendations-list">
          {optimizationResults.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
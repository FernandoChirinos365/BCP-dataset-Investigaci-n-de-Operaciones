import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button/Button';
import './Prediction.css';

// Componente de respaldo si ForecastChart no está disponible
const ForecastChartFallback = ({ actualData, forecastData }) => (
  <div className="chart-card">
    <h3>Pronóstico de Demanda</h3>
    <div className="chart-container">
      <p>Gráfico de pronóstico - Componente en desarrollo</p>
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        textAlign: 'center' 
      }}>
        <p>📊 Visualización de datos de predicción</p>
        <div style={{ marginTop: '10px' }}>
          {actualData?.map((item, index) => (
            <div key={index} style={{ 
              display: 'inline-block', 
              margin: '5px',
              padding: '10px',
              background: '#007bff',
              color: 'white',
              borderRadius: '4px'
            }}>
              {item.day}: S/{item.forecast}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Intenta importar ForecastChart, si no existe usa el fallback
let ForecastChart;
try {
  ForecastChart = require('../../components/Charts/ForecastChart').default;
} catch (error) {
  ForecastChart = ForecastChartFallback;
  console.log('ForecastChart no encontrado, usando componente de respaldo');
}

const Prediction = () => {
  const { setPredictions, excelData } = useData();
  const [horizon, setHorizon] = useState(7);
  const [model, setModel] = useState('arima');
  const [selectedAtms, setSelectedAtms] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Función para Exportar Pronósticos
  const handleExportForecasts = () => {
    try {
      if (!results || !results.forecast) {
        alert('No hay resultados de predicción para exportar');
        return;
      }

      // Usar los datos reales de la predicción
      const forecastData = results.forecast.map(row => ({
        día: row.day,
        valor_actual: row.actual,
        pronóstico: row.forecast,
        variación: `${((row.forecast - row.actual) / row.actual * 100).toFixed(1)}%`,
        confianza: `S/ ${row.confidence[0]} - S/ ${row.confidence[1]}`
      }));

      // Convertir a CSV
      const headers = ['Día', 'Valor Actual', 'Pronóstico', 'Variación', 'Intervalo Confianza'];
      const csvContent = [
        headers.join(','),
        ...forecastData.map(row => 
          [row.día, `S/ ${row.valor_actual}`, `S/ ${row.pronóstico}`, row.variación, row.confianza].join(',')
        )
      ].join('\n');

      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pronosticos_demanda_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('✅ Pronósticos exportados exitosamente');
    } catch (error) {
      console.error('Error exportando pronósticos:', error);
      alert('❌ Error al exportar pronósticos');
    }
  };

  // Función para Programar Predicción Recurrente
  const handleSchedulePrediction = () => {
    const frequency = prompt(
      '¿Cada cuánto días desea programar la predicción?\n\nEjemplo: 7 para semanal, 30 para mensual',
      '7'
    );
    
    if (frequency && !isNaN(frequency)) {
      // Aquí iría la lógica real de programación
      alert(`✅ Predicción programada cada ${frequency} días\n\n(Esta funcionalidad se conectaría con tu backend)`);
    }
  };

  // Función para Comparar con Histórico
  const handleCompareHistorical = () => {
    if (!excelData || excelData.length === 0) {
      alert('❌ No hay datos históricos cargados para comparar');
      return;
    }

    if (!results) {
      alert('❌ Primero debe ejecutar una predicción');
      return;
    }

    // Análisis comparativo más detallado usando datos reales
    const historicalDemands = excelData.map(row => row.demanda || row.demand || 0).filter(val => val > 0);
    const avgHistorical = historicalDemands.reduce((a, b) => a + b, 0) / historicalDemands.length;
    const currentAvg = results.forecast.reduce((sum, row) => sum + row.forecast, 0) / results.forecast.length;
    
    const variation = ((currentAvg - avgHistorical) / avgHistorical * 100).toFixed(1);
    const trend = variation > 0 ? 'ascendente' : 'descendente';

    alert(`📊 Análisis Comparativo Completo:\n\n• Promedio histórico: S/ ${avgHistorical.toFixed(0)}\n• Promedio pronosticado: S/ ${currentAvg.toFixed(0)}\n• Tendencia: ${trend} (${variation}%)\n• Precisión del modelo: ${results.accuracy.mape}% MAPE\n\nEl modelo muestra una predicción ${Math.abs(variation) > 10 ? 'significativamente diferente' : 'consistente'} con el histórico.`);
  };

  const handleRunPrediction = async () => {
    if (!excelData) {
      alert('Por favor, carga un dataset primero');
      return;
    }

    setIsLoading(true);
    
    // Simular llamada a servicio de predicción
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults = {
        accuracy: { 
          mape: 8.5, 
          rmse: 12.3,
          mae: 9.1 
        },
        forecast: [
          { day: 'Lun', actual: 120, forecast: 115, confidence: [110, 120] },
          { day: 'Mar', actual: 135, forecast: 130, confidence: [125, 135] },
          { day: 'Mié', actual: 110, forecast: 125, confidence: [120, 130] },
          { day: 'Jue', actual: 145, forecast: 140, confidence: [135, 145] },
          { day: 'Vie', actual: 160, forecast: 155, confidence: [150, 160] },
          { day: 'Sáb', actual: 130, forecast: 135, confidence: [130, 140] },
          { day: 'Dom', actual: 100, forecast: 105, confidence: [100, 110] }
        ],
        alerts: [
          { 
            type: 'warning', 
            message: 'Demanda elevada esperada para el viernes (+15% vs promedio)',
            impact: 'medium'
          },
          {
            type: 'info',
            message: 'Cajeros Tipo A muestran tendencia creciente',
            impact: 'low'
          }
        ],
        modelInfo: {
          name: model,
          horizon: horizon,
          trainedOn: excelData.length + ' registros'
        }
      };
      
      setResults(mockResults);
      setPredictions(mockResults);
    } catch (error) {
      console.error('Error en predicción:', error);
      alert('Error al ejecutar la predicción');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prediction-page">
      <div className="page-header">
        <h1>🔮 Predicción de Demanda</h1>
        <p>Pronósticos de demanda de efectivo utilizando modelos avanzados</p>
      </div>
      
      <div className="prediction-config card">
        <h2>Configuración del Modelo</h2>
        
        <div className="config-grid">
          <div className="config-item">
            <label>Horizonte de predicción:</label>
            <select 
              value={horizon} 
              onChange={(e) => setHorizon(Number(e.target.value))}
              disabled={isLoading}
            >
              <option value={7}>7 días</option>
              <option value={15}>15 días</option>
              <option value={30}>30 días</option>
            </select>
          </div>
          
          <div className="config-item">
            <label>Modelo:</label>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              disabled={isLoading}
            >
              <option value="arima">ARIMA (Series Temporales)</option>
              <option value="prophet">Facebook Prophet</option>
              <option value="neural">Red Neuronal LSTM</option>
              <option value="ensemble">Ensemble (Combinado)</option>
            </select>
          </div>
          
          <div className="config-item">
            <label>Cajeros a incluir:</label>
            <select 
              value={selectedAtms} 
              onChange={(e) => setSelectedAtms(e.target.value)}
              disabled={isLoading}
            >
              <option value="all">Todos los cajeros</option>
              <option value="typeA">Solo Tipo A</option>
              <option value="typeB">Solo Tipo B</option>
              <option value="selected">Seleccionar manualmente</option>
            </select>
          </div>
        </div>
        
        <div className="config-actions">
          <button 
            className="btn btn-primary"
            onClick={handleRunPrediction}
            disabled={isLoading || !excelData}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner-small"></span>
                Ejecutando Predicción...
              </>
            ) : (
              'Ejecutar Predicción'
            )}
          </button>
          
          {!excelData && (
            <span className="warning-text">
              ⚠️ Debes cargar un dataset primero
            </span>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="loading-card card">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div>
              <h3>Generando Predicciones</h3>
              <p>El modelo {model} está procesando {excelData?.length || 0} registros...</p>
              <div className="progress-steps">
                <span className="step active">Preparando datos</span>
                <span className="step">Entrenando modelo</span>
                <span className="step">Generando pronósticos</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {results && !isLoading && (
        <div className="prediction-results">
          <div className="results-header">
            <h2>Resultados del Pronóstico</h2>
            <div className="model-info">
              <span>Modelo: <strong>{results.modelInfo.name.toUpperCase()}</strong></span>
              <span>Horizonte: <strong>{results.modelInfo.horizon} días</strong></span>
              <span>Entrenado con: <strong>{results.modelInfo.trainedOn}</strong></span>
            </div>
          </div>

          <div className="results-section">
            <ForecastChart 
              actualData={results.forecast} 
              forecastData={results.forecast} 
            />
          </div>

          <div className="metrics-section card">
            <h3>🎯 Métricas de Precisión</h3>
            <div className="metrics-grid">
              <div className="metric-card accuracy">
                <div className="metric-value">{results.accuracy.mape}%</div>
                <div className="metric-label">MAPE</div>
                <div className="metric-desc">Error porcentual absoluto medio</div>
              </div>
              <div className="metric-card accuracy">
                <div className="metric-value">{results.accuracy.rmse}</div>
                <div className="metric-label">RMSE</div>
                <div className="metric-desc">Raíz del error cuadrático medio</div>
              </div>
              <div className="metric-card accuracy">
                <div className="metric-value">{results.accuracy.mae}</div>
                <div className="metric-label">MAE</div>
                <div className="metric-desc">Error absoluto medio</div>
              </div>
            </div>
          </div>

          {results.alerts.length > 0 && (
            <div className="alerts-section card">
              <h3>⚠️ Alertas de Demanda Extraordinaria</h3>
              <div className="alerts-grid">
                {results.alerts.map((alert, index) => (
                  <div key={index} className={`alert-item ${alert.type} ${alert.impact}`}>
                    <div className="alert-icon">
                      {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </div>
                    <div className="alert-content">
                      <p>{alert.message}</p>
                      <span className="alert-impact">
                        Impacto: {alert.impact === 'high' ? 'Alto' : alert.impact === 'medium' ? 'Medio' : 'Bajo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="forecast-table card">
            <h3>📋 Tabla de Demandas Pronosticadas (7 días)</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Valor Actual</th>
                    <th>Pronóstico</th>
                    <th>Variación</th>
                    <th>Intervalo Confianza</th>
                  </tr>
                </thead>
                <tbody>
                  {results.forecast.map((row, index) => (
                    <tr key={index}>
                      <td className="day-cell">{row.day}</td>
                      <td className="amount">S/ {row.actual}</td>
                      <td className="amount">S/ {row.forecast}</td>
                      <td className={`variation ${row.forecast > row.actual ? 'positive' : 'negative'}`}>
                        {((row.forecast - row.actual) / row.actual * 100).toFixed(1)}%
                      </td>
                      <td className="confidence">
                        S/ {row.confidence[0]} - S/ {row.confidence[1]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOTONES FUNCIONALES */}
          <div className="prediction-actions">
            <Button 
              onClick={handleExportForecasts}
              variant="primary"
              className="action-button"
            >
              📥 Exportar Pronósticos
            </Button>
            
            <Button 
              onClick={handleSchedulePrediction}
              variant="outline"
              className="action-button"
            >
              ⏰ Programar Predicción Recurrente
            </Button>
            
            <Button 
              onClick={handleCompareHistorical}
              variant="success"
              className="action-button"
            >
              📊 Comparar con Histórico
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import './Sensitivity.css';

const Sensitivity = () => {
  const { setSensitivityAnalysis, excelData, setModelParameters } = useData();
  const [parameters, setParameters] = useState({
    costA: { min: 0.08, max: 0.12, current: 0.1 },
    costB: { min: 0.13, max: 0.17, current: 0.15 },
    securityLevel: { min: 15, max: 25, current: 20 },
    capacity: { min: -10, max: 10, current: 0 }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Función para Exportar Análisis Completo
  const handleExportAnalysis = () => {
    if (!results) {
      alert('❌ Primero debe ejecutar el análisis de sensibilidad');
      return;
    }

    try {
      const exportData = {
        fechaAnalisis: new Date().toISOString(),
        parametrosActuales: parameters,
        resultados: results,
        resumen: {
          parametroMasSensible: results.tornadoChart[0].parameter,
          impactoMaximo: results.tornadoChart[0].impact + '%',
          escenarioOptimo: results.extremeScenarios.find(s => s.scenario === 'Balance Óptimo'),
          puntosCriticos: results.criticalPoints
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analisis_sensibilidad_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('✅ Análisis exportado exitosamente');
    } catch (error) {
      console.error('Error exportando análisis:', error);
      alert('❌ Error al exportar análisis');
    }
  };

  // Función para Generar Reporte Ejecutivo
  const handleGenerateExecutiveReport = () => {
    if (!results) {
      alert('❌ Primero debe ejecutar el análisis de sensibilidad');
      return;
    }

    try {
      const optimalScenario = results.extremeScenarios.find(s => s.scenario === 'Balance Óptimo');
      const worstScenario = results.extremeScenarios.find(s => s.scenario === 'Máximo Costo');
      const bestScenario = results.extremeScenarios.find(s => s.scenario === 'Mínimo Costo');

      const reportContent = `
ANÁLISIS DE SENSIBILIDAD - GESTIÓN DE EFECTIVO BCP
Fecha: ${new Date().toLocaleDateString()}
==================================================

RESUMEN EJECUTIVO
------------------
• Parámetro más sensible: ${results.tornadoChart[0].parameter}
• Impacto máximo identificado: ${results.tornadoChart[0].impact}%
• Ahorro potencial: ${((worstScenario.totalCost - bestScenario.totalCost) / worstScenario.totalCost * 100).toFixed(1)}%

ESCENARIOS CLAVE
----------------
🔵 ESCENARIO ÓPTIMO (Recomendado)
   - Costo total: S/ ${optimalScenario.totalCost.toLocaleString()}
   - Nivel de servicio: ${optimalScenario.serviceLevel}%
   - Parámetros: 
     * Costo A: ${optimalScenario.parameters.costA}%
     * Costo B: ${optimalScenario.parameters.costB}%
     * Seguridad: ${optimalScenario.parameters.securityLevel}%
     * Capacidad: ${optimalScenario.parameters.capacity > 0 ? '+' : ''}${optimalScenario.parameters.capacity}%

🔴 ESCENARIO MÁXIMO COSTO (Evitar)
   - Costo total: S/ ${worstScenario.totalCost.toLocaleString()}
   - Impacto vs óptimo: +${((worstScenario.totalCost - optimalScenario.totalCost) / optimalScenario.totalCost * 100).toFixed(1)}%

🟢 ESCENARIO MÍNIMO COSTO
   - Costo total: S/ ${bestScenario.totalCost.toLocaleString()}
   - Nivel de servicio: ${bestScenario.serviceLevel}%

RECOMENDACIONES ESTRATÉGICAS
---------------------------
${results.criticalPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

CONCLUSIONES
------------
El análisis revela que el ${results.tornadoChart[0].parameter} es el factor más crítico.
Se recomienda implementar el escenario de balance óptimo para maximizar eficiencia.
      `.trim();

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_ejecutivo_sensibilidad_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('✅ Reporte ejecutivo generado exitosamente');
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('❌ Error al generar reporte ejecutivo');
    }
  };

  // Función para Aplicar Parámetros Óptimos
  const handleApplyOptimalParameters = () => {
    if (!results) {
      alert('❌ Primero debe ejecutar el análisis de sensibilidad');
      return;
    }

    try {
      const optimalScenario = results.extremeScenarios.find(s => s.scenario === 'Balance Óptimo');
      
      if (!optimalScenario) {
        alert('❌ No se encontró escenario óptimo en los resultados');
        return;
      }

      // Actualizar parámetros en el estado local
      setParameters(prev => ({
        ...prev,
        costA: { ...prev.costA, current: optimalScenario.parameters.costA },
        costB: { ...prev.costB, current: optimalScenario.parameters.costB },
        securityLevel: { ...prev.securityLevel, current: optimalScenario.parameters.securityLevel },
        capacity: { ...prev.capacity, current: optimalScenario.parameters.capacity }
      }));

      // Actualizar parámetros en el contexto global
      setModelParameters(prev => ({
        ...prev,
        costA: optimalScenario.parameters.costA,
        costB: optimalScenario.parameters.costB,
        securityLevel: optimalScenario.parameters.securityLevel,
        capacity: optimalScenario.parameters.capacity > 0 ? 'increased' : optimalScenario.parameters.capacity < 0 ? 'decreased' : 'auto'
      }));

      alert(`✅ Parámetros óptimos aplicados exitosamente:\n\n• Costo A: ${optimalScenario.parameters.costA}%\n• Costo B: ${optimalScenario.parameters.costB}%\n• Seguridad: ${optimalScenario.parameters.securityLevel}%\n• Capacidad: ${optimalScenario.parameters.capacity > 0 ? '+' : ''}${optimalScenario.parameters.capacity}%\n\nEstos parámetros se utilizarán en futuras optimizaciones.`);
    } catch (error) {
      console.error('Error aplicando parámetros óptimos:', error);
      alert('❌ Error al aplicar parámetros óptimos');
    }
  };

  const handleParameterChange = (param, field, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: {
        ...prev[param],
        [field]: Number(value)
      }
    }));
  };

  const handleRunAnalysis = async () => {
    if (!excelData) {
      alert('Por favor, carga un dataset primero');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockResults = {
        tornadoChart: [
          { parameter: 'Costo Transporte A', impact: 12.5, direction: 'positive' },
          { parameter: 'Nivel Seguridad', impact: 8.3, direction: 'negative' },
          { parameter: 'Costo Transporte B', impact: 6.7, direction: 'positive' },
          { parameter: 'Capacidad Cajeros', impact: 4.2, direction: 'negative' }
        ],
        sensitivityCurves: [
          {
            parameter: 'Costo Transporte A',
            data: [
              { value: 0.08, cost: 42300 },
              { value: 0.09, cost: 43800 },
              { value: 0.1, cost: 45230 },
              { value: 0.11, cost: 46700 },
              { value: 0.12, cost: 48150 }
            ]
          },
          {
            parameter: 'Nivel Seguridad',
            data: [
              { value: 15, cost: 43800 },
              { value: 18, cost: 44500 },
              { value: 20, cost: 45230 },
              { value: 22, cost: 46000 },
              { value: 25, cost: 47100 }
            ]
          }
        ],
        extremeScenarios: [
          {
            scenario: 'Máximo Costo',
            parameters: { costA: 0.12, costB: 0.17, securityLevel: 25, capacity: -10 },
            totalCost: 51200,
            serviceLevel: 96.8
          },
          {
            scenario: 'Mínimo Costo',
            parameters: { costA: 0.08, costB: 0.13, securityLevel: 15, capacity: 10 },
            totalCost: 39800,
            serviceLevel: 92.1
          },
          {
            scenario: 'Balance Óptimo',
            parameters: { costA: 0.09, costB: 0.14, securityLevel: 18, capacity: 5 },
            totalCost: 41500,
            serviceLevel: 95.2
          }
        ],
        criticalPoints: [
          'Costo Transporte A > 0.11 impacta significativamente',
          'Nivel Seguridad < 18% afecta servicio críticamente',
          'Capacidad +5% genera mejoras marginales'
        ]
      };
      
      setResults(mockResults);
      setSensitivityAnalysis(mockResults);
    } catch (error) {
      console.error('Error en análisis:', error);
      alert('Error al ejecutar el análisis de sensibilidad');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateImpact = (param) => {
    const range = parameters[param].max - parameters[param].min;
    const position = (parameters[param].current - parameters[param].min) / range;
    return position;
  };

  return (
    <div className="sensitivity-page">
      <div className="page-header">
        <h1>🎯 Análisis de Sensibilidad</h1>
        <p>Evalúa el impacto de variaciones en parámetros clave del modelo</p>
      </div>
      
      <div className="sensitivity-config card">
        <h2>Panel de Control de Parámetros</h2>
        
        <div className="parameters-grid">
          <div className="parameter-card">
            <div className="parameter-header">
              <h3>🚚 Costo Transporte A</h3>
              <span className="parameter-value">{parameters.costA.current}%</span>
            </div>
            <div className="parameter-controls">
              <input 
                type="range"
                min={parameters.costA.min}
                max={parameters.costA.max}
                step={0.01}
                value={parameters.costA.current}
                onChange={(e) => handleParameterChange('costA', 'current', e.target.value)}
                className="parameter-slider"
              />
              <div className="parameter-range">
                <span>{parameters.costA.min}%</span>
                <span>Rango: {parameters.costA.min}% - {parameters.costA.max}%</span>
                <span>{parameters.costA.max}%</span>
              </div>
            </div>
          </div>

          <div className="parameter-card">
            <div className="parameter-header">
              <h3>🚛 Costo Transporte B</h3>
              <span className="parameter-value">{parameters.costB.current}%</span>
            </div>
            <div className="parameter-controls">
              <input 
                type="range"
                min={parameters.costB.min}
                max={parameters.costB.max}
                step={0.01}
                value={parameters.costB.current}
                onChange={(e) => handleParameterChange('costB', 'current', e.target.value)}
                className="parameter-slider"
              />
              <div className="parameter-range">
                <span>{parameters.costB.min}%</span>
                <span>Rango: {parameters.costB.min}% - {parameters.costB.max}%</span>
                <span>{parameters.costB.max}%</span>
              </div>
            </div>
          </div>

          <div className="parameter-card">
            <div className="parameter-header">
              <h3>🛡️ Nivel Seguridad</h3>
              <span className="parameter-value">{parameters.securityLevel.current}%</span>
            </div>
            <div className="parameter-controls">
              <input 
                type="range"
                min={parameters.securityLevel.min}
                max={parameters.securityLevel.max}
                step={1}
                value={parameters.securityLevel.current}
                onChange={(e) => handleParameterChange('securityLevel', 'current', e.target.value)}
                className="parameter-slider"
              />
              <div className="parameter-range">
                <span>{parameters.securityLevel.min}%</span>
                <span>Rango: {parameters.securityLevel.min}% - {parameters.securityLevel.max}%</span>
                <span>{parameters.securityLevel.max}%</span>
              </div>
            </div>
          </div>

          <div className="parameter-card">
            <div className="parameter-header">
              <h3>📦 Capacidad Cajeros</h3>
              <span className="parameter-value">{parameters.capacity.current > 0 ? '+' : ''}{parameters.capacity.current}%</span>
            </div>
            <div className="parameter-controls">
              <input 
                type="range"
                min={parameters.capacity.min}
                max={parameters.capacity.max}
                step={1}
                value={parameters.capacity.current}
                onChange={(e) => handleParameterChange('capacity', 'current', e.target.value)}
                className="parameter-slider"
              />
              <div className="parameter-range">
                <span>{parameters.capacity.min}%</span>
                <span>Rango: ±10%</span>
                <span>+{parameters.capacity.max}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="analysis-actions">
          <button 
            className="btn btn-primary"
            onClick={handleRunAnalysis}
            disabled={isLoading || !excelData}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner-small"></span>
                Ejecutando Análisis What-If...
              </>
            ) : (
              'Ejecutar Análisis What-If'
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
              <h3>Calculando Sensibilidades</h3>
              <p>Analizando impacto de variaciones paramétricas...</p>
            </div>
          </div>
        </div>
      )}

      {results && !isLoading && (
        <div className="sensitivity-results">
          <div className="results-header">
            <h2>Resultados del Análisis de Sensibilidad</h2>
          </div>

          <div className="tornado-section card">
            <h3>📊 Gráfico Tornado (Impacto en Costos)</h3>
            <div className="tornado-chart">
              {results.tornadoChart.map((item, index) => (
                <div key={index} className="tornado-bar">
                  <div className="parameter-name">{item.parameter}</div>
                  <div className="tornado-track">
                    <div 
                      className={`tornado-fill ${item.direction}`}
                      style={{ width: `${item.impact * 4}%` }}
                    ></div>
                  </div>
                  <div className="impact-value">{item.impact}%</div>
                </div>
              ))}
            </div>
            <div className="tornado-legend">
              <div className="legend-item">
                <span className="legend-color positive"></span>
                Impacto Positivo (Aumenta costos)
              </div>
              <div className="legend-item">
                <span className="legend-color negative"></span>
                Impacto Negativo (Reduce costos)
              </div>
            </div>
          </div>

          <div className="curves-section card">
            <h3>📈 Curvas de Sensibilidad</h3>
            <div className="curves-grid">
              {results.sensitivityCurves.map((curve, index) => (
                <div key={index} className="curve-card">
                  <h4>{curve.parameter}</h4>
                  <div className="curve-chart">
                    {curve.data.map((point, pointIndex) => (
                      <div 
                        key={pointIndex}
                        className="curve-point"
                        style={{
                          left: `${((point.value - curve.data[0].value) / (curve.data[curve.data.length - 1].value - curve.data[0].value)) * 100}%`,
                          bottom: `${((point.cost - 42000) / (50000 - 42000)) * 100}%`
                        }}
                        title={`Valor: ${point.value}, Costo: S/ ${point.cost.toLocaleString()}`}
                      ></div>
                    ))}
                  </div>
                  <div className="curve-labels">
                    <span>{curve.data[0].value}</span>
                    <span>Valor</span>
                    <span>{curve.data[curve.data.length - 1].value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="scenarios-section card">
            <h3>🔄 Tabla de Escenarios Extremos</h3>
            <div className="scenarios-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Escenario</th>
                    <th>Costo A</th>
                    <th>Costo B</th>
                    <th>Seguridad</th>
                    <th>Capacidad</th>
                    <th>Costo Total</th>
                    <th>Nivel Servicio</th>
                  </tr>
                </thead>
                <tbody>
                  {results.extremeScenarios.map((scenario, index) => (
                    <tr key={index}>
                      <td className="scenario-name">{scenario.scenario}</td>
                      <td>{scenario.parameters.costA}%</td>
                      <td>{scenario.parameters.costB}%</td>
                      <td>{scenario.parameters.securityLevel}%</td>
                      <td>{scenario.parameters.capacity > 0 ? '+' : ''}{scenario.parameters.capacity}%</td>
                      <td className="cost-amount">S/ {scenario.totalCost.toLocaleString()}</td>
                      <td className={`service-level ${scenario.serviceLevel > 95 ? 'good' : scenario.serviceLevel > 92 ? 'fair' : 'poor'}`}>
                        {scenario.serviceLevel}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="critical-points card">
            <h3>⚠️ Puntos Críticos del Modelo</h3>
            <div className="points-list">
              {results.criticalPoints.map((point, index) => (
                <div key={index} className="critical-point">
                  <span className="point-icon">⚡</span>
                  <span className="point-text">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendations-summary card">
            <h3>💡 Recomendaciones de Ajuste</h3>
            <div className="recommendations-grid">
              <div className="recommendation-item urgent">
                <h4>🔄 Prioridad Alta</h4>
                <p>Optimizar rutas de transporte Tipo A para mantener costos bajo 0.11%</p>
              </div>
              <div className="recommendation-item medium">
                <h4>⚖️ Prioridad Media</h4>
                <p>Revisar política de nivel de seguridad para balance costo-servicio</p>
              </div>
              <div className="recommendation-item low">
                <h4>📈 Prioridad Baja</h4>
                <p>Evaluar incrementos graduales de capacidad en cajeros estratégicos</p>
              </div>
            </div>
          </div>

          {/* BOTONES FUNCIONALES */}
          <div className="actions-section">
            <button 
              className="btn btn-success"
              onClick={handleExportAnalysis}
            >
              Exportar Análisis Completo
            </button>
            
            <button 
              className="btn btn-info"
              onClick={handleGenerateExecutiveReport}
            >
              Generar Reporte Ejecutivo
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={handleApplyOptimalParameters}
            >
              Aplicar Parámetros Óptimos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sensitivity;
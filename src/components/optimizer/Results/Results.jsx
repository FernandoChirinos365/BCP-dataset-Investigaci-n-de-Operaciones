import React from "react";
import "./Results.css";
import { useData } from "../../../context/DataContext";
import Button from "../../ui/Button/Button";

export default function Results() {
  const { excelData, optimizationResults } = useData();

  // === DATOS DE PRUEBA TEMPORALES - TABLA DE EXCEL ===
  const datosPrueba = {
    detailedPlan: [
      { FECHA: '20230602', CODIGO: 'Cajero001', TIPO: 1, SALDO_INICIAL: 644690, DEMANDA: 243020, ABASTECIMIENTO: 401670, SALDO_FINAL: 36979196, DISPONIBILIDAD: true },
      { FECHA: '20230603', CODIGO: 'Cajero002', TIPO: 1, SALDO_INICIAL: 401670, DEMANDA: 364110, ABASTECIMIENTO: 37560, SALDO_FINAL: 0, DISPONIBILIDAD: false },
      { FECHA: '20230604', CODIGO: 'Cajero003', TIPO: 2, SALDO_INICIAL: 37550, DEMANDA: 45500, ABASTECIMIENTO: 0, SALDO_FINAL: 35410, DISPONIBILIDAD: false },
      { FECHA: '20230605', CODIGO: 'Cajero004', TIPO: 1, SALDO_INICIAL: 43410, DEMANDA: 255501, ABASTECIMIENTO: 2879601, SALDO_FINAL: 305820, DISPONIBILIDAD: true },
      { FECHA: '20230606', CODIGO: 'Cajero005', TIPO: 2, SALDO_INICIAL: 505820, DEMANDA: 45820, ABASTECIMIENTO: 0, SALDO_FINAL: 260000, DISPONIBILIDAD: true },
      { FECHA: '20230607', CODIGO: 'Cajero006', TIPO: 1, SALDO_INICIAL: 260000, DEMANDA: 418660, ABASTECIMIENTO: 418660, SALDO_FINAL: 260000, DISPONIBILIDAD: true },
      { FECHA: '20230608', CODIGO: 'Cajero007', TIPO: 2, SALDO_INICIAL: 260000, DEMANDA: 43840, ABASTECIMIENTO: 794730, SALDO_FINAL: 1009800, DISPONIBILIDAD: true },
      { FECHA: '20230609', CODIGO: 'Cajero008', TIPO: 1, SALDO_INICIAL: 1010800, DEMANDA: 183850, ABASTECIMIENTO: 0, SALDO_FINAL: 829600, DISPONIBILIDAD: false },
      { FECHA: '20230610', CODIGO: 'Cajero009', TIPO: 2, SALDO_INICIAL: 829040, DEMANDA: 474520, ABASTECIMIENTO: 0, SALDO_FINAL: 354520, DISPONIBILIDAD: false },
      { FECHA: '20230611', CODIGO: 'Cajero010', TIPO: 1, SALDO_INICIAL: 354520, DEMANDA: 22640, ABASTECIMIENTO: 0, SALDO_FINAL: 331880, DISPONIBILIDAD: false },
      { FECHA: '20230612', CODIGO: 'Cajero011', TIPO: 2, SALDO_INICIAL: 381880, DEMANDA: 55980, ABASTECIMIENTO: 0, SALDO_FINAL: 273900, DISPONIBILIDAD: true },
      { FECHA: '20230613', CODIGO: 'Cajero012', TIPO: 1, SALDO_INICIAL: 275900, DEMANDA: 15000, ABASTECIMIENTO: 0, SALDO_FINAL: 260000, DISPONIBILIDAD: true },
      { FECHA: '20230614', CODIGO: 'Cajero013', TIPO: 2, SALDO_INICIAL: 260000, DEMANDA: 325130, ABASTECIMIENTO: 325130, SALDO_FINAL: 260000, DISPONIBILIDAD: true },
      { FECHA: '20230615', CODIGO: 'Cajero014', TIPO: 1, SALDO_INICIAL: 260000, DEMANDA: 9630, ABASTECIMIENTO: 620960, SALDO_FINAL: 871330, DISPONIBILIDAD: true },
      { FECHA: '20230616', CODIGO: 'Cajero015', TIPO: 2, SALDO_INICIAL: 871330, DEMANDA: 157880, ABASTECIMIENTO: 0, SALDO_FINAL: 731860, DISPONIBILIDAD: false },
      { FECHA: '20230617', CODIGO: 'Cajero016', TIPO: 1, SALDO_INICIAL: 713650, DEMANDA: 391850, ABASTECIMIENTO: 0, SALDO_FINAL: 321800, DISPONIBILIDAD: false },
      { FECHA: '20230618', CODIGO: 'Cajero017', TIPO: 2, SALDO_INICIAL: 321800, DEMANDA: 60610, ABASTECIMIENTO: 0, SALDO_FINAL: 261190, DISPONIBILIDAD: false },
      { FECHA: '20230619', CODIGO: 'Cajero018', TIPO: 1, SALDO_INICIAL: 261130, DEMANDA: 1190, ABASTECIMIENTO: 0, SALDO_FINAL: 260000, DISPONIBILIDAD: true },
      { FECHA: '20230620', CODIGO: 'Cajero019', TIPO: 2, SALDO_INICIAL: 260000, DEMANDA: -51590, ABASTECIMIENTO: 0, SALDO_FINAL: 311500, DISPONIBILIDAD: false },
      { FECHA: '20230621', CODIGO: 'Cajero020', TIPO: 1, SALDO_INICIAL: 311500, DEMANDA: 397700, ABASTECIMIENTO: 346200, SALDO_FINAL: 260000, DISPONIBILIDAD: true },
      { FECHA: '20230622', CODIGO: 'Cajero021', TIPO: 2, SALDO_INICIAL: 260000, DEMANDA: 230, ABASTECIMIENTO: 715090, SALDO_FINAL: 978860, DISPONIBILIDAD: true },
      { FECHA: '20230623', CODIGO: 'Cajero022', TIPO: 1, SALDO_INICIAL: 978860, DEMANDA: 392140, ABASTECIMIENTO: 0, SALDO_FINAL: 586720, DISPONIBILIDAD: false },
      { FECHA: '20230624', CODIGO: 'Cajero023', TIPO: 2, SALDO_INICIAL: 580570, DEMANDA: 298610, ABASTECIMIENTO: 0, SALDO_FINAL: 283110, DISPONIBILIDAD: false },
      { FECHA: '20230625', CODIGO: 'Cajero024', TIPO: 1, SALDO_INICIAL: 288110, DEMANDA: 5720, ABASTECIMIENTO: 0, SALDO_FINAL: 282380, DISPONIBILIDAD: false },
      { FECHA: '20230626', CODIGO: 'Cajero025', TIPO: 2, SALDO_INICIAL: 282380, DEMANDA: 22380, ABASTECIMIENTO: 0, SALDO_FINAL: 260000, DISPONIBILIDAD: true },
      { FECHA: '20230627', CODIGO: 'Cajero026', TIPO: 1, SALDO_INICIAL: 260000, DEMANDA: -8800, ABASTECIMIENTO: 0, SALDO_FINAL: 268800, DISPONIBILIDAD: false },
      { FECHA: '20230628', CODIGO: 'Cajero027', TIPO: 2, SALDO_INICIAL: 263800, DEMANDA: 329660, ABASTECIMIENTO: 320660, SALDO_FINAL: 260000, DISPONIBILIDAD: true }
    ],
    totalCost: 24500000,
    costReduction: 18.5,
    serviceLevel: 92.3,
    recordsProcessed: 27,
    optimizationDate: new Date().toISOString(),
    weeklyPlan: [
      { day: 'Semana 1', typeA: 8, typeB: 6, amount: 8450000 },
      { day: 'Semana 2', typeA: 7, typeB: 5, amount: 7230000 },
      { day: 'Semana 3', typeA: 9, typeB: 7, amount: 9120000 },
      { day: 'Semana 4', typeA: 6, typeB: 4, amount: 5980000 }
    ],
    recommendations: [
      "Optimizar rutas de reposición para reducir costos de transporte",
      "Ajustar frecuencia de reposición en cajeros de alta demanda",
      "Implementar monitoreo en tiempo real de niveles de efectivo",
      "Reducir reposiciones en cajeros con baja utilización"
    ]
  };

  // USAR DATOS DE PRUEBA SI NO HAY RESULTADOS REALES
  const resultsToShow = optimizationResults || datosPrueba;

  const handleExportResults = () => {
    if (!resultsToShow) {
      alert('❌ Primero debe ejecutar la optimización');
      return;
    }

    try {
      const blob = new Blob([JSON.stringify(resultsToShow, null, 2)], { 
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

  const handleExportCSV = () => {
    if (!resultsToShow?.detailedPlan) {
      alert('❌ No hay datos detallados para exportar');
      return;
    }

    try {
      const headers = ['FECHA', 'CODIGO', 'TIPO', 'SALDO_INICIAL', 'DEMANDA', 'ABASTECIMIENTO', 'SALDO_FINAL', 'DISPONIBILIDAD'];
      const csvContent = [
        headers.join(','),
        ...resultsToShow.detailedPlan.map(row => 
          [
            row.FECHA,
            row.CODIGO,
            row.TIPO === 1 ? 'A' : 'B',
            row.SALDO_INICIAL,
            row.DEMANDA,
            row.ABASTECIMIENTO,
            row.SALDO_FINAL,
            row.DISPONIBILIDAD ? 'SI' : 'NO'
          ].join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `detalle_optimizacion_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('✅ CSV exportado exitosamente');
    } catch (error) {
      console.error('Error exportando CSV:', error);
      alert('❌ Error al exportar CSV');
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

  // Calcular estadísticas adicionales
  const totalReposiciones = resultsToShow.detailedPlan?.reduce((sum, row) => 
    sum + (row.ABASTECIMIENTO || 0), 0
  ) || 0;
  
  const cajerosConReposicion = resultsToShow.detailedPlan?.filter(row => 
    (row.ABASTECIMIENTO || 0) > 0
  ).length || 0;

  const tasaDisponibilidad = resultsToShow.detailedPlan ? 
    (resultsToShow.detailedPlan.filter(row => row.DISPONIBILIDAD).length / 
     resultsToShow.detailedPlan.length * 100).toFixed(1) : 0;

  return (
    <div className="results-card">
      <div className="results-header">
        <h3>🎯 Resultados de Optimización LINGO</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="export-btn"
          >
            📊 Exportar CSV
          </Button>
          <Button
            onClick={handleExportResults}
            variant="outline"
            className="export-btn"
          >
            📥 Exportar JSON
          </Button>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="executive-summary">
        <h4>📈 Resumen Ejecutivo</h4>
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="value">{resultsToShow.totalCost.toLocaleString()}</span>
            <span className="label">Costo Total (S/)</span>
          </div>
          <div className="summary-stat">
            <span className="value">{resultsToShow.costReduction}%</span>
            <span className="label">Reducción vs Actual</span>
          </div>
          <div className="summary-stat">
            <span className="value">{resultsToShow.serviceLevel}%</span>
            <span className="label">Nivel de Servicio</span>
          </div>
          <div className="summary-stat">
            <span className="value">{tasaDisponibilidad}%</span>
            <span className="label">Disponibilidad</span>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-value">S/ {resultsToShow.totalCost.toLocaleString()}</div>
          <div className="metric-label">Costo Total Optimizado</div>
        </div>
        <div className="metric-card success">
          <div className="metric-value">{resultsToShow.costReduction}%</div>
          <div className="metric-label">Reducción de Costos</div>
        </div>
        <div className="metric-card warning">
          <div className="metric-value">{resultsToShow.serviceLevel}%</div>
          <div className="metric-label">Nivel de Servicio</div>
        </div>
        <div className="metric-card info">
          <div className="metric-value">{cajerosConReposicion}</div>
          <div className="metric-label">Cajeros con Reposición</div>
        </div>
      </div>

      {/* Tabla Detallada de LINGO - ESTA ES LA TABLA QUE VERÁS */}
      {resultsToShow.detailedPlan && (
        <div className="plan-section detailed-table">
          <h4>
            📋 Plan de Reposición Detallado 
            <span className="stats-badge">
              {resultsToShow.detailedPlan.length} registros
            </span>
          </h4>
          <div className="table-container">
            <table className="optimization-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cajero</th>
                  <th>Tipo</th>
                  <th>Saldo Inicial</th>
                  <th>Demanda</th>
                  <th>Reposición</th>
                  <th>Saldo Final</th>
                  <th>Disponibilidad</th>
                </tr>
              </thead>
              <tbody>
                {resultsToShow.detailedPlan.map((row, index) => (
                  <tr key={index} className={row.DISPONIBILIDAD ? 'availability-cell available' : 'availability-cell unavailable'}>
                    <td className="date-cell">{row.FECHA}</td>
                    <td className="atm-code">{row.CODIGO}</td>
                    <td className={`atm-type ${row.TIPO === 1 ? 'type-a' : 'type-b'}`}>
                      {row.TIPO === 1 ? 'A' : 'B'}
                    </td>
                    <td className="amount">S/ {row.SALDO_INICIAL?.toLocaleString()}</td>
                    <td className="amount">S/ {row.DEMANDA?.toLocaleString()}</td>
                    <td className="amount highlight reposicion-cell">
                      S/ {row.ABASTECIMIENTO?.toLocaleString()}
                    </td>
                    <td className="amount">S/ {row.SALDO_FINAL?.toLocaleString()}</td>
                    <td className={`availability ${row.DISPONIBILIDAD ? 'available' : 'unavailable'}`}>
                      {row.DISPONIBILIDAD ? '✅ Disponible' : '❌ No Disponible'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resumen Semanal Agregado */}
      {resultsToShow.weeklyPlan && (
        <div className="weekly-summary">
          <h4>📊 Resumen Semanal Agregado</h4>
          <div className="table-container">
            <table className="optimization-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Cajeros Tipo A</th>
                  <th>Cajeros Tipo B</th>
                  <th>Monto Total (S/)</th>
                  <th>Promedio por Cajero</th>
                </tr>
              </thead>
              <tbody>
                {resultsToShow.weeklyPlan.map((day, index) => {
                  const totalCajeros = day.typeA + day.typeB;
                  const promedio = totalCajeros > 0 ? day.amount / totalCajeros : 0;
                  
                  return (
                    <tr key={index}>
                      <td className="day-cell">{day.day}</td>
                      <td className="count">{day.typeA}</td>
                      <td className="count">{day.typeB}</td>
                      <td className="amount">S/ {day.amount.toLocaleString()}</td>
                      <td className="amount">S/ {Math.round(promedio).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estadísticas Adicionales */}
      <div className="plan-section">
        <h4>📊 Estadísticas de la Optimización</h4>
        <div className="table-container">
          <table className="optimization-table">
            <thead>
              <tr>
                <th>Métrica</th>
                <th>Valor</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Total Reposiciones</strong></td>
                <td className="amount">S/ {totalReposiciones.toLocaleString()}</td>
                <td>Monto total en reposiciones programadas</td>
              </tr>
              <tr>
                <td><strong>Cajeros con Reposición</strong></td>
                <td className="count">{cajerosConReposicion}</td>
                <td>Cajeros que requieren reposición esta semana</td>
              </tr>
              <tr>
                <td><strong>Tasa de Disponibilidad</strong></td>
                <td className="count">{tasaDisponibilidad}%</td>
                <td>Porcentaje de tiempo que los cajeros están operativos</td>
              </tr>
              <tr>
                <td><strong>Registros Procesados</strong></td>
                <td className="count">{resultsToShow.recordsProcessed.toLocaleString()}</td>
                <td>Total de registros históricos analizados</td>
              </tr>
              <tr>
                <td><strong>Fecha de Optimización</strong></td>
                <td colSpan="2">
                  {new Date(resultsToShow.optimizationDate).toLocaleString('es-ES')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="recommendations-section">
        <h4>💡 Recomendaciones de Optimización</h4>
        <ul className="recommendations-list">
          {resultsToShow.recommendations?.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* Información del Modelo LINGO */}
      <div className="executive-summary" style={{ marginTop: '20px', background: '#f0f8ff' }}>
        <h4>🔧 Información del Modelo LINGO</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div>
            <strong>Función Objetivo:</strong>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
              Minimizar costos de reposición
            </div>
          </div>
          <div>
            <strong>Restricciones:</strong>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
              Capacidad, disponibilidad, demanda
            </div>
          </div>
          <div>
            <strong>Horizonte:</strong>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
              {resultsToShow.detailedPlan?.length || 0} días
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
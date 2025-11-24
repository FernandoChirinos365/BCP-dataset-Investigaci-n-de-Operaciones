import React from 'react';
import './Metrics.css';

const KpiCards = ({ kpis }) => {
  const defaultKpis = [
    {
      title: 'Eficiencia Operativa',
      value: '87%',
      trend: '+2.5%',
      trendDirection: 'up',
      description: 'vs mes anterior'
    },
    {
      title: 'Costo Total',
      value: 'S/ 45,230',
      trend: '-5.2%',
      trendDirection: 'down',
      description: 'reducción mensual'
    },
    {
      title: 'Nivel de Servicio',
      value: '94.5%',
      trend: '+1.1%',
      trendDirection: 'up',
      description: 'sobre objetivo'
    },
    {
      title: 'Tiempo Promedio',
      value: '2.3 días',
      trend: '-0.4',
      trendDirection: 'down',
      description: 'mejora continua'
    }
  ];

  const data = kpis || defaultKpis;

  return (
    <div className="kpi-cards">
      <h3 className="kpi-title">Indicadores Clave de Performance</h3>
      <div className="kpi-grid">
        {data.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-header">
              <h4 className="kpi-name">{kpi.title}</h4>
              <span className={`kpi-trend ${kpi.trendDirection}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-description">{kpi.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KpiCards;
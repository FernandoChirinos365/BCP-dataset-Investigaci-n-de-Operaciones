import React from 'react';
import './Metrics.css';

const QuickMetrics = ({ metrics }) => {
  const defaultMetrics = {
    cajerosA: 45,
    cajerosB: 32,
    demandasAtipicas: 18,
    promedioDiario: '2,450'
  };

  const data = metrics || defaultMetrics;

  const metricCards = [
    {
      icon: '🟢',
      label: 'Cajeros Tipo A',
      value: data.cajerosA,
      unit: 'unidades',
      color: '#28a745'
    },
    {
      icon: '🟡',
      label: 'Cajeros Tipo B',
      value: data.cajerosB,
      unit: 'unidades',
      color: '#ffc107'
    },
    {
      icon: '🔴',
      label: 'Demandas atípicas',
      value: data.demandasAtipicas,
      unit: 'casos',
      color: '#dc3545'
    },
    {
      icon: '📈',
      label: 'Promedio diario demanda',
      value: `S/ ${data.promedioDiario}`,
      unit: '',
      color: '#007bff'
    }
  ];

  return (
    <div className="quick-metrics">
      <h3 className="metrics-title">Métricas Rápidas</h3>
      <div className="metrics-grid">
        {metricCards.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">{metric.icon}</span>
              <span className="metric-label">{metric.label}</span>
            </div>
            <div className="metric-value" style={{ color: metric.color }}>
              {metric.value}
            </div>
            <div className="metric-unit">{metric.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickMetrics;
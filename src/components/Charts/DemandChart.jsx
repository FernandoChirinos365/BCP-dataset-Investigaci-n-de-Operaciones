import React from 'react';
import './Charts.css';

const DemandChart = ({ data, title = "Distribución de Demandas por Tipo de Cajero" }) => {
  // Datos de ejemplo - en producción vendrían del contexto
  const chartData = data || [
    { type: 'Tipo A', demandas: 45, color: '#28a745' },
    { type: 'Tipo B', demandas: 30, color: '#ffc107' },
    { type: 'Tipo C', demandas: 25, color: '#dc3545' }
  ];

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-container">
        <div className="bar-chart">
          {chartData.map((item, index) => (
            <div key={index} className="bar-item">
              <div className="bar-label">{item.type}</div>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ 
                    height: `${(item.demandas / 100) * 200}px`,
                    backgroundColor: item.color 
                  }}
                ></div>
              </div>
              <div className="bar-value">{item.demandas}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemandChart;
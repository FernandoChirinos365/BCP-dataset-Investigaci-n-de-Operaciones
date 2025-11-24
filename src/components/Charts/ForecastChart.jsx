import React from 'react';
import './Charts.css';

const ForecastChart = ({ actualData = [], forecastData = [] }) => {
  const data = actualData.length > 0 ? actualData : [
    { day: 'Lun', actual: 120, forecast: 115 },
    { day: 'Mar', actual: 135, forecast: 130 },
    { day: 'Mié', actual: 110, forecast: 125 },
    { day: 'Jue', actual: 145, forecast: 140 },
    { day: 'Vie', actual: 160, forecast: 155 },
    { day: 'Sáb', actual: 130, forecast: 135 },
    { day: 'Dom', actual: 100, forecast: 105 }
  ];

  const maxValue = Math.max(...data.flatMap(d => [d.actual, d.forecast]));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Pronóstico de Demanda</h3>
      <div className="chart-container">
        <div className="line-chart">
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color actual"></span>
              Actual
            </div>
            <div className="legend-item">
              <span className="legend-color forecast"></span>
              Pronóstico
            </div>
          </div>
          
          <div className="chart-area">
            {data.map((item, index) => (
              <div key={index} className="chart-point">
                <div 
                  className="line actual-line" 
                  style={{ height: `${(item.actual / maxValue) * 150}px` }}
                ></div>
                <div 
                  className="line forecast-line" 
                  style={{ height: `${(item.forecast / maxValue) * 150}px` }}
                ></div>
                <div className="point-label">{item.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;
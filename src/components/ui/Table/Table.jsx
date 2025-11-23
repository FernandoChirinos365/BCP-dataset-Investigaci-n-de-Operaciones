import React from 'react';
import './Table.css';

const Table = ({ data, headers, className = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        No hay datos para mostrar
      </div>
    );
  }

  const tableHeaders = headers || Object.keys(data[0] || {});

  return (
    <div className={`table-container ${className}`}>
      <table className="table">
        <thead className="table-header">
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index} className="table-header-cell">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row">
              {tableHeaders.map((header, cellIndex) => (
                <td key={cellIndex} className="table-cell">
                  {row[header] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
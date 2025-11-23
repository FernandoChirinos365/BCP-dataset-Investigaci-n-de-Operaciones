import React from "react";
import "./DataTable.css";

const DataTable = ({ data, headers }) => {
  if (!data || data.length === 0) {
    return <p className="no-data">No hay datos para mostrar.</p>;
  }

  return (
    <div className="datatable-container">
      <table className="datatable">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>
                  {row[header] !== undefined ? row[header] : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

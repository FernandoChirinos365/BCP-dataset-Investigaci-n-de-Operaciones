import React from "react";
import "./Results.css";
import { useData } from "../../../context/DataContext";

export default function Results() {
  const { excelData } = useData();

  if (!excelData || excelData.length === 0) {
    return (
      <div className="results-card">
        <h3>Resultados</h3>
        <p>No hay datos cargados aún.</p>
      </div>
    );
  }

  return (
    <div className="results-card">
      <h3>Resultados de Optimización</h3>

      <div className="result-box">
        <p><strong>Registros procesados:</strong> {excelData.length}</p>
        <p>Una vez se implemente la lógica de optimización, aquí aparecerán tus resultados.</p>
      </div>
    </div>
  );
}

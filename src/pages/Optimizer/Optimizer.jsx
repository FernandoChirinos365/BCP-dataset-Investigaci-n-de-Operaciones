import React from "react";
import InputPanel from "../../components/optimizer/InputPanel/InputPanel.jsx";
import Results from "../../components/optimizer/Results/Results";
import "./Optimizer.css";

export default function Optimizer() {
  return (
    <div className="optimizer-page">
      <div className="optimizer-header">
        <h1>Optimización - Gestión de Efectivo (BCP)</h1>
        <p>Sube/usa tu dataset y obtén el plan semanal óptimo.</p>
      </div>

      <div className="optimizer-grid">
        <InputPanel />
        <Results />
      </div>
    </div>
  );
}

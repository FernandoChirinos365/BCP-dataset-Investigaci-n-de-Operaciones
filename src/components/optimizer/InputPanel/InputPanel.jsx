import React, { useState } from "react";
import "./InputPanel.css";
import OptimizeButton from "../OptimizeButton";
import { useData } from "../../../context/DataContext";

export default function InputPanel() {
  const { excelData } = useData();

  const [horizonDays, setHorizonDays] = useState(7);
  const [minStockRatio, setMinStockRatio] = useState(0.20);
  const [costA, setCostA] = useState(0.001);
  const [costB, setCostB] = useState(0.0015);

  return (
    <div className="input-panel card">
      <h3>Datos de Entrada</h3>
      <p>Registros cargados: <strong>{excelData?.length ?? 0}</strong></p>

      <div className="param-row">
        <label>Horizonte (días)</label>
        <input
          type="number"
          min="1"
          max="14"
          value={horizonDays}
          onChange={(e) => setHorizonDays(Number(e.target.value))}
        />
      </div>

      <div className="param-row">
        <label>Nivel de seguridad (ratio)</label>
        <input
          type="number"
          step="0.05"
          min="0"
          max="0.5"
          value={minStockRatio}
          onChange={(e) => setMinStockRatio(parseFloat(e.target.value))}
        />
      </div>

      <div className="param-row small">
        <label>Costo Tipo A (%)</label>
        <input
          type="number"
          step="0.0001"
          value={costA}
          onChange={(e) => setCostA(parseFloat(e.target.value))}
        />

        <label>Costo Tipo B (%)</label>
        <input
          type="number"
          step="0.0001"
          value={costB}
          onChange={(e) => setCostB(parseFloat(e.target.value))}
        />
      </div>

      <div style={{ marginTop: 14 }}>
        <OptimizeButton
          params={{ horizonDays, minStockRatio, costA, costB }}
        />
      </div>
    </div>
  );
}

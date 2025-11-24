import React, { useState } from "react";
import "./InputPanel.css";
import { useData } from "../../../context/DataContext";
import Button from "../../ui/Button/Button";

export default function InputPanel() {
  const { excelData, setOptimizationResults } = useData();
  const [horizonDays, setHorizonDays] = useState(7);
  const [minStockRatio, setMinStockRatio] = useState(0.20);
  const [costA, setCostA] = useState(0.001);
  const [costB, setCostB] = useState(0.0015);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunOptimization = async () => {
    if (!excelData || excelData.length === 0) {
      alert('❌ Por favor, carga un dataset primero');
      return;
    }

    setIsLoading(true);

    try {
      // Simular proceso de optimización (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generar resultados simulados basados en tus datos
      const mockResults = {
        recordsProcessed: excelData.length,
        totalCost: 15420.50,
        costReduction: 12.5,
        serviceLevel: 98.2,
        weeklyPlan: [
          { day: 'Lunes', typeA: 3, typeB: 2, amount: 450000 },
          { day: 'Martes', typeA: 2, typeB: 1, amount: 280000 },
          { day: 'Miércoles', typeA: 4, typeB: 3, amount: 620000 },
          { day: 'Jueves', typeA: 3, typeB: 2, amount: 410000 },
          { day: 'Viernes', typeA: 5, typeB: 4, amount: 780000 },
          { day: 'Sábado', typeA: 2, typeB: 1, amount: 220000 },
          { day: 'Domingo', typeA: 1, typeB: 1, amount: 150000 }
        ],
        recommendations: [
          'Aumentar reposición los viernes en un 15%',
          'Reducir inventario en cajeros Tipo B los domingos',
          'Optimizar rutas de recarga para ahorrar costos de transporte'
        ],
        parameters: {
          horizon: horizonDays,
          securityLevel: minStockRatio,
          costTypeA: costA,
          costTypeB: costB
        }
      };

      // Guardar resultados en el contexto
      setOptimizationResults(mockResults);
      
    } catch (error) {
      console.error('Error en optimización:', error);
      alert('❌ Error al ejecutar la optimización');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="input-panel card">
      <h3>Datos de Entrada</h3>
      
      <div className="input-group">
        <label>Registros cargados:</label>
        <div className="value-display">
          <strong>{excelData?.length.toLocaleString() ?? '0'}</strong>
        </div>
      </div>

      <div className="input-group">
        <label>Horizonte (días)</label>
        <input
          type="number"
          min="1"
          max="30"
          value={horizonDays}
          onChange={(e) => setHorizonDays(Number(e.target.value))}
          disabled={isLoading}
        />
      </div>

      <div className="input-group">
        <label>Nivel de seguridad (ratio)</label>
        <input
          type="number"
          step="0.05"
          min="0.1"
          max="0.5"
          value={minStockRatio}
          onChange={(e) => setMinStockRatio(parseFloat(e.target.value))}
          disabled={isLoading}
        />
      </div>

      <div className="costs-row">
        <div className="input-group small">
          <label>Costo Tipo A (%)</label>
          <input
            type="number"
            step="0.0001"
            value={costA}
            onChange={(e) => setCostA(parseFloat(e.target.value))}
            disabled={isLoading}
          />
        </div>

        <div className="input-group small">
          <label>Costo Tipo B (%)</label>
          <input
            type="number"
            step="0.0001"
            value={costB}
            onChange={(e) => setCostB(parseFloat(e.target.value))}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="optimization-actions">
        <Button
          onClick={handleRunOptimization}
          variant="primary"
          disabled={isLoading || !excelData}
          className="optimize-btn"
        >
          {isLoading ? (
            <>
              <span className="loading-spinner-small"></span>
              Optimizando...
            </>
          ) : (
            '🚀 Obtener Optimización'
          )}
        </Button>

        {!excelData && (
          <span className="warning-text">
            ⚠️ Debes cargar un dataset primero
          </span>
        )}
      </div>
    </div>
  );
}
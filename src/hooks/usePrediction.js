import { useState, useCallback } from 'react';
import { predictionService } from '../services/predictionService';

export const usePrediction = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateForecast = useCallback(async (data, config) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validar datos antes de procesar
      const validation = predictionService.validateDataForPrediction(data);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
      
      const result = await predictionService.generateForecast(data, config);
      setPredictions(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPredictions = useCallback(() => {
    setPredictions(null);
    setError(null);
  }, []);

  const exportPredictions = useCallback(async (format = 'excel') => {
    if (!predictions) {
      throw new Error('No hay predicciones para exportar');
    }
    
    try {
      // En una implementación real, esto llamaría al servicio de reportes
      const blob = new Blob([
        JSON.stringify(predictions, null, 2)
      ], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `predicciones_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (err) {
      throw new Error(`Error al exportar: ${err.message}`);
    }
  }, [predictions]);

  return {
    // Estado
    predictions,
    loading,
    error,
    
    // Acciones
    generateForecast,
    clearPredictions,
    exportPredictions,
    
    // Utilidades
    hasPredictions: !!predictions,
    modelInfo: predictions?.modelInfo,
    accuracy: predictions?.accuracy,
    alerts: predictions?.alerts
  };
};
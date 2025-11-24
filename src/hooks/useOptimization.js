import { useState, useCallback } from 'react';
import { optimizationService } from '../services/optimizationService';

export const useOptimization = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runOptimization = useCallback(async (data, parameters) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validar parámetros
      const validation = optimizationService.validateOptimizationParameters(parameters);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      const result = await optimizationService.runOptimization(data, parameters);
      setResults(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  const calculateSavings = useCallback((scenario) => {
    if (!results || !scenario) return 0;
    
    const baseCost = results.comparison?.currentCost || 45230;
    const scenarioCost = scenario.cost || scenario.totalCost;
    
    return ((baseCost - scenarioCost) / baseCost) * 100;
  }, [results]);

  const getOptimalPlan = useCallback(() => {
    if (!results) return null;
    
    return results.weeklyPlan.reduce((optimal, dayPlan) => {
      if (!optimal || dayPlan.serviceLevel > optimal.serviceLevel) {
        return dayPlan;
      }
      return optimal;
    }, null);
  }, [results]);

  return {
    // Estado
    results,
    loading,
    error,
    
    // Acciones
    runOptimization,
    clearResults,
    
    // Utilidades
    hasResults: !!results,
    savings: results?.comparison?.savings,
    serviceLevel: results?.avgServiceLevel,
    calculateSavings,
    getOptimalPlan,
    
    // Datos derivados
    weeklyPlan: results?.weeklyPlan || [],
    totalCost: results?.totalCost,
    parameters: results?.parameters
  };
};
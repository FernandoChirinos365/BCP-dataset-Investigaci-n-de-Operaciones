import { useState, useCallback } from 'react';

export const useSimulation = () => {
  const [scenarios, setScenarios] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Métodos auxiliares definidos como funciones dentro del hook
  const getScenarioDescription = (scenario, variation) => {
    if (variation > 0) {
      return `Escenario con incremento del ${Math.abs(variation * 100)}% en demanda`;
    } else if (variation < 0) {
      return `Escenario con reducción del ${Math.abs(variation * 100)}% en demanda`;
    }
    return 'Escenario base de referencia';
  };

  const generateScenarioRecommendations = (scenarios) => {
    const recommendations = [];
    
    const worstCase = scenarios.find(s => s.variation === Math.max(...scenarios.map(sc => sc.variation)));
    const bestCase = scenarios.find(s => s.variation === Math.min(...scenarios.map(sc => sc.variation)));
    
    if (worstCase && worstCase.variation > 0) {
      recommendations.push({
        priority: 'high',
        text: `Preparar contingencia para escenario ${worstCase.label} (${worstCase.variation}% variación)`,
        scenario: worstCase.label
      });
    }
    
    if (bestCase && bestCase.variation < 0) {
      recommendations.push({
        priority: 'medium', 
        text: `Aprovechar eficiencias del escenario ${bestCase.label} para optimización`,
        scenario: bestCase.label
      });
    }
    
    // Recomendación general
    recommendations.push({
      priority: 'low',
      text: 'Mantener monitoreo continuo de indicadores clave',
      scenario: 'Todos'
    });
    
    return recommendations;
  };

  const runSimulation = useCallback(async (baseData, scenariosConfig, baseResults) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calcular resultados para cada escenario
      const simulatedScenarios = scenariosConfig.map(scenario => {
        const baseCost = baseResults?.totalCost || 45230;
        const baseService = baseResults?.avgServiceLevel || 94.5;
        
        const variation = scenario.variation / 100;
        const cost = Math.round(baseCost * (1 + variation));
        const serviceLevel = Math.max(
          85, 
          Math.min(99, baseService - (variation * 30 * (variation > 0 ? 1 : 0.5)))
        );
        
        return {
          ...scenario,
          cost,
          serviceLevel: Math.round(serviceLevel * 10) / 10,
          impact: Math.abs(variation * 100),
          description: getScenarioDescription(scenario, variation)
        };
      });
      
      const results = {
        scenarios: simulatedScenarios,
        comparison: {
          baseCost: baseResults?.totalCost || 45230,
          bestCase: Math.min(...simulatedScenarios.map(s => s.cost)),
          worstCase: Math.max(...simulatedScenarios.map(s => s.cost)),
          savings: Math.round(
            (1 - Math.min(...simulatedScenarios.map(s => s.cost)) / (baseResults?.totalCost || 45230)) * 100 * 10
          ) / 10
        },
        recommendations: generateScenarioRecommendations(simulatedScenarios)
      };
      
      setScenarios(results);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearScenarios = useCallback(() => {
    setScenarios(null);
    setError(null);
  }, []);

  return {
    // Estado
    scenarios,
    loading, 
    error,
    
    // Acciones
    runSimulation,
    clearScenarios,
    
    // Utilidades
    hasScenarios: !!scenarios,
    bestScenario: scenarios?.scenarios?.find(s => s.cost === scenarios.comparison?.bestCase),
    worstScenario: scenarios?.scenarios?.find(s => s.cost === scenarios.comparison?.worstCase),
    recommendations: scenarios?.recommendations || []
  };
};
// Servicio para optimización de rutas y costos
export const optimizationService = {
  
  // Ejecutar optimización principal
  async runOptimization(data, parameters) {
    const { costA, costB, securityLevel, capacity, allowedDays } = parameters;
    
    // Simular procesamiento de optimización
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const baseData = this.prepareOptimizationData(data, parameters);
    const optimizationResult = this.calculateOptimalPlan(baseData, parameters);
    const comparison = this.compareWithCurrentMethod(optimizationResult, data);
    
    return {
      ...optimizationResult,
      comparison,
      parameters,
      timestamp: new Date().toISOString()
    };
  },

  // Preparar datos para optimización
  prepareOptimizationData(data, parameters) {
    // Agrupar datos por cajero y día
    const groupedData = data.reduce((acc, item) => {
      const atmId = item.cajero || item.id;
      const date = new Date(item.fecha);
      const dayKey = date.toDateString();
      
      if (!acc[atmId]) {
        acc[atmId] = {
          id: atmId,
          type: item.tipoCajero || 'A',
          dailyData: {}
        };
      }
      
      if (!acc[atmId].dailyData[dayKey]) {
        acc[atmId].dailyData[dayKey] = {
          date,
          demand: 0,
          transactions: 0
        };
      }
      
      acc[atmId].dailyData[dayKey].demand += item.demanda || item.monto || 0;
      acc[atmId].dailyData[dayKey].transactions += 1;
      
      return acc;
    }, {});
    
    return Object.values(groupedData);
  },

  // Calcular plan óptimo usando algoritmo simplificado
  calculateOptimalPlan(data, parameters) {
    const { costA, costB, securityLevel, capacity, allowedDays } = parameters;
    
    const weeklyPlan = [];
    let totalCost = 0;
    let totalServiceLevel = 0;
    
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    days.forEach(day => {
      const dayPlan = {
        day,
        atms: [],
        dailyCost: 0,
        serviceLevel: 0
      };
      
      // Solo optimizar días permitidos
      if (allowedDays && !allowedDays.includes(day)) {
        weeklyPlan.push(dayPlan);
        return;
      }
      
      data.forEach(atm => {
        const avgDemand = this.calculateATMAverageDemand(atm);
        const safetyStock = avgDemand * (securityLevel / 100);
        const optimalSupply = Math.min(
          avgDemand + safetyStock,
          capacity === 'auto' ? avgDemand * 2 : capacity
        );
        
        const costPerATM = atm.type === 'A' ? costA : costB;
        const atmCost = optimalSupply * (costPerATM / 100);
        
        dayPlan.atms.push({
          id: atm.id,
          type: atm.type,
          demand: Math.round(avgDemand),
          supply: Math.round(optimalSupply),
          cost: Math.round(atmCost * 100) / 100,
          serviceLevel: this.calculateServiceLevel(optimalSupply, avgDemand)
        });
        
        dayPlan.dailyCost += atmCost;
        dayPlan.serviceLevel += this.calculateServiceLevel(optimalSupply, avgDemand);
      });
      
      dayPlan.dailyCost = Math.round(dayPlan.dailyCost * 100) / 100;
      dayPlan.serviceLevel = dayPlan.serviceLevel / dayPlan.atms.length;
      totalCost += dayPlan.dailyCost;
      totalServiceLevel += dayPlan.serviceLevel;
      
      weeklyPlan.push(dayPlan);
    });
    
    return {
      weeklyPlan,
      totalCost: Math.round(totalCost * 100) / 100,
      avgServiceLevel: Math.round((totalServiceLevel / days.length) * 100) / 100,
      totalATMs: data.length,
      optimizationDate: new Date().toISOString()
    };
  },

  // Calcular demanda promedio por cajero
  calculateATMAverageDemand(atm) {
    const demands = Object.values(atm.dailyData).map(day => day.demand);
    return demands.reduce((sum, demand) => sum + demand, 0) / demands.length;
  },

  // Calcular nivel de servicio basado en oferta vs demanda
  calculateServiceLevel(supply, demand) {
    if (supply >= demand) return 1.0;
    return supply / demand;
  },

  // Comparar con método actual
  compareWithCurrentMethod(optimized, historicalData) {
    const currentCost = this.estimateCurrentCost(historicalData);
    const savings = ((currentCost - optimized.totalCost) / currentCost) * 100;
    
    return {
      currentCost: Math.round(currentCost * 100) / 100,
      optimizedCost: optimized.totalCost,
      savings: Math.round(savings * 100) / 100,
      improvement: Math.round((optimized.avgServiceLevel - 0.85) * 100) / 100 // Asumiendo 85% base
    };
  },

  // Estimar costo actual basado en datos históricos
  estimateCurrentCost(data) {
    // Simular cálculo de costo actual
    const baseCost = data.length * 150; // Costo base por cajero
    const variableCost = data.reduce((sum, item) => {
      return sum + (item.demanda || item.monto || 0) * 0.001; // 0.1% del monto
    }, 0);
    
    return baseCost + variableCost;
  },

  // Validar parámetros de optimización
  validateOptimizationParameters(parameters) {
    const { costA, costB, securityLevel, capacity } = parameters;
    const errors = [];
    
    if (costA < 0.05 || costA > 0.2) {
      errors.push('Costo Tipo A debe estar entre 0.05% y 0.2%');
    }
    
    if (costB < 0.1 || costB > 0.25) {
      errors.push('Costo Tipo B debe estar entre 0.1% y 0.25%');
    }
    
    if (securityLevel < 10 || securityLevel > 40) {
      errors.push('Nivel de seguridad debe estar entre 10% y 40%');
    }
    
    if (capacity !== 'auto' && (capacity < 500 || capacity > 10000)) {
      errors.push('Capacidad debe ser "auto" o estar entre 500 y 10000');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
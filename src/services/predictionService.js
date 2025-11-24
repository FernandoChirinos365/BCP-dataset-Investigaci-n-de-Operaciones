import { format, addDays } from 'date-fns';

// Servicio para predicciones y modelos de machine learning
export const predictionService = {
  
  // Generar pronóstico usando diferentes modelos
  async generateForecast(data, config) {
    const { horizon = 7, model = 'arima', selectedAtms = 'all' } = config;
    
    // Simular procesamiento de ML
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Filtrar datos por tipo de cajero si es necesario
    const filteredData = this.filterDataByATMType(data, selectedAtms);
    
    let forecast;
    switch (model) {
      case 'arima':
        forecast = this.generateARIMAForecast(filteredData, horizon);
        break;
      case 'prophet':
        forecast = this.generateProphetForecast(filteredData, horizon);
        break;
      case 'neural':
        forecast = this.generateNeuralForecast(filteredData, horizon);
        break;
      default:
        forecast = this.generateEnsembleForecast(filteredData, horizon);
    }
    
    return {
      forecast,
      accuracy: this.calculateAccuracy(forecast),
      alerts: this.generateAlerts(forecast),
      modelInfo: {
        name: model,
        horizon,
        trainedOn: `${filteredData.length} registros`,
        timestamp: new Date().toISOString()
      }
    };
  },

  // Filtrar datos por tipo de cajero
  filterDataByATMType(data, atmType) {
    if (atmType === 'all') return data;
    if (atmType === 'typeA') return data.filter(item => item.tipoCajero === 'A');
    if (atmType === 'typeB') return data.filter(item => item.tipoCajero === 'B');
    return data;
  },

  // Simulación de modelo ARIMA
  generateARIMAForecast(data, horizon) {
    const lastDate = data[data.length - 1]?.fecha || new Date();
    const baseDemand = this.calculateBaseDemand(data);
    
    return Array.from({ length: horizon }, (_, i) => {
      const day = addDays(new Date(lastDate), i + 1);
      const dayOfWeek = format(day, 'EEE');
      const seasonalFactor = this.getSeasonalFactor(dayOfWeek);
      const trendFactor = 1 + (i * 0.02); // Tendencia creciente del 2% por día
      const noise = (Math.random() * 0.1) - 0.05; // Ruido ±5%
      
      const forecastValue = Math.round(baseDemand * seasonalFactor * trendFactor * (1 + noise));
      const confidenceLower = Math.round(forecastValue * 0.9);
      const confidenceUpper = Math.round(forecastValue * 1.1);
      
      return {
        date: day,
        day: this.getSpanishDay(dayOfWeek),
        actual: null, // En predicción futura no hay actual
        forecast: forecastValue,
        confidence: [confidenceLower, confidenceUpper],
        isFuture: true
      };
    });
  },

  // Simulación de modelo Prophet
  generateProphetForecast(data, horizon) {
    // Implementación simplificada similar a ARIMA pero con diferentes parámetros
    return this.generateARIMAForecast(data, horizon).map(item => ({
      ...item,
      forecast: Math.round(item.forecast * 1.02) // Prophet tiende a ser más conservador
    }));
  },

  // Simulación de Red Neuronal
  generateNeuralForecast(data, horizon) {
    const forecast = this.generateARIMAForecast(data, horizon);
    // Red neuronal podría detectar patrones más complejos
    return forecast.map((item, index) => ({
      ...item,
      forecast: index > 3 ? Math.round(item.forecast * 1.05) : item.forecast // Detecta aumento a futuro
    }));
  },

  // Modelo Ensemble (combinación)
  generateEnsembleForecast(data, horizon) {
    const arima = this.generateARIMAForecast(data, horizon);
    const prophet = this.generateProphetForecast(data, horizon);
    const neural = this.generateNeuralForecast(data, horizon);
    
    return arima.map((item, index) => ({
      ...item,
      forecast: Math.round((arima[index].forecast + prophet[index].forecast + neural[index].forecast) / 3),
      confidence: [
        Math.round(Math.min(arima[index].confidence[0], prophet[index].confidence[0], neural[index].confidence[0])),
        Math.round(Math.max(arima[index].confidence[1], prophet[index].confidence[1], neural[index].confidence[1]))
      ]
    }));
  },

  // Calcular demanda base histórica
  calculateBaseDemand(data) {
    if (!data || data.length === 0) return 1000;
    
    const demands = data.map(item => item.demanda || item.monto || 1000);
    return demands.reduce((sum, demand) => sum + demand, 0) / demands.length;
  },

  // Factores estacionales por día de la semana
  getSeasonalFactor(dayOfWeek) {
    const factors = {
      'Mon': 1.1,  // Lunes: +10%
      'Tue': 1.05, // Martes: +5%
      'Wed': 1.0,  // Miércoles: normal
      'Thu': 1.15, // Jueves: +15%
      'Fri': 1.25, // Viernes: +25%
      'Sat': 0.9,  // Sábado: -10%
      'Sun': 0.8   // Domingo: -20%
    };
    return factors[dayOfWeek] || 1.0;
  },

  // Convertir día en inglés a español
  getSpanishDay(englishDay) {
    const days = {
      'Mon': 'Lun', 'Tue': 'Mar', 'Wed': 'Mié',
      'Thu': 'Jue', 'Fri': 'Vie', 'Sat': 'Sáb', 'Sun': 'Dom'
    };
    return days[englishDay] || englishDay;
  },

  // Calcular métricas de precisión (simuladas)
  calculateAccuracy(forecast) {
    // En un escenario real, esto compararía con datos reales
    return {
      mape: 8.5 + (Math.random() * 4 - 2), // MAPE entre 6.5% y 10.5%
      rmse: 12.3 + (Math.random() * 6 - 3), // RMSE entre 9.3 y 15.3
      mae: 9.1 + (Math.random() * 4 - 2),   // MAE entre 7.1 y 11.1
      r2: 0.89 + (Math.random() * 0.08 - 0.04) // R² entre 0.85 y 0.93
    };
  },

  // Generar alertas basadas en el pronóstico
  generateAlerts(forecast) {
    const alerts = [];
    const highDemandThreshold = 1500;
    const spikeThreshold = 1.3; // 30% sobre el promedio
    
    const avgDemand = forecast.reduce((sum, day) => sum + day.forecast, 0) / forecast.length;
    
    forecast.forEach(day => {
      if (day.forecast > highDemandThreshold) {
        alerts.push({
          type: 'warning',
          message: `Alta demanda esperada para el ${day.day} (S/ ${day.forecast.toLocaleString()})`,
          impact: 'high',
          day: day.day
        });
      }
      
      if (day.forecast > avgDemand * spikeThreshold) {
        alerts.push({
          type: 'info', 
          message: `Pico de demanda detectado para el ${day.day} (+${Math.round((day.forecast/avgDemand - 1) * 100)}% vs promedio)`,
          impact: 'medium',
          day: day.day
        });
      }
    });
    
    return alerts.slice(0, 3); // Limitar a 3 alertas
  },

  // Validar datos para predicción
  validateDataForPrediction(data) {
    if (!data || data.length === 0) {
      return { isValid: false, error: 'No hay datos disponibles' };
    }
    
    const requiredFields = ['fecha', 'demanda'];
    const missingFields = requiredFields.filter(field => 
      !data[0].hasOwnProperty(field)
    );
    
    if (missingFields.length > 0) {
      return { 
        isValid: false, 
        error: `Campos requeridos faltantes: ${missingFields.join(', ')}` 
      };
    }
    
    // Verificar que haya suficientes datos históricos
    const minDataPoints = 30;
    if (data.length < minDataPoints) {
      return {
        isValid: false,
        error: `Se requieren al menos ${minDataPoints} puntos de datos históricos`
      };
    }
    
    return { isValid: true };
  }
};
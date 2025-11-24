import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Estados para datos principales
  const [excelData, setExcelData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  
  // Estados para análisis y resultados
  const [predictions, setPredictions] = useState(null);
  const [optimizationResults, setOptimizationResults] = useState(null); // ← CORREGIDO
  const [simulationScenarios, setSimulationScenarios] = useState(null);
  const [sensitivityAnalysis, setSensitivityAnalysis] = useState(null);
  
  // Estados para configuración
  const [selectedAtmTypes, setSelectedAtmTypes] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [modelParameters, setModelParameters] = useState({
    costA: 0.1,
    costB: 0.15,
    securityLevel: 20,
    capacity: 'auto'
  });

  // Funciones de utilidad
  const clearAllData = () => {
    setExcelData(null);
    setPredictions(null);
    setOptimizationResults(null); // ← CORREGIDO
    setSimulationScenarios(null);
    setSensitivityAnalysis(null);
    setCurrentFile(null);
  };

  const value = {
    // Datos principales
    excelData,
    setExcelData,
    headers,
    setHeaders,
    currentFile,
    setCurrentFile,
    
    // Resultados de análisis
    predictions,
    setPredictions,
    optimizationResults, // ← CORREGIDO
    setOptimizationResults, // ← CORREGIDO
    simulationScenarios,
    setSimulationScenarios,
    sensitivityAnalysis,
    setSensitivityAnalysis,
    
    // Configuración
    selectedAtmTypes,
    setSelectedAtmTypes,
    dateRange,
    setDateRange,
    modelParameters,
    setModelParameters,
    
    // Utilidades
    clearAllData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
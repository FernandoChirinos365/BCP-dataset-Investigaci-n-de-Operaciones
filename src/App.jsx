import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { DataProvider } from "./context/DataContext";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import Header from "./components/layout/Header/Header";

// Páginas existentes
import Dashboard from "./pages/Dashboard/Dashboard";
import DataView from "./pages/DataView/DataView";
import Upload from "./pages/Upload/Upload";
import Optimizer from "./pages/Optimizer/Optimizer";

// Nuevas páginas
import Prediction from "./pages/Prediction/Prediction";
import Simulation from "./pages/Simulation/Simulation";
import Sensitivity from "./pages/Sensitivity/Sensitivity";
import Reports from "./pages/Reports/Reports";

// ELIMINA ESTA LÍNEA:
// import Analysis from "./pages/Analysis/Analysis";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <div className="app-container">
          <Sidebar />
          
          <div className="main-content">
            <Header />
            
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* RUTAS PARA DATOS */}
                <Route path="/data-view" element={<DataView />} />
                <Route path="/analysis" element={<DataView />} /> {/* 📊 Usa DataView para analysis */}
                
                <Route path="/upload" element={<Upload />} />
                <Route path="/optimizer" element={<Optimizer />} />
                
                {/* Nuevas rutas */}
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/sensitivity" element={<Sensitivity />} />
                <Route path="/reports" element={<Reports />} />
                
                {/* Ruta de fallback */}
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </div>
      </DataProvider>
    </BrowserRouter>
  );
}
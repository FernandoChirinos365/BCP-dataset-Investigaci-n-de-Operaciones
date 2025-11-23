import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { DataProvider } from "./context/DataContext";
import Sidebar from "./components/layout/Sidebar/Sidebar";

// Páginas
import Dashboard from "./pages/Dashboard/Dashboard";
import DataView from "./pages/DataView/DataView";
import Upload from "./pages/Upload/Upload";
import Optimizer from "./pages/Optimizer/Optimizer";

import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <BrowserRouter>
      <DataProvider>
        <div className="app-container">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dataview" element={<DataView />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/optimizer" element={<Optimizer />} />
            </Routes>
          </div>
        </div>
      </DataProvider>
    </BrowserRouter>
  );
}
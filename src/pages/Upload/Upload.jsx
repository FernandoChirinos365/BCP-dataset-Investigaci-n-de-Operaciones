import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useExcelData } from '../../hooks/useExcelData';
import FileUpload from '../../components/data/FileUpload/FileUpload';
import Button from '../../components/ui/Button/Button';
import { validateFile } from '../../utils/helpers';
import './Upload.css';

const Upload = () => {
  const { setExcelData, setHeaders, setCurrentFile } = useData();
  const { loadExcelData, loading, error } = useExcelData();
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = async (file) => {
    try {
      validateFile(file);
      
      const result = await loadExcelData(file);
      
      setExcelData(result.data);
      setHeaders(result.headers);
      setCurrentFile(file.name);
      setUploadSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
      
    } catch (err) {
      console.error('Error uploading file:', err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="upload-page">
      <div className="page-header">
        <h1>Subir Archivo Excel</h1>
        <p>Carga tu dataset en formato Excel para visualizar y analizar los datos</p>
      </div>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {uploadSuccess && (
        <div className="alert alert-success">
          ✅ Archivo procesado correctamente
        </div>
      )}

      <div className="upload-section">
        <FileUpload 
          onFileUpload={handleFileUpload}
          loading={loading}
        />
      </div>

      <div className="upload-features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>Visualización Completa</h4>
            <p>Ve todos tus datos en tablas organizadas y fáciles de leer</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h4>Búsqueda Avanzada</h4>
            <p>Encuentra rápidamente la información que necesitas</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📥</div>
            <h4>Exportación</h4>
            <p>Descarga tus datos procesados en formato Excel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
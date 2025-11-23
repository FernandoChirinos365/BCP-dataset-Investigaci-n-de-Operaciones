import React, { useRef } from "react";
import "./FileUpload.css";

const FileUpload = ({ onFileUpload, loading }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <button 
        className="upload-button"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Procesando..." : "📤 Seleccionar archivo"}
      </button>

      <p className="upload-hint">
        Archivos permitidos: .xlsx, .xls, .csv
      </p>
    </div>
  );
};

export default FileUpload;

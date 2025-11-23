import React, { useState } from "react";
import "./Filters.css";

const Filters = ({ headers, onFilter }) => {
  const [column, setColumn] = useState("");
  const [query, setQuery] = useState("");

  const handleFilter = () => {
    onFilter({ column, query });
  };

  return (
    <div className="filters-container">
      <select
        className="filter-select"
        value={column}
        onChange={(e) => setColumn(e.target.value)}
      >
        <option value="">Seleccionar columna</option>
        {headers.map((head, index) => (
          <option key={index} value={head}>
            {head}
          </option>
        ))}
      </select>

      <input
        className="filter-input"
        type="text"
        placeholder="Valor a buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button className="filter-button" onClick={handleFilter}>
        🔍 Filtrar
      </button>
    </div>
  );
};

export default Filters;

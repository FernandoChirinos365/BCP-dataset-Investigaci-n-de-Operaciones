import { useState } from 'react';
import { readExcelFile } from '../services/excelParser';

export const useExcelData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadExcelData = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await readExcelFile(file);
      setData(result.data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    loadExcelData,
    setData
  };
};
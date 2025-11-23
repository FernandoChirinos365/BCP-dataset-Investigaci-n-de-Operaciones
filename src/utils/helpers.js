export const formatNumber = (num) => {
  if (typeof num !== 'number') return num;
  return new Intl.NumberFormat('es-ES').format(num);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-ES');
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateFile = (file) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Solo se permiten archivos Excel (.xlsx, .xls)');
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    throw new Error('El archivo no puede ser mayor a 10MB');
  }
  
  return true;
};
/**
 * Formata um número para notação compacta (ex: 1.000 -> 1K, 1.000.000 -> 1M)
 * @param {number} value - O valor a ser formatado
 * @returns {string} - O valor formatado
 */
export const formatCompact = (value) => {
  if (value === undefined || value === null) return '0';
  
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
};

export const formatCurrency = (value) => {
  return value?.toLocaleString('pt-BR') || '0';
};

export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ').substr(0, 19);
};

export const formatCVV = (value) => {
  return value.replace(/\D/g, '').substr(0, 4);
};

export const formatTwoDigits = (value) => {
  return value.replace(/\D/g, '').substr(0, 2);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatPhone = (value) => {
  if (!value.startsWith('+57')) {
    return '+57' + value.replace(/\D/g, '');
  }
  return value;
};

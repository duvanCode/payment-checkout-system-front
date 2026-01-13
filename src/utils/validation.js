export const detectCardType = (number) => {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  return null;
};

export const validateCardNumber = (number) => {
  const cleaned = number.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export const validateEmail = (email) => {
  // Regex más estricta que valida:
  // - Parte local (antes del @): letras, números, puntos, guiones, guiones bajos
  // - Dominio: letras, números, guiones
  // - TLD (extensión): al menos 2 letras, sin números ni caracteres especiales
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  // Validaciones adicionales
  const [localPart, domain] = email.split('@');

  // La parte local no debe comenzar o terminar con punto
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }

  // No debe tener puntos consecutivos
  if (localPart.includes('..') || domain.includes('..')) {
    return false;
  }

  // El dominio no debe comenzar o terminar con guión o punto
  if (domain.startsWith('-') || domain.endsWith('-') ||
      domain.startsWith('.') || domain.endsWith('.')) {
    return false;
  }

  // La extensión no debe terminar con punto
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || /[^a-zA-Z]/.test(tld)) {
    return false;
  }

  return true;
};

export const validateExpirationMonth = (month) => {
  return /^(0[1-9]|1[0-2])$/.test(month);
};

export const validateExpirationYear = (year) => {
  return /^\d{2}$/.test(year);
};

export const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

export const validatePaymentForm = (formData) => {
  const errors = {};
  
  if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
    errors.cardNumber = 'Número de tarjeta inválido';
  }
  if (!formData.cardHolderName || formData.cardHolderName.length < 3) {
    errors.cardHolderName = 'Nombre requerido';
  }
  if (!validateExpirationMonth(formData.expirationMonth)) {
    errors.expirationMonth = 'Mes inválido';
  }
  if (!validateExpirationYear(formData.expirationYear)) {
    errors.expirationYear = 'Año inválido';
  }
  if (!validateCVV(formData.cvv)) {
    errors.cvv = 'CVV inválido';
  }
  if (!validateEmail(formData.customerEmail)) {
    errors.customerEmail = 'Email inválido';
  }
  if (!formData.customerFullName) {
    errors.customerFullName = 'Nombre completo requerido';
  }
  if (!formData.deliveryAddress || formData.deliveryAddress.length < 10) {
    errors.deliveryAddress = 'Dirección debe tener al menos 10 caracteres';
  }
  if (!formData.deliveryCity) {
    errors.deliveryCity = 'Ciudad requerida';
  }
  if (!formData.deliveryDepartment) {
    errors.deliveryDepartment = 'Departamento requerido';
  }
  
  return errors;
};

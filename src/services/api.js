import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
const Url = process.env.REACT_APP_SERVICE_URL;
const PublicKey = process.env.REACT_APP_SERVICE_PUBLIC_KEY;

export const getProducts = async () => {
  const response = await axios.get(`${apiUrl}/products`);
  return response.data?.data;
};

export const calculateSummary = async (data) => {
  const response = await axios.post(`${apiUrl}/payments/calculate`, data);
  return response.data?.data;
};

export const createTransaction = async (data) => {
  const response = await axios.post(`${apiUrl}/transactions`, data);
  return response.data?.data;
};

/**
 * Tokeniza una tarjeta de crédito usando  API
 * @param {Object} cardData - Datos de la tarjeta
 * @param {string} cardData.number - Número de tarjeta (sin espacios)
 * @param {string} cardData.cvc - CVV de la tarjeta
 * @param {string} cardData.exp_month - Mes de expiración (MM)
 * @param {string} cardData.exp_year - Año de expiración (YY)
 * @param {string} cardData.card_holder - Nombre del titular
 * @returns {Promise<string>} Token de la tarjeta
 */
export const tokenizeCard = async (cardData) => {
  try {
    console.log('Tokenizing card with Service API:', PublicKey);
    const response = await axios.post(
      `${Url}/tokens/cards`,
      {
        number: cardData.number,
        cvc: cardData.cvc,
        exp_month: cardData.exp_month,
        exp_year: cardData.exp_year,
        card_holder: cardData.card_holder,
      },
      {
        headers: {
          Authorization: `Bearer ${PublicKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === 'CREATED') {
      return response.data.data.id;
    }

    throw new Error('Failed to tokenize card');
  } catch (error) {
    console.error('Error tokenizing card:', error);

    if (error.response?.data?.error) {
      const errorData = error.response.data.error;

      // Si hay mensajes de validación específicos, construir un mensaje legible
      if (errorData.messages && typeof errorData.messages === 'object') {
        const fieldErrors = Object.entries(errorData.messages)
          .map(([field, messages]) => {
            const fieldName = {
              'number': 'Número de tarjeta',
              'cvc': 'CVV',
              'exp_month': 'Mes de expiración',
              'exp_year': 'Año de expiración',
              'card_holder': 'Nombre del titular'
            }[field] || field;

            return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          })
          .join('. ');

        throw new Error(fieldErrors);
      }

      // Si hay un reason, usarlo
      if (errorData.reason) {
        throw new Error(errorData.reason);
      }

      // Último recurso: mostrar el tipo de error
      const errorTypes = {
        'INPUT_VALIDATION_ERROR': 'Los datos de la tarjeta son inválidos. Verifica la información e intenta nuevamente.',
        'CARD_DECLINED': 'La tarjeta fue rechazada. Intenta con otra tarjeta.',
        'INVALID_CARD': 'El número de tarjeta es inválido.',
        'EXPIRED_CARD': 'La tarjeta ha expirado.'
      };

      throw new Error(errorTypes[errorData.type] || 'Error al procesar la tarjeta');
    }

    throw new Error('No se pudo procesar la tarjeta. Verifica los datos e intenta nuevamente.');
  }
};

export const processPayment = async (data) => {
  const response = await axios.post(`${apiUrl}/payments/process`, data);
  return response.data?.data;
};

/**
 * Consulta el estado de una transacción
 * @param {string} transactionNumber - Número de transacción (e.g., "TRX-1768162951-80606")
 * @returns {Promise<Object>} Estado actualizado de la transacción
 */
export const getTransactionStatus = async (transactionNumber) => {
  const response = await axios.post(`${apiUrl}/payments/status`, {
    transactionNumber
  });
  return response.data?.data;
};

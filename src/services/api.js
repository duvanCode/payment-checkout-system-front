import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
const wompiUrl = process.env.REACT_APP_WOMPI_URL;
const wompiPublicKey = process.env.REACT_APP_WOMPI_PUBLIC_KEY;

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
 * Tokeniza una tarjeta de crédito usando Wompi API
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
    const response = await axios.post(
      `${wompiUrl}/tokens/cards`,
      {
        number: cardData.number,
        cvc: cardData.cvc,
        exp_month: cardData.exp_month,
        exp_year: cardData.exp_year,
        card_holder: cardData.card_holder,
      },
      {
        headers: {
          Authorization: `Bearer ${wompiPublicKey}`,
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
      const wompiError = error.response.data.error;
      throw new Error(wompiError.reason || wompiError.type || 'Error al procesar la tarjeta');
    }

    throw new Error('No se pudo procesar la tarjeta. Verifica los datos e intenta nuevamente.');
  }
};

export const processPayment = async (data) => {
  const response = await axios.post(`${apiUrl}/payments/process`, data);
  return response.data?.data;
};

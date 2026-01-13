import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { setPaymentData, setSummary, setStep, setLoading } from '../store/reducer';
import { calculateSummary, tokenizeCard } from '../services/api';
import { detectCardType } from '../utils/validation';
import { formatCardNumber, formatCVV, formatTwoDigits } from '../utils/formatters';
import { validatePaymentForm } from '../utils/validation';
import './PaymentModal.css';

const PaymentModal = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: '',
    customerEmail: '',
    customerPhone: '+57',
    customerFullName: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryDepartment: ''
  });
  const [errors, setErrors] = useState({});
  const [showCvv, setShowCvv] = useState(false);

  const cardType = detectCardType(formData.cardNumber);

  const handleChange = (field, value) => {
    let processedValue = value;

    if (field === 'cardNumber') {
      processedValue = formatCardNumber(value);
    } else if (field === 'cvv') {
      processedValue = formatCVV(value);
    } else if (field === 'expirationMonth' || field === 'expirationYear') {
      processedValue = formatTwoDigits(value);
    }

    setFormData({ ...formData, [field]: processedValue });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validatePaymentForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(setLoading(true));

    try {
      // PASO 1: Tokenizar la tarjeta con Service (seguridad)
      const cardToken = await tokenizeCard({
        number: formData.cardNumber.replace(/\s/g, ''),
        cvc: formData.cvv,
        exp_month: formData.expirationMonth,
        exp_year: formData.expirationYear,
        card_holder: formData.cardHolderName,
      });

      // PASO 2: Calcular resumen del pedido
      const summaryData = await calculateSummary({
        productId: cart.product.id,
        quantity: cart.quantity,
        deliveryCity: formData.deliveryCity
      });

      // PASO 3: Guardar datos para el siguiente paso (sin información sensible de tarjeta)
      dispatch(setSummary(summaryData));
      dispatch(setPaymentData({
        ...formData,
        cardToken, // Solo guardamos el token, no los datos de la tarjeta
        // Limpiamos datos sensibles de tarjeta por seguridad
        cardNumber: `**** **** **** ${formData.cardNumber.slice(-4)}`,
        cvv: '***',
      }));
      dispatch(setStep('summary'));
    } catch (error) {
      console.error('Error al procesar:', error);
      setErrors({
        submit: error.message || 'Error al procesar la tarjeta. Verifica los datos e intenta nuevamente.'
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <button className="back-button" onClick={() => dispatch(setStep('products'))}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="payment-title">Información de Pago</h2>
      </div>

      <div className="form-wrapper">
        <div className="form-card">
          {/* Sección izquierda: Datos de la tarjeta */}
          <div className="payment-section-left">
            <h3 className="section-title">Datos de la tarjeta</h3>

            <div className="form-group">
              <label className="form-label">Número de tarjeta *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleChange('cardNumber', e.target.value)}
                />
                {cardType && (
                  <span className="card-type-badge">
                    {cardType.toUpperCase()}
                  </span>
                )}
              </div>
              {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Nombre del titular *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Como aparece en la tarjeta"
                value={formData.cardHolderName}
                onChange={(e) => handleChange('cardHolderName', e.target.value)}
              />
              {errors.cardHolderName && <span className="form-error">{errors.cardHolderName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group form-group-flex">
                <label className="form-label">Mes *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="MM"
                  value={formData.expirationMonth}
                  onChange={(e) => handleChange('expirationMonth', e.target.value)}
                />
                {errors.expirationMonth && <span className="form-error">{errors.expirationMonth}</span>}
              </div>

              <div className="form-group form-group-flex">
                <label className="form-label">Año *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="AA"
                  value={formData.expirationYear}
                  onChange={(e) => handleChange('expirationYear', e.target.value)}
                />
                {errors.expirationYear && <span className="form-error">{errors.expirationYear}</span>}
              </div>

              <div className="form-group form-group-flex">
                <label className="form-label">CVV *</label>
                <div className="input-wrapper">
                  <input
                    type={showCvv ? 'text' : 'password'}
                    className="form-input"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleChange('cvv', e.target.value)}
                  />
                  <button
                    className="cvv-toggle-button"
                    onClick={() => setShowCvv(!showCvv)}
                    type="button"
                  >
                    👁️
                  </button>
                </div>
                {errors.cvv && <span className="form-error">{errors.cvv}</span>}
              </div>
            </div>
          </div>

          {/* Sección derecha: Información de entrega */}
          <div className="payment-section-right">
            <h3 className="section-title section-title-spacing">
              Información de entrega
            </h3>

          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Tu nombre completo"
              value={formData.customerFullName}
              onChange={(e) => handleChange('customerFullName', e.target.value)}
            />
            {errors.customerFullName && <span className="form-error">{errors.customerFullName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico *</label>
            <input
              type="email"
              className="form-input"
              placeholder="correo@ejemplo.com"
              value={formData.customerEmail}
              onChange={(e) => handleChange('customerEmail', e.target.value)}
            />
            {errors.customerEmail && <span className="form-error">{errors.customerEmail}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp *</label>
            <input
              type="text"
              className="form-input"
              placeholder="+57 3001234567"
              value={formData.customerPhone}
              onChange={(e) => handleChange('customerPhone', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dirección de entrega *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Calle 123 # 45-67 Apto 890"
              value={formData.deliveryAddress}
              onChange={(e) => handleChange('deliveryAddress', e.target.value)}
            />
            {errors.deliveryAddress && <span className="form-error">{errors.deliveryAddress}</span>}
          </div>

          <div className="form-row">
            <div className="form-group form-group-flex">
              <label className="form-label">Ciudad *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Bogotá"
                value={formData.deliveryCity}
                onChange={(e) => handleChange('deliveryCity', e.target.value)}
              />
              {errors.deliveryCity && <span className="form-error">{errors.deliveryCity}</span>}
            </div>

            <div className="form-group form-group-flex">
              <label className="form-label">Departamento *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Cundinamarca"
                value={formData.deliveryDepartment}
                onChange={(e) => handleChange('deliveryDepartment', e.target.value)}
              />
              {errors.deliveryDepartment && <span className="form-error">{errors.deliveryDepartment}</span>}
            </div>
          </div>
          </div>

          {errors.submit && (
            <div className="form-error-general" style={{
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              color: '#c33'
            }}>
              {errors.submit}
            </div>
          )}

          <button className="submit-button" onClick={handleSubmit}>
            Continuar al resumen →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { setTransaction, setStep, setLoading } from '../store/reducer';
import { processPayment } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import './SummaryPage.css';

const SummaryPage = () => {
  const dispatch = useDispatch();
  const summary = useSelector(state => state.summary);
  const cart = useSelector(state => state.cart);
  const paymentData = useSelector(state => state.paymentData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setProcessingMessage('Procesando pago...');
    dispatch(setLoading(true));

    try {
      // Enviar solo el token de la tarjeta, no los datos sensibles
      const paymentRequest = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        cardToken: paymentData.cardToken, // Token generado en el paso anterior
        customerEmail: paymentData.customerEmail,
        customerPhone: paymentData.customerPhone,
        customerFullName: paymentData.customerFullName,
        deliveryAddress: paymentData.deliveryAddress,
        deliveryCity: paymentData.deliveryCity,
        deliveryDepartment: paymentData.deliveryDepartment
      };

      setProcessingMessage('Comunicando con el servicio de pagos...');
      const result = await processPayment(paymentRequest);


      // Guardar la transacción con el estado real del servicio
      dispatch(setTransaction(result));

      // Mostrar mensaje basado en el estado
      if (result.status === 'PENDING') {
        setProcessingMessage('Transacción pendiente. Redirigiendo...');
      } else if (result.status === 'APPROVED') {
        setProcessingMessage('¡Pago aprobado! Redirigiendo...');
      } else {
        setProcessingMessage('Procesamiento completado. Redirigiendo...');
      }

      // Pequeña pausa para mostrar el mensaje antes de redirigir
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch(setStep('result'));


    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setProcessingMessage('');
      alert('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="processing-spinner"></div>
            <p className="processing-message">{processingMessage}</p>
          </div>
        </div>
      )}

      <div className="summary-container">
        <div className="summary-header">
          <button className="summary-back-button" onClick={() => dispatch(setStep('payment'))}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="summary-title">Resumen del Pedido</h2>
        </div>

        <div className="summary-wrapper">
          <div className="summary-card">
            <div className="summary-section">
              <h3 className="summary-section-title">Productos</h3>
              {cart.map((item) => (
                <div key={item.product.id} className="summary-product-item">
                  <div className="summary-row">
                    <span className="summary-label">{item.product.name} (x{item.quantity})</span>
                    <span className="summary-value">{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
              <div className="summary-divider"></div>
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">{formatCurrency(summary.subtotal)}</span>
              </div>
            </div>


            <div className="summary-section">
              <h3 className="summary-section-title">Cargos adicionales</h3>
              <div className="summary-row">
                <span className="summary-label">Tarifa base</span>
                <span className="summary-value">{formatCurrency(summary.fees?.base || 0)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Envío a {summary.deliveryCity}</span>
                <span className="summary-value">{formatCurrency(summary.fees?.delivery || 0)}</span>
              </div>
            </div>

            <div className="summary-total">
              <span className="summary-total-label">Total a pagar</span>
              <span className="summary-total-value">{formatCurrency(summary.total)}</span>
            </div>

            <div className="summary-section">
              <h3 className="summary-section-title">Información de entrega</h3>
              <p className="summary-delivery-text">{paymentData.customerFullName}</p>
              <p className="summary-delivery-text">{paymentData.deliveryAddress}</p>
              <p className="summary-delivery-text">
                {paymentData.deliveryCity}, {paymentData.deliveryDepartment}
              </p>
              <p className="summary-delivery-text">{paymentData.customerEmail}</p>
            </div>

            <button className="summary-submit-button" onClick={handleConfirmPayment}>
              Confirmar y pagar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryPage;
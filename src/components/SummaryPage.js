import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { setTransaction, setStep, setLoading } from '../store/reducer';
import { processPayment } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import './SummaryPage.css';

const SummaryPage = () => {
  const dispatch = useDispatch();
  const { summary, cart, paymentData } = useSelector(state => state);

  const handleConfirmPayment = async () => {
    dispatch(setLoading(true));

    try {
      const paymentRequest = {
        productId: cart.product.id,
        quantity: cart.quantity,
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        cardHolderName: paymentData.cardHolderName,
        expirationMonth: paymentData.expirationMonth,
        expirationYear: paymentData.expirationYear,
        cvv: paymentData.cvv,
        customerEmail: paymentData.customerEmail,
        customerPhone: paymentData.customerPhone,
        customerFullName: paymentData.customerFullName,
        deliveryAddress: paymentData.deliveryAddress,
        deliveryCity: paymentData.deliveryCity,
        deliveryDepartment: paymentData.deliveryDepartment
      };

      const result = await processPayment(paymentRequest);
      dispatch(setTransaction(result));
      dispatch(setStep('result'));
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
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
            <h3 className="summary-section-title">Producto</h3>
            <div className="summary-row">
              <span className="summary-label">{summary.productName}</span>
              <span className="summary-value">{formatCurrency(summary.productPrice)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Cantidad</span>
              <span className="summary-value">{summary.quantity}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">{formatCurrency(summary.subtotal)}</span>
            </div>
          </div>

          <div className="summary-section">
            <h3 className="summary-section-title">Cargos adicionales</h3>
            <div className="summary-row">
              <span className="summary-label">Tarifa base</span>
              <span className="summary-label">{formatCurrency(summary.baseFee)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Envío a {summary.deliveryCity}</span>
              <span className="summary-label">{formatCurrency(summary.deliveryFee)}</span>
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
  );
};

export default SummaryPage;
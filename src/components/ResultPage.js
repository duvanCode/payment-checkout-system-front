import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { reset, setProducts, setStep } from '../store/reducer';
import { getProducts } from '../services/api';
import './ResultPage.css';

const ResultPage = () => {
  const dispatch = useDispatch();
  const transaction = useSelector(state => state.transaction);

  const handleBackToStore = () => {
    dispatch(reset());
    getProducts().then(data => {
      dispatch(setProducts(data.products));
    });
    dispatch(setStep('products'));
  };

  const isPending = transaction.status === 'PENDING';
  const isApproved = transaction.status === 'APPROVED';
  const isSuccess = transaction.success && !isPending;

  return (
    <div className="result-container">
      <div className="result-wrapper">
        <div className="result-card">
          {isPending ? (
            <>
              <Clock size={80} className="result-icon result-icon-pending" style={{ color: '#ff9800' }} />
              <h2 className="result-title">Pago en proceso</h2>
              <p className="result-message">{transaction.message}</p>

              <div className="result-details">
                <div className="result-detail-row">
                  <span className="result-detail-label">Número de transacción</span>
                  <span className="result-detail-value">{transaction.transactionNumber}</span>
                </div>
                <div className="result-detail-row">
                  <span className="result-detail-label">Estado</span>
                  <span className="result-detail-value" style={{ color: '#ff9800', fontWeight: 'bold' }}>
                    {transaction.status}
                  </span>
                </div>
                <div className="result-info-box" style={{
                  backgroundColor: '#fff3e0',
                  border: '1px solid #ffb74d',
                  padding: '16px',
                  borderRadius: '8px',
                  marginTop: '16px'
                }}>
                  <p style={{ margin: 0, color: '#e65100', fontSize: '14px' }}>
                    ⏳ Tu pago está siendo procesado. Recibirás una confirmación por correo electrónico una vez que se complete la transacción.
                  </p>
                </div>
              </div>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle size={80} className="result-icon result-icon-success" />
              <h2 className="result-title">¡Pago exitoso!</h2>
              <p className="result-message">{transaction.message}</p>

              <div className="result-details">
                <div className="result-detail-row">
                  <span className="result-detail-label">Número de transacción</span>
                  <span className="result-detail-value">{transaction.transactionNumber}</span>
                </div>
                <div className="result-detail-row">
                  <span className="result-detail-label">Estado</span>
                  <span className="result-detail-value result-detail-success">{transaction.status}</span>
                </div>
                {transaction.delivery && (
                  <>
                    <div className="result-detail-row">
                      <span className="result-detail-label">Número de seguimiento</span>
                      <span className="result-detail-value">{transaction.delivery.trackingNumber}</span>
                    </div>
                    <div className="result-detail-row">
                      <span className="result-detail-label">Entrega estimada</span>
                      <span className="result-detail-value">
                        {new Date(transaction.delivery.estimatedDeliveryDate).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    <div className="result-detail-row">
                      <span className="result-detail-label">Dirección de envío</span>
                      <span className="result-detail-value result-detail-address">
                        {transaction.delivery.address}, {transaction.delivery.city}
                      </span>
                    </div>
                  </>
                )}
                {transaction.product && (
                  <div className="result-detail-row">
                    <span className="result-detail-label">Stock actualizado</span>
                    <span className="result-detail-value">
                      {transaction.product.name}: {transaction.product.updatedStock} unidades
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <XCircle size={80} className="result-icon result-icon-error" />
              <h2 className="result-title">Pago rechazado</h2>
              <p className="result-message">{transaction.message}</p>

              <div className="result-details">
                <div className="result-detail-row">
                  <span className="result-detail-label">Número de transacción</span>
                  <span className="result-detail-value">{transaction.transactionNumber}</span>
                </div>
                <div className="result-detail-row">
                  <span className="result-detail-label">Estado</span>
                  <span className="result-detail-value result-detail-error">{transaction.status}</span>
                </div>
                {transaction.error && (
                  <>
                    <div className="result-detail-row">
                      <span className="result-detail-label">Código de error</span>
                      <span className="result-detail-value">{transaction.error.code}</span>
                    </div>
                    <div className="result-detail-row">
                      <span className="result-detail-label">Detalle</span>
                      <span className="result-detail-value result-detail-address">
                        {transaction.error.message}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          <button className="back-to-store-button" onClick={handleBackToStore}>
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
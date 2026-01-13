import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { reset, setProducts, setStep, setTransaction } from '../store/reducer';
import { getProducts, getTransactionStatus } from '../services/api';
import './ResultPage.css';

const ResultPage = () => {
  const dispatch = useDispatch();
  const transaction = useSelector(state => state.transaction);
  const [pollingCount, setPollingCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isPolling, setIsPolling] = useState(false);

  const isPending = transaction.status === 'PENDING';
  const isApproved = transaction.status === 'APPROVED';
  const isSuccess = transaction.success && !isPending;

  // Polling automático cada 10 segundos para transacciones pendientes
  useEffect(() => {
    if (!isPending || !transaction.transactionNumber) {
      return;
    }

    console.log('🔄 Starting polling for transaction:', transaction.transactionNumber);
    setIsPolling(true);

    const pollTransactionStatus = async () => {
      try {
        console.log(`📡 Polling attempt #${pollingCount + 1} at ${new Date().toLocaleTimeString()}`);
        const status = await getTransactionStatus(transaction.transactionNumber);

        console.log('📊 Transaction status response:', status);
        setLastUpdate(new Date());
        setPollingCount(prev => prev + 1);

        // Si el estado cambió de PENDING, actualizar la transacción
        if (status.internalStatus !== 'PENDING') {
          console.log('✅ Transaction status changed from PENDING to:', status.internalStatus);

          // Mapear la respuesta del estado al formato esperado
          const updatedTransaction = {
            ...transaction,
            status: status.internalStatus,
            serviceStatus: status.serviceStatus,
            updatedAt: status.updatedAt,
            // Si está aprobada, asumimos que es exitosa
            success: status.internalStatus === 'APPROVED',
            message: status.internalStatus === 'APPROVED'
              ? 'Pago aprobado exitosamente'
              : status.internalStatus === 'DECLINED'
              ? 'Pago rechazado'
              : 'Estado de pago actualizado'
          };

          dispatch(setTransaction(updatedTransaction));
          setIsPolling(false);
        }
      } catch (error) {
        console.error('❌ Error polling transaction status:', error);
      }
    };

    // Primera consulta inmediata
    pollTransactionStatus();

    // Luego cada 10 segundos
    const intervalId = setInterval(pollTransactionStatus, 10000);

    // Cleanup: detener polling cuando el componente se desmonte o el estado cambie
    return () => {
      console.log('🛑 Stopping polling');
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [isPending, transaction.transactionNumber, dispatch, pollingCount, transaction]);

  const handleBackToStore = () => {
    dispatch(reset());
    getProducts().then(data => {
      dispatch(setProducts(data.products));
    });
    dispatch(setStep('products'));
  };

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

                {isPolling && (
                  <div className="result-detail-row" style={{ marginTop: '16px', justifyContent: 'center', gap: '8px' }}>
                    <RefreshCw
                      size={16}
                      className="rotating-icon"
                      style={{
                        color: '#ff9800',
                        animation: 'spin 2s linear infinite'
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      Consultando estado... (actualización #{pollingCount})
                    </span>
                  </div>
                )}

                {lastUpdate && (
                  <div className="result-detail-row" style={{ marginTop: '8px', justifyContent: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#999' }}>
                      Última actualización: {lastUpdate.toLocaleTimeString('es-CO')}
                    </span>
                  </div>
                )}
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
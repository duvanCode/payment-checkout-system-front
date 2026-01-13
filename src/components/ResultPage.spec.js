import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ResultPage from './ResultPage';
import { getTransactionStatus, getProducts } from '../services/api';

const mockStore = configureStore([]);
jest.mock('../services/api');

describe('ResultPage Component', () => {
    let store;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });


    const setup = (transaction) => {
        store = mockStore({ transaction, cart: [] });
        store.dispatch = jest.fn();
        return render(
            <Provider store={store}>
                <ResultPage />
            </Provider>
        );
    };

    it('should render success state when approved', () => {
        setup({ status: 'APPROVED', success: true, message: 'Pago exitoso', transactionNumber: 'TX1' });
        expect(screen.getByText('¡Pago exitoso!')).toBeInTheDocument();
        expect(screen.getByText('TX1')).toBeInTheDocument();
    });

    it('should render error state when declined', () => {
        setup({ status: 'DECLINED', success: false, message: 'Pago rechazado', transactionNumber: 'TX2' });
        expect(screen.getByRole('heading', { name: /Pago rechazado/i })).toBeInTheDocument();
    });

    it('should render pending state and start polling', async () => {
        jest.useFakeTimers();
        getTransactionStatus.mockResolvedValue({ internalStatus: 'PENDING' });

        setup({ status: 'PENDING', success: false, message: 'Procesando...', transactionNumber: 'TX_PENDING' });

        expect(screen.getByText('Pago en proceso')).toBeInTheDocument();
        expect(getTransactionStatus).toHaveBeenCalledWith('TX_PENDING');

        // Avanzar el tiempo 10 segundos para el siguiente poll
        act(() => {
            jest.advanceTimersByTime(10000);
        });

        expect(getTransactionStatus).toHaveBeenCalledTimes(2);
    });

    it('should update transaction and stop polling when status changes', async () => {
        getTransactionStatus.mockResolvedValue({ internalStatus: 'APPROVED', serviceStatus: 'APPROVED' });

        setup({ status: 'PENDING', success: false, message: 'Procesando...', transactionNumber: 'TX_POLL' });

        await waitFor(() => {
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: 'SET_TRANSACTION',
                payload: expect.objectContaining({ status: 'APPROVED' })
            }));
        });
    });

    it('should handle back to store button', async () => {
        getProducts.mockResolvedValue({ products: [] });
        setup({ status: 'APPROVED', success: true, message: 'OK', transactionNumber: 'TX1' });

        const backButton = screen.getByText('Volver a la tienda');
        fireEvent.click(backButton);

        expect(store.dispatch).toHaveBeenCalledWith({ type: 'RESET' });
        expect(getProducts).toHaveBeenCalled();
    });
});

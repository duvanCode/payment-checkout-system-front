import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SummaryPage from './SummaryPage';
import { processPayment } from '../services/api';

const mockStore = configureStore([]);
jest.mock('../services/api');

describe('SummaryPage Component', () => {
    let store;
    const mockInitialState = {
        summary: {
            productName: 'Test Product',
            productPrice: 100000,
            quantity: 1,
            subtotal: 100000,
            fees: {
                base: 5000,
                delivery: 10000
            },
            deliveryCity: 'Bogota',
            total: 115000
        },
        cart: [
            {
                product: { id: 1, name: 'Test Product', price: 100000 },
                quantity: 1
            }
        ],
        paymentData: {
            cardToken: 'tok_123',
            customerFullName: 'John Doe',
            customerEmail: 'john@example.com',
            deliveryAddress: 'Street 123',
            deliveryCity: 'Bogota',
            deliveryDepartment: 'Cundinamarca'
        }
    };

    beforeEach(() => {
        store = mockStore(mockInitialState);
        store.dispatch = jest.fn();
        jest.clearAllMocks();
    });

    it('should render order summary details', () => {
        render(
            <Provider store={store}>
                <SummaryPage />
            </Provider>
        );
        expect(screen.getByText(/Test Product/)).toBeInTheDocument();
        expect(screen.getByText('Total a pagar')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle back button click', () => {
        render(
            <Provider store={store}>
                <SummaryPage />
            </Provider>
        );
        const backButton = screen.getByRole('button', { name: '' }); // ArrowLeft button
        fireEvent.click(backButton);
        expect(store.dispatch).toHaveBeenCalledWith({ type: 'SET_STEP', payload: 'payment' });
    });

    it('should handle confirm payment successfully', async () => {
        processPayment.mockResolvedValue({ status: 'APPROVED', id: 'TX1' });

        render(
            <Provider store={store}>
                <SummaryPage />
            </Provider>
        );

        const confirmButton = screen.getByText('Confirmar y pagar');
        fireEvent.click(confirmButton);

        expect(processPayment).toHaveBeenCalled();
        expect(await screen.findByText('¡Pago aprobado! Redirigiendo...', {}, { timeout: 3000 })).toBeInTheDocument();
    });
});

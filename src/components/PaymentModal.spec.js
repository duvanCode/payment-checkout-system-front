import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PaymentModal from './PaymentModal';
import { calculateSummary, tokenizeCard } from '../services/api';

const mockStore = configureStore([]);
jest.mock('../services/api');

describe('PaymentModal Component', () => {
    let store;
    const mockInitialState = {
        cart: {
            product: { id: 1 },
            quantity: 1
        },
        loading: false
    };

    beforeEach(() => {
        store = mockStore(mockInitialState);
        store.dispatch = jest.fn();
        jest.clearAllMocks();
    });

    it('should render form fields', () => {
        render(
            <Provider store={store}>
                <PaymentModal />
            </Provider>
        );
        expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Como aparece en la tarjeta')).toBeInTheDocument();
    });

    it('should format card number on change', () => {
        render(
            <Provider store={store}>
                <PaymentModal />
            </Provider>
        );
        const input = screen.getByPlaceholderText('1234 5678 9012 3456');
        fireEvent.change(input, { target: { value: '4111111111111111' } });
        expect(input.value).toBe('4111 1111 1111 1111');
    });

    it('should show validation errors on empty submit', () => {
        render(
            <Provider store={store}>
                <PaymentModal />
            </Provider>
        );
        const submitButton = screen.getByText('Continuar al resumen →');
        fireEvent.click(submitButton);

        expect(screen.getByText('Número de tarjeta inválido')).toBeInTheDocument();
    });

    it('should handle successful submission', async () => {
        tokenizeCard.mockResolvedValue('tok_123');
        calculateSummary.mockResolvedValue({ total: 1000 });

        render(
            <Provider store={store}>
                <PaymentModal />
            </Provider>
        );

        // Fill all fields
        fireEvent.change(screen.getByPlaceholderText('1234 5678 9012 3456'), { target: { value: '4111111111111111' } });
        fireEvent.change(screen.getByPlaceholderText('Como aparece en la tarjeta'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('MM'), { target: { value: '12' } });
        fireEvent.change(screen.getByPlaceholderText('AA'), { target: { value: '25' } });
        fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123' } });
        fireEvent.change(screen.getByPlaceholderText('Tu nombre completo'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('correo@ejemplo.com'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Calle 123 # 45-67 Apto 890'), { target: { value: 'Calle Falsa 123, Springfield' } });
        fireEvent.change(screen.getByPlaceholderText('Bogotá'), { target: { value: 'Bogota' } });
        fireEvent.change(screen.getByPlaceholderText('Cundinamarca'), { target: { value: 'Bogota' } });

        const submitButton = screen.getByText('Continuar al resumen →');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(tokenizeCard).toHaveBeenCalled();
            expect(calculateSummary).toHaveBeenCalled();
            expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_STEP', payload: 'summary' }));
        });
    });
});

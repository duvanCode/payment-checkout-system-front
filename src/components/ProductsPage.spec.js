import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProductsPage from './ProductsPage';

const mockStore = configureStore([]);

describe('ProductsPage Component', () => {
    let store;
    const mockProducts = [
        { id: 1, name: 'Phone', category: 'Tech', price: 1000, stock: 10, description: 'Best phone' },
        { id: 2, name: 'T-Shirt', category: 'Clothing', price: 20, stock: 5, description: 'Cool shirt' }
    ];

    beforeEach(() => {
        store = mockStore({
            products: mockProducts,
            searchQuery: '',
            selectedCategory: 'Todos'
        });
        store.dispatch = jest.fn();
    });

    it('should render all products', () => {
        render(
            <Provider store={store}>
                <ProductsPage />
            </Provider>
        );
        expect(screen.getByText('Phone')).toBeInTheDocument();
        expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    });

    it('should filter products by search query', () => {
        store = mockStore({
            products: mockProducts,
            searchQuery: 'phone',
            selectedCategory: 'Todos'
        });
        render(
            <Provider store={store}>
                <ProductsPage />
            </Provider>
        );
        expect(screen.getByText('Phone')).toBeInTheDocument();
        expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
    });

    it('should open quantity modal on buy click', () => {
        render(
            <Provider store={store}>
                <ProductsPage />
            </Provider>
        );
        const buyButtons = screen.getAllByText('Comprar');
        fireEvent.click(buyButtons[0]);

        expect(screen.getByText('Seleccionar cantidad')).toBeInTheDocument();
    });

    it('should dispatch setCart and setStep when proceeding to payment', () => {
        render(
            <Provider store={store}>
                <ProductsPage />
            </Provider>
        );
        const buyButtons = screen.getAllByText('Comprar');
        fireEvent.click(buyButtons[0]);

        const proceedButton = screen.getByText('Proceder al pago');
        fireEvent.click(proceedButton);

        expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_CART' }));
        expect(store.dispatch).toHaveBeenCalledWith({ type: 'SET_STEP', payload: 'payment' });
    });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProductsPage from './ProductsPage';

const mockStore = configureStore([]);

describe('ProductsPage Component', () => {
    let store;
    const mockProducts = [
        { id: 1, name: 'Phone', category: 'Tech', price: 1000, stock: 10, description: 'Best phone', imageUrl: 'https://example.com/phone.jpg' },
        { id: 2, name: 'T-Shirt', category: 'Clothing', price: 20, stock: 5, description: 'Cool shirt', imageUrl: 'https://example.com/shirt.jpg' }
    ];

    beforeEach(() => {
        store = mockStore({
            products: mockProducts,
            searchQuery: '',
            selectedCategory: 'Todos',
            cart: []
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
            selectedCategory: 'Todos',
            cart: []
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
        // El componente usa íconos de ShoppingCart como botón de compra
        const buyButtons = screen.getAllByTestId('shopping-cart-icon');
        fireEvent.click(buyButtons[0]);

        expect(screen.getByText('Seleccionar cantidad')).toBeInTheDocument();
    });

    it('should dispatch addToCart when adding to cart', () => {
        render(
            <Provider store={store}>
                <ProductsPage />
            </Provider>
        );
        const buyButtons = screen.getAllByTestId('shopping-cart-icon');
        fireEvent.click(buyButtons[0]);

        const addToCartButton = screen.getByText('Agregar al carrito');
        fireEvent.click(addToCartButton);

        expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'ADD_TO_CART' }));
    });
});

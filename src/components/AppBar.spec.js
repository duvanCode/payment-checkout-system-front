import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AppBar from './AppBar';
import { setSearchQuery } from '../store/reducer';

const mockStore = configureStore([]);

describe('AppBar Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            searchQuery: '',
            selectedCategory: 'Todos'
        });
        store.dispatch = jest.fn();
    });

    it('should render the brand name', () => {
        render(
            <Provider store={store}>
                <AppBar />
            </Provider>
        );
        expect(screen.getByText('TechStore')).toBeInTheDocument();
    });

    it('should dispatch setSearchQuery on input change', () => {
        render(
            <Provider store={store}>
                <AppBar />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Buscar productos...');
        fireEvent.change(input, { target: { value: 'laptop' } });

        expect(store.dispatch).toHaveBeenCalled();
    });
});

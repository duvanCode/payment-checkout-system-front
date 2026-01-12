import reducer, {
    SET_PRODUCTS, SET_CART, SET_PAYMENT_DATA, SET_SUMMARY,
    SET_TRANSACTION, SET_LOADING, SET_ERROR, SET_STEP,
    SET_SEARCH_QUERY, SET_CATEGORY, RESET
} from './reducer';

const initialState = {
    products: [],
    cart: null,
    paymentData: null,
    summary: null,
    transaction: null,
    loading: false,
    error: null,
    currentStep: 'products',
    searchQuery: '',
    selectedCategory: 'Todos'
};

describe('Store Reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle SET_PRODUCTS', () => {
        const products = [{ id: 1, name: 'Prod' }];
        expect(reducer(initialState, { type: SET_PRODUCTS, payload: products }).products).toEqual(products);
    });

    it('should handle SET_CART', () => {
        const cart = { id: 1, quantity: 1 };
        expect(reducer(initialState, { type: SET_CART, payload: cart }).cart).toEqual(cart);
    });

    it('should handle SET_PAYMENT_DATA', () => {
        const data = { email: 'test@test.com' };
        expect(reducer(initialState, { type: SET_PAYMENT_DATA, payload: data }).paymentData).toEqual(data);
    });

    it('should handle SET_SUMMARY', () => {
        const summary = { total: 1000 };
        expect(reducer(initialState, { type: SET_SUMMARY, payload: summary }).summary).toEqual(summary);
    });

    it('should handle SET_TRANSACTION', () => {
        const tx = { id: 'TX1' };
        expect(reducer(initialState, { type: SET_TRANSACTION, payload: tx }).transaction).toEqual(tx);
    });

    it('should handle SET_LOADING', () => {
        expect(reducer(initialState, { type: SET_LOADING, payload: true }).loading).toBe(true);
    });

    it('should handle SET_ERROR', () => {
        expect(reducer(initialState, { type: SET_ERROR, payload: 'Error' }).error).toBe('Error');
    });

    it('should handle SET_STEP', () => {
        expect(reducer(initialState, { type: SET_STEP, payload: 'summary' }).currentStep).toBe('summary');
    });

    it('should handle SET_SEARCH_QUERY', () => {
        expect(reducer(initialState, { type: SET_SEARCH_QUERY, payload: 'phone' }).searchQuery).toBe('phone');
    });

    it('should handle SET_CATEGORY', () => {
        expect(reducer(initialState, { type: SET_CATEGORY, payload: 'Tech' }).selectedCategory).toBe('Tech');
    });

    it('should handle RESET', () => {
        const state = { ...initialState, cart: {}, products: [1] };
        const nextState = reducer(state, { type: RESET });
        expect(nextState.cart).toBeNull();
        expect(nextState.products).toEqual([1]); // RESET mantiene los productos según el código
    });
});

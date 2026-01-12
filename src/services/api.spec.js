import axios from 'axios';
jest.mock('axios');

const API_URL = 'http://localhost:3001/api';
const SERVICE_URL = 'https://api.service.com';
const PUBLIC_KEY = 'pub_test_123';

// Set env vars before requiring the api module to avoid hoisting issues
process.env.REACT_APP_API_URL = API_URL;
process.env.REACT_APP_SERVICE_URL = SERVICE_URL;
process.env.REACT_APP_SERVICE_PUBLIC_KEY = PUBLIC_KEY;

// Using require to ensure env vars are set before module initialization
const api = require('./api');

describe('API Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    describe('getProducts', () => {
        it('should fetch products successfully', async () => {
            const mockProducts = [{ id: 1, name: 'Product 1' }];
            axios.get.mockResolvedValue({ data: { data: mockProducts } });

            const result = await api.getProducts();
            expect(axios.get).toHaveBeenCalledWith(`${API_URL}/products`);
            expect(result).toEqual(mockProducts);
        });
    });

    describe('calculateSummary', () => {
        it('should post and return summary', async () => {
            const mockSummary = { total: 150000 };
            const dto = { productId: '1', quantity: 1, city: 'Bogota' };
            axios.post.mockResolvedValue({ data: { data: mockSummary } });

            const result = await api.calculateSummary(dto);
            expect(axios.post).toHaveBeenCalledWith(`${API_URL}/payments/calculate`, dto);
            expect(result).toEqual(mockSummary);
        });
    });

    describe('tokenizeCard', () => {
        it('should return token id on success', async () => {
            const mockResponse = { data: { status: 'CREATED', data: { id: 'TOK_123' } } };
            axios.post.mockResolvedValue(mockResponse);

            const cardData = { number: '123', cvc: '123', exp_month: '01', exp_year: '25', card_holder: 'Name' };
            const token = await api.tokenizeCard(cardData);

            expect(axios.post).toHaveBeenCalledWith(`${SERVICE_URL}/tokens/cards`, expect.any(Object), expect.any(Object));
            expect(token).toBe('TOK_123');
        });

        it('should throw error on failure', async () => {
            axios.post.mockRejectedValue({ response: { data: { error: { reason: 'Invalid card' } } } });
            await expect(api.tokenizeCard({})).rejects.toThrow('Invalid card');
        });
    });

    describe('processPayment', () => {
        it('should post payment data and return result', async () => {
            const mockResult = { success: true, transactionId: 'TX1' };
            const paymentData = { cardToken: 'TOK1' };
            axios.post.mockResolvedValue({ data: { data: mockResult } });

            const result = await api.processPayment(paymentData);
            expect(axios.post).toHaveBeenCalledWith(`${API_URL}/payments/process`, paymentData);
            expect(result).toEqual(mockResult);
        });
    });

    describe('getTransactionStatus', () => {
        it('should fetch status by number', async () => {
            const mockStatus = { status: 'APPROVED' };
            axios.post.mockResolvedValue({ data: { data: mockStatus } });

            const result = await api.getTransactionStatus('TX-123');
            expect(axios.post).toHaveBeenCalledWith(`${API_URL}/payments/status`, { transactionNumber: 'TX-123' });
            expect(result).toEqual(mockStatus);
        });
    });
});

import * as validation from './validation';

describe('Validation Utils', () => {
    describe('detectCardType', () => {
        it('should detect visa', () => {
            expect(validation.detectCardType('4111 1111 1111 1111')).toBe('visa');
        });
        it('should detect mastercard', () => {
            expect(validation.detectCardType('5111 1111 1111 1111')).toBe('mastercard');
        });
        it('should return null for unknown', () => {
            expect(validation.detectCardType('1111 1111 1111 1111')).toBeNull();
        });
    });

    describe('validateCardNumber', () => {
        it('should return true for valid Luhn number', () => {
            // Valid Visa number (Luhn)
            expect(validation.validateCardNumber('4111 1111 1111 1111')).toBe(true);
        });
        it('should return false for invalid Luhn number', () => {
            expect(validation.validateCardNumber('4111 1111 1111 1112')).toBe(false);
        });
        it('should return false for short number', () => {
            expect(validation.validateCardNumber('123')).toBe(false);
        });
    });

    describe('validateEmail', () => {
        it('should validate correct email', () => {
            expect(validation.validateEmail('test@example.com')).toBe(true);
        });
        it('should reject invalid email', () => {
            expect(validation.validateEmail('invalid-email')).toBe(false);
        });
    });

    describe('validateExpirationDate', () => {
        it('should validate month', () => {
            expect(validation.validateExpirationMonth('01')).toBe(true);
            expect(validation.validateExpirationMonth('12')).toBe(true);
            expect(validation.validateExpirationMonth('13')).toBe(false);
        });
        it('should validate year', () => {
            expect(validation.validateExpirationYear('25')).toBe(true);
            expect(validation.validateExpirationYear('abc')).toBe(false);
        });
    });

    describe('validateCVV', () => {
        it('should validate 3 or 4 digits', () => {
            expect(validation.validateCVV('123')).toBe(true);
            expect(validation.validateCVV('1234')).toBe(true);
            expect(validation.validateCVV('12')).toBe(false);
        });
    });

    describe('validatePaymentForm', () => {
        it('should return empty errors for valid data', () => {
            const validData = {
                cardNumber: '4111111111111111',
                cardHolderName: 'John Doe',
                expirationMonth: '12',
                expirationYear: '25',
                cvv: '123',
                customerEmail: 'john@example.com',
                customerFullName: 'John Doe',
                deliveryAddress: 'Calle Falsa 123, Springfield',
                deliveryCity: 'Springfield',
                deliveryDepartment: 'Bogota'
            };
            const errors = validation.validatePaymentForm(validData);
            expect(Object.keys(errors).length).toBe(0);
        });

        it('should return errors for missing data', () => {
            const invalidData = {
                cardNumber: '',
                cardHolderName: 'JD',
                deliveryAddress: 'Short'
            };
            const errors = validation.validatePaymentForm(invalidData);
            expect(errors.cardNumber).toBeDefined();
            expect(errors.cardHolderName).toBeDefined();
            expect(errors.deliveryAddress).toBeDefined();
        });
    });
});

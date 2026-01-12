import * as formatters from './formatters';

describe('Formatter Utils', () => {
    describe('formatCurrency', () => {
        it('should format numbers to COP', () => {
            const formatted = formatters.formatCurrency(100000);
            // Espacio no breaking o normal según el sistema, buscamos símbolos y números
            expect(formatted).toMatch(/\$/);
            expect(formatted).toMatch(/100.000/);
        });
    });

    describe('formatCardNumber', () => {
        it('should add spaces every 4 digits', () => {
            expect(formatters.formatCardNumber('1234567812345678')).toBe('1234 5678 1234 5678');
        });
    });

    describe('formatCVV', () => {
        it('should limit to 4 digits', () => {
            expect(formatters.formatCVV('12345')).toBe('1234');
        });
    });

    describe('formatTwoDigits', () => {
        it('should limit to 2 digits', () => {
            expect(formatters.formatTwoDigits('123')).toBe('12');
        });
    });
});

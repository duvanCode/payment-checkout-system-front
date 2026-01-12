import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
    it('should render all feature cards', () => {
        render(<Footer />);
        expect(screen.getByText('Envío Gratis')).toBeInTheDocument();
        expect(screen.getByText('Pago Seguro')).toBeInTheDocument();
        expect(screen.getByText('Devoluciones')).toBeInTheDocument();
        expect(screen.getByText('Soporte 24/7')).toBeInTheDocument();
    });

    it('should render brand description and copyright', () => {
        render(<Footer />);
        expect(screen.getByText('Tu tienda de confianza con pagos seguros.')).toBeInTheDocument();
        expect(screen.getByText(/© 2026 TechStore/)).toBeInTheDocument();
    });

    it('should render legal links', () => {
        render(<Footer />);
        expect(screen.getByText('Términos y condiciones')).toBeInTheDocument();
        expect(screen.getByText('Política de privacidad')).toBeInTheDocument();
    });
});

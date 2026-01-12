import { render, screen } from '@testing-library/react';
import LoadingOverlay from './LoadingOverlay';

describe('LoadingOverlay Component', () => {
    it('should render overlay and spinner', () => {
        render(<LoadingOverlay />);
        expect(screen.getByText('Procesando...')).toBeInTheDocument();
        expect(document.querySelector('.spinner')).toBeInTheDocument();
    });
});

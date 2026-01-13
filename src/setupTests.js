import '@testing-library/jest-dom';
import React from 'react';

// Mock axios globally to avoid ESM issues in Jest
jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    create: jest.fn(function () { return this; }),
    interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
    },
}));

// Mock lucide-react globally using simple functional components
jest.mock('lucide-react', () => {
    const React = require('react');
    const mockIcon = (name) => (props) => React.createElement('div', { ...props, 'data-testid': `${name}-icon` });

    return {
        Search: mockIcon('search'),
        Heart: mockIcon('heart'),
        ShoppingCart: mockIcon('shopping-cart'),
        Package: mockIcon('package'),
        Truck: mockIcon('truck'),
        CheckCircle: mockIcon('check-circle'),
        XCircle: mockIcon('x-circle'),
        CreditCard: mockIcon('credit-card'),
        ArrowLeft: mockIcon('arrow-left'),
        ArrowRight: mockIcon('arrow-right'),
        ChevronRight: mockIcon('chevron-right'),
        Star: mockIcon('star'),
        Clock: mockIcon('clock'),
        ShieldCheck: mockIcon('shield-check'),
        Plus: mockIcon('plus'),
        Minus: mockIcon('minus'),
        Trash2: mockIcon('trash'),
        Lock: mockIcon('lock'),
        RefreshCw: mockIcon('refresh-cw'),
        MessageCircle: mockIcon('message-circle'),
        Moon: mockIcon('moon'),
        Sun: mockIcon('sun'),
        Copy: mockIcon('copy'),
        Check: mockIcon('check'),
    };
});


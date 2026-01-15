import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { EventDetails } from '../EventDetails';

// Mock config to ensure consistent tests
jest.mock('@/lib/config', () => ({
    WEDDING_CONFIG: {
        DATE: '2026-06-15',
        TIME: '14:00',
        VENUE_NAME: 'Test Venue',
        GOOGLE_MAPS_URL: 'https://test-maps.com',
    },
}));

describe('EventDetails', () => {
    it('renders event details correctly', () => {
        render(<EventDetails />);

        // Date formatting test (Russian locale might vary slightly by environment, so check parts)
        expect(screen.getByText(/15 июня 2026/i)).toBeInTheDocument();
        expect(screen.getByText('14:00')).toBeInTheDocument();
        expect(screen.getByText('Test Venue')).toBeInTheDocument();
    });

    it('renders map link with correct attributes', () => {
        render(<EventDetails />);

        const link = screen.getByRole('link', { name: /открыть карту/i });
        expect(link).toHaveAttribute('href', 'https://test-maps.com');
        expect(link).toHaveAttribute('target', '_blank');
    });
});

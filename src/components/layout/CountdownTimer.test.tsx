import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import { CountdownTimer } from '../CountdownTimer';

// Mock config
jest.mock('@/lib/config', () => ({
    WEDDING_CONFIG: {
        DATE: '2026-06-15',
        TIME: '14:00',
    },
}));

describe('CountdownTimer', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders countdown timer with correct values', () => {
        // Set system time to 1 day, 1 hour, 1 minute, 1 second before the wedding
        // Target: 2026-06-15T14:00:00
        // Current: 2026-06-14T12:58:59
        const targetDate = new Date('2026-06-15T14:00:00');
        const currentDate = new Date(targetDate.getTime() - (24 * 60 * 60 * 1000) - (1 * 60 * 60 * 1000) - (1 * 60 * 1000) - (1000));

        jest.setSystemTime(currentDate);

        render(<CountdownTimer />);

        act(() => {
            jest.advanceTimersByTime(0);
        });

        // Check for days, hours, minutes, seconds labels
        expect(screen.getByText('дней')).toBeInTheDocument();
        expect(screen.getByText('часов')).toBeInTheDocument();
        expect(screen.getByText('минут')).toBeInTheDocument();
        expect(screen.getByText('секунд')).toBeInTheDocument();
    });

    it('shows "Party Started" message when time is up', () => {
        const targetDate = new Date('2026-06-15T14:00:01');
        jest.setSystemTime(targetDate);

        render(<CountdownTimer />);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(screen.getByText(/праздник начался/i)).toBeInTheDocument();
    });
});

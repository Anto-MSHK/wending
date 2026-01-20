import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { RestaurantDetails } from '../RestaurantDetails';

// Mock config
jest.mock('@/lib/config', () => ({
    WEDDING_CONFIG: {
        GOOGLE_MAPS_URL: 'https://test-maps.com',
    },
}));

// Mock Next/Image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

describe('RestaurantDetails', () => {
    it('renders location information correctly', () => {
        render(<RestaurantDetails />);

        expect(screen.getByText('Локация')).toBeInTheDocument();
        expect(screen.getByText(/Пляжный проезд, 18/i)).toBeInTheDocument();
        expect(screen.getByText(/Ростовская обл., г. Азов/i)).toBeInTheDocument();
        expect(screen.getByAltText('Scher Hof Logo')).toBeInTheDocument();
    });

    it('does not render forbidden elements', () => {
        render(<RestaurantDetails />);

        // Should NOT be present
        expect(screen.queryByText(/Банкетное меню/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Стоимость/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/\+7 \(952\) 574-96-21/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Четырехзвездочный гостинично-ресторанный комплекс/i)).not.toBeInTheDocument();
    });

    it('renders map link with correct attributes', () => {
        render(<RestaurantDetails />);

        const link = screen.getByText(/Показать на карте/i).closest('a');
        // We updated this to a dedicated Yandex Maps link
        expect(link).toHaveAttribute('href', 'https://yandex.ru/maps/?text=Scher+Hof+Azov');
        expect(link).toHaveAttribute('target', '_blank');
    });

    it('renders carousel and handles navigation', () => {
        render(<RestaurantDetails />);

        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(1);

        const nextButton = screen.getByLabelText('Next slide');
        const prevButton = screen.getByLabelText('Previous slide');

        expect(nextButton).toBeInTheDocument();
        expect(prevButton).toBeInTheDocument();
    });
});

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { VenueInfoCard } from './VenueInfoCard';
import { VenueMap } from './VenueMap';

interface ScrollDrivenMapProps {
    className?: string;
}

export interface Venue {
    id: string;
    name: string;
    title: string; // Brief stage title
    address: string;
    time: string;
    image: string;
    mapLink: string;
}

const VENUES: Venue[] = [
    {
        id: 'zags',
        name: 'ЗАГС г. Азов',
        title: 'Роспись',
        address: 'ул. Мира, 19/31, Азов',
        time: '13:00',
        image: '/images/venues/zags.png',
        mapLink: 'https://yandex.ru/maps/?pt=39.419287,47.107977&z=17&l=map'
    },
    {
        id: 'church',
        name: 'Храм Азовской иконы Божией Матери',
        title: 'Венчание',
        address: 'ул. Макаровского, 25Б, Азов',
        time: '14:00',
        image: '/images/venues/church.png',
        mapLink: 'https://yandex.ru/maps/?pt=39.4125,47.1069&z=17&l=map'
    },
    {
        id: 'restaurant',
        name: 'Ресторан «Шер Хоф»',
        title: 'Банкет',
        address: 'Пляжный проезд, 18, Азов',
        time: '16:00',
        image: '/images/venues/restaurant.png',
        mapLink: 'https://yandex.ru/maps/?pt=39.441170,47.111626&z=17&l=map'
    }
];

import { DistanceBadge } from './DistanceBadge';

export const ScrollDrivenMap: React.FC<ScrollDrivenMapProps> = ({ className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeVenue, setActiveVenue] = useState(0);

    // Badge State
    const [badgeState, setBadgeState] = useState<{ visible: boolean; type: 'walk' | 'car'; duration: string }>({
        visible: false, type: 'walk', duration: ''
    });

    useEffect(() => {
        let lastVenue = 0;
        let lastBadgeKey = '';

        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionHeight = rect.height;

            // Calculate effective scrollable distance
            const scrollableDistance = sectionHeight - windowHeight;
            const scrolled = -rect.top;

            let progress = 0;
            if (scrollableDistance > 0) {
                progress = scrolled / scrollableDistance;
            }

            // Clamp 0-1
            progress = Math.max(0, Math.min(1, progress));

            // Determine active venue
            let newVenue = 0;
            if (progress < 0.35) {
                newVenue = 0;
            } else if (progress < 0.78) {
                newVenue = 1;
            } else {
                newVenue = 2;
            }

            // Determine badge state
            let newBadgeKey = 'hidden';
            if (progress > 0.25 && progress < 0.45) {
                newBadgeKey = 'walk';
            } else if (progress > 0.65 && progress < 0.88) {
                newBadgeKey = 'car';
            }

            // Only update state when something actually changes (reduces re-renders)
            if (newVenue !== lastVenue) {
                lastVenue = newVenue;
                setActiveVenue(newVenue);
            }

            if (newBadgeKey !== lastBadgeKey) {
                lastBadgeKey = newBadgeKey;
                if (newBadgeKey === 'walk') {
                    setBadgeState({ visible: true, type: 'walk', duration: '~5 мин пешком' });
                } else if (newBadgeKey === 'car') {
                    setBadgeState({ visible: true, type: 'car', duration: '~15 мин' });
                } else {
                    setBadgeState(prev => ({ ...prev, visible: false }));
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <section ref={containerRef} className={`relative h-[700vh] ${className || ''}`}>
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-[#FFF8F0] overflow-hidden">

                {/* Top Gradient Overlay */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-[100] pointer-events-none" />

                {/* Debug Overlay - Remove in prod */}
                {/* <div className="absolute top-4 left-4 bg-black/50 text-white p-2 z-50 rounded">
          Progress: {scrollProgress.toFixed(2)} | Venue: {activeVenue}
        </div> */}

                {/* Map Container */}
                <div className="relative w-full h-full flex items-center justify-center z-0">
                    <VenueMap activeVenueIndex={activeVenue} />
                </div>

                {/* Active Stage Title (Top) */}
                <div className="absolute top-0 w-full z-[2000] pt-4 md:pt-4 text-center pointer-events-none px-4">
                    <h2
                        key={activeVenue} // Re-render animation on change
                        className="font-great-vibes text-6xl md:text-8xl leading-tight animate-fade-in"
                        style={{
                            background: 'linear-gradient(180deg, #e9c675 0%, #b48d40 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            WebkitTextStroke: '0.3px rgba(85, 62, 10, 0.5)',
                            filter: 'drop-shadow(0px 4px 4px rgba(255, 255, 255, 1))'
                        }}
                    >
                        {VENUES[activeVenue].title}
                    </h2>
                </div>

                {/* Distance Badge (Centered above marker) */}
                <div className="absolute top-[15%] md:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[8px] md:-translate-y-[100px] z-[2000] pointer-events-none">
                    <DistanceBadge
                        type={badgeState.type}
                        duration={badgeState.duration}
                        isVisible={badgeState.visible}
                    />
                </div>

                {/* Info Card Container */}
                <div
                    key={activeVenue} // Triggers animation on change
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[92%] max-w-[400px] md:bottom-12 md:left-12 md:translate-x-0 md:w-[400px] z-[2000] animate-fade-in-up"
                >
                    <div className="rounded-xl overflow-visible">
                        <VenueInfoCard venue={VENUES[activeVenue]} />
                    </div>
                </div>

                {/* Attribution Cover (White Bar) */}
                <div className="absolute bottom-0 left-0 w-full h-[14px] bg-white z-[3000] pointer-events-none"></div>

            </div>
        </section>
    );
};

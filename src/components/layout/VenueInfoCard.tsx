import React from 'react';
import Image from 'next/image';
import { Venue } from './ScrollDrivenMap';

interface VenueInfoCardProps {
    venue: Venue;
}

export const VenueInfoCard: React.FC<VenueInfoCardProps> = ({ venue }) => {
    return (
        <div
            className="bg-white/95 backdrop-blur-md md:rounded-xl overflow-hidden border-t md:border border-[#D4AF76]/30 transition-all duration-500 ease-in-out h-full"
            role="region"
            aria-live="polite"
        >
            {/* Image */}
            <div className="relative h-40 w-full">
                <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 400px"
                />
            </div>

            {/* Content */}
            <div className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                    <span className="text-[#D4AF76] font-bold text-lg font-sans">{venue.time}</span>
                </div>

                <h3 className="text-xl font-serif text-[#3D3D3D] mb-1 leading-tight">
                    {venue.name}
                </h3>

                <p className="text-[#757575] font-sans text-sm mb-3">
                    {venue.address}
                </p>

                <a
                    href={venue.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-1.5 bg-[#D4AF76] text-white rounded-full font-sans font-medium text-sm hover:bg-[#b8935c] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF76]"
                >
                    Показать на карте
                </a>
            </div>
        </div>
    );
};

import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Venue } from './ScrollDrivenMap';

interface VenueInfoCardProps {
    venue: Venue;
}

export const VenueInfoCard: React.FC<VenueInfoCardProps> = ({ venue }) => {
    return (
        <div
            className="transition-all duration-500 ease-in-out h-full"
            role="region"
            aria-live="polite"
        >
            {/* Image - floats above the card with white glow */}
            <div
                className="relative w-full flex justify-center"
                style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.9))' }}
            >
                <Image
                    src={venue.image}
                    alt={venue.name}
                    width={400}
                    height={200}
                    className={
                        venue.image.includes('church')
                            ? "w-auto h-auto max-w-full max-h-[220px] md:max-h-none"
                            : "w-full h-auto"
                    }
                    sizes="(max-width: 640px) 100vw, 400px"
                    loading="lazy"
                />
            </div>

            {/* Content - has shadow */}
            <div
                className="p-4 text-center bg-white rounded-b-xl border border-t-0 border-[#D4AF76]/30"
                style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.25)' }}
            >
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
                    className="inline-flex items-center gap-2 px-6 py-1.5 bg-[#D4AF76] text-white rounded-full font-sans font-medium text-sm hover:bg-[#b8935c] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF76]"
                >
                    <MapPin size={16} />
                    Показать на карте
                </a>
            </div>
        </div>
    );
};

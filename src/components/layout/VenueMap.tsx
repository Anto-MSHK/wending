'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for the actual map content with SSR disabled
const VenueMapContent = dynamic(() => import('./VenueMapContent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-[#FFF8F0] text-[#D4AF76]">
            <span className="font-serif italic">Loading Map...</span>
        </div>
    )
});

interface VenueMapProps {
    activeVenueIndex: number;
}

export const VenueMap: React.FC<VenueMapProps> = ({ activeVenueIndex }) => {
    return (
        <div className="w-full h-full">
            <VenueMapContent activeVenueIndex={activeVenueIndex} />
        </div>
    );
};

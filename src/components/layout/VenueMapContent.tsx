'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { PathOverlay } from './PathOverlay';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface VenueMapContentProps {
    activeVenueIndex: number;
}

const VENUE_COORDS = [
    [47.107977, 39.419287], // ZAGS
    [47.1069, 39.4125], // Church
    [47.111626, 39.441170] // Restaurant
];

const MapController = ({ center }: { center: L.LatLngExpression }) => {
    const map = useMap();

    React.useEffect(() => {
        let target = center;
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            if (Array.isArray(center)) {
                target = [center[0] - 0.002, center[1]];
            }
        }

        map.panTo(target as L.LatLngExpression, {
            animate: true,
            duration: 3.0,
            easeLinearity: 0.25
        });
    }, [map, center]);

    return null;
};

// Custom Gold Pin Icon - module-scope for performance (no re-creation per render)
const createNumberedIcon = (num: number) => new L.DivIcon({
    className: 'custom-venue-icon',
    html: `
        <div class="relative flex flex-col items-center hover:scale-110 transition-transform duration-300">
            <div class="w-10 h-10 bg-[#D4AF76] rounded-full border-2 border-white shadow-lg flex items-center justify-center relative z-10">
                <span class="text-white font-serif font-bold text-lg leading-none">${num}</span>
            </div>
            <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#D4AF76] -mt-[1px]"></div>
            <div class="w-8 h-2 bg-black/20 blur-sm rounded-full mt-1"></div>
        </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
});

const VenueMapContent: React.FC<VenueMapContentProps> = ({ activeVenueIndex }) => {
    // Custom Gold Pin Icon (CSS-based) - defined at module scope for perf
    const center = VENUE_COORDS[activeVenueIndex] as L.LatLngExpression;



    return (
        <div className="w-full h-full">
            <MapContainer
                center={center}
                zoom={16} // Zoom 16: Closer view, usually hides broad "City" labels
                scrollWheelZoom={false}
                zoomControl={false}
                dragging={false}
                doubleClickZoom={false}
                touchZoom={false}
                boxZoom={false}
                keyboard={false}
                className="w-full h-full"
                style={{ height: '100%', width: '100%', background: '#FFF8F0' }}
            >
                {/* CSS Filter: Minimal Warmth, maintain readability */}
                <style dangerouslySetInnerHTML={{
                    __html: `
            .leaflet-layer {
                filter: sepia(0.1) saturate(1.2) contrast(1.05);
            }
            .leaflet-container {
                background: #FFF8F0;
            }
        `}} />

                {/* CartoDB Voyager: Clean, pastel colors, major labels, great for "low-color" but detailed request */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    keepBuffer={120} // Massive buffer to pre-load essentially everything
                    updateWhenIdle={false}
                    updateWhenZooming={false}
                />

                {/* Markers - hidden when path overlay shows heart */}
                {VENUE_COORDS.map((pos, idx) => (
                    <Marker
                        key={idx}
                        position={pos as L.LatLngExpression}
                        icon={createNumberedIcon(idx + 1)}
                        opacity={0}
                        zIndexOffset={idx === activeVenueIndex ? 1000 : 0}
                    />
                ))}

                {/* Controller */}
                <MapController center={center} />

                {/* Path Overlay with Heart - observes scroll directly */}
                <PathOverlay />

            </MapContainer>
        </div>
    );
};

export default VenueMapContent;

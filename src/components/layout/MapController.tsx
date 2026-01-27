'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapControllerProps {
    center: L.LatLngExpression;
}

export const MapController: React.FC<MapControllerProps> = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, 16, {
            animate: true,
            duration: 1.5
        });
    }, [map, center]);

    return null;
};

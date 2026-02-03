'use client';

import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// No props needed - observes scroll directly
interface PathOverlayProps {
    containerSelector?: string;
}

// Venue coordinates
const VENUE_COORDS = {
    zags: { lat: 47.107977, lng: 39.419287 },
    church: { lat: 47.1069, lng: 39.4125 },
    restaurant: { lat: 47.111626, lng: 39.441170 }
};

// Path segments with bezier control points
const PATH_SEGMENTS = [
    {
        from: VENUE_COORDS.zags,
        to: VENUE_COORDS.church,
        controlPoint: { lat: 47.105, lng: 39.412 },
        scrollStart: 0,
        scrollEnd: 0.35
    },
    {
        from: VENUE_COORDS.church,
        to: VENUE_COORDS.restaurant,
        controlPoint: { lat: 47.103, lng: 39.435 },
        scrollStart: 0.35,
        scrollEnd: 0.68
    }
];

interface Point { x: number; y: number; }

function getPointOnQuadraticBezier(p0: Point, p1: Point, p2: Point, t: number): Point {
    const oneMinusT = 1 - t;
    return {
        x: oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
        y: oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y
    };
}

function geoToScreen(map: L.Map, lat: number, lng: number): Point {
    const point = map.latLngToContainerPoint([lat, lng]);
    return { x: point.x, y: point.y };
}

function generateBezierPath(p0: Point, control: Point, p2: Point): string {
    return `M ${p0.x} ${p0.y} Q ${control.x} ${control.y} ${p2.x} ${p2.y}`;
}

export const PathOverlay: React.FC<PathOverlayProps> = () => {
    const map = useMap();
    const path1Ref = useRef<SVGPathElement>(null);
    const path2Ref = useRef<SVGPathElement>(null);
    const heartGroupRef = useRef<SVGGElement>(null);
    const stageTextRef = useRef<SVGTextElement>(null);
    const rafRef = useRef<number>(0);
    const lastStageRef = useRef<string>('1');

    useEffect(() => {
        // Find the scroll container (the 700vh section)
        const scrollContainer = document.querySelector('section.relative.h-\\[700vh\\]') as HTMLElement | null;

        const updatePositions = () => {
            if (!map || !scrollContainer) return;

            // Calculate scroll progress directly
            const rect = scrollContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionHeight = rect.height;
            const scrollableDistance = sectionHeight - windowHeight;
            const scrolled = -rect.top;
            const scrollProgress = Math.max(0, Math.min(1, scrollableDistance > 0 ? scrolled / scrollableDistance : 0));

            // Convert coords to screen points
            const paths = PATH_SEGMENTS.map(seg => ({
                start: geoToScreen(map, seg.from.lat, seg.from.lng),
                control: geoToScreen(map, seg.controlPoint.lat, seg.controlPoint.lng),
                end: geoToScreen(map, seg.to.lat, seg.to.lng)
            }));

            // Update path elements
            // Path 1: fades out as heart approaches church (0.45-0.50)
            // Path 2: fades in as heart leaves church (0.50-0.55)
            if (path1Ref.current) {
                path1Ref.current.setAttribute('d', generateBezierPath(paths[0].start, paths[0].control, paths[0].end));
                const path1Opacity = scrollProgress <= 0 ? 0 :
                    scrollProgress < 0.45 ? 1 :
                        scrollProgress < 0.50 ? 1 - (scrollProgress - 0.45) / 0.05 : 0;
                path1Ref.current.style.opacity = String(path1Opacity);
            }
            if (path2Ref.current) {
                path2Ref.current.setAttribute('d', generateBezierPath(paths[1].start, paths[1].control, paths[1].end));
                const path2Opacity = scrollProgress < 0.50 ? 0 :
                    scrollProgress < 0.55 ? (scrollProgress - 0.50) / 0.05 :
                        scrollProgress < 0.90 ? 1 :
                            scrollProgress < 0.98 ? 1 - (scrollProgress - 0.90) / 0.08 : 0;
                path2Ref.current.style.opacity = String(path2Opacity);
            }

            // Calculate heart position:
            // Stage 1 (0 → 0.35): heart 0% → 25% on path 1
            // Transition 1→2 (0.35 → 0.50): heart 25% → 100% on path 1
            // Stage 2 (0.50 → 0.78): heart 0% → 10% on path 2 (very slow, longer scroll)
            // Transition 2→3 fast (0.78 → 0.88): heart 10% → 90% on path 2 (fast burst)
            // Transition 2→3 slow (0.88 → 0.94): heart 90% → 100% on path 2 (normal)
            // Stage 3 (0.94 → 1.0): heart at restaurant

            let heartPosition: Point;
            if (scrollProgress <= 0) {
                heartPosition = paths[0].start;
            } else if (scrollProgress < 0.35) {
                // Stage 1: heart travels 0% → 25% of path 1
                const t = (scrollProgress / 0.35) * 0.25;
                heartPosition = getPointOnQuadraticBezier(paths[0].start, paths[0].control, paths[0].end, t);
            } else if (scrollProgress < 0.50) {
                // Transition 1→2: heart travels 25% → 100% of path 1
                const t = 0.25 + ((scrollProgress - 0.35) / 0.15) * 0.75;
                heartPosition = getPointOnQuadraticBezier(paths[0].start, paths[0].control, paths[0].end, t);
            } else if (scrollProgress < 0.78) {
                // Stage 2: heart travels 0% → 10% of path 2 (very slow, longer stage)
                const t = ((scrollProgress - 0.50) / 0.28) * 0.10;
                heartPosition = getPointOnQuadraticBezier(paths[1].start, paths[1].control, paths[1].end, t);
            } else if (scrollProgress < 0.88) {
                // Transition 2→3 FAST: heart travels 10% → 90% of path 2 (80% in short scroll)
                const t = 0.10 + ((scrollProgress - 0.78) / 0.10) * 0.80;
                heartPosition = getPointOnQuadraticBezier(paths[1].start, paths[1].control, paths[1].end, t);
            } else if (scrollProgress < 0.94) {
                // Transition 2→3 SLOW: heart travels 90% → 100% of path 2 (normal speed)
                const t = 0.90 + ((scrollProgress - 0.88) / 0.06) * 0.10;
                heartPosition = getPointOnQuadraticBezier(paths[1].start, paths[1].control, paths[1].end, t);
            } else {
                heartPosition = paths[1].end;
            }

            if (heartGroupRef.current) {
                heartGroupRef.current.setAttribute('transform', `translate(${heartPosition.x}, ${heartPosition.y})`);
            }

            // Update stage number text with smooth transition
            // Stages: 1 (0-0.50), 2 (0.50-0.94), 3 (0.94-0.97), ∞ (0.97+)
            if (stageTextRef.current) {
                let stageText = '1';
                if (scrollProgress >= 0.97) {
                    stageText = '∞';
                } else if (scrollProgress >= 0.94) {
                    stageText = '3';
                } else if (scrollProgress >= 0.50) {
                    stageText = '2';
                }

                // Animate only when stage changes
                if (stageText !== lastStageRef.current) {
                    lastStageRef.current = stageText;
                    // Fade out
                    stageTextRef.current.style.opacity = '0';
                    // Fade in with new text after delay
                    setTimeout(() => {
                        if (stageTextRef.current) {
                            stageTextRef.current.textContent = stageText;
                            stageTextRef.current.style.opacity = '1';
                        }
                    }, 150);
                }
            }
        };

        // Scroll handler with RAF throttling
        const handleScroll = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updatePositions);
        };

        // Initial update
        updatePositions();

        // Subscribe to scroll and map events
        window.addEventListener('scroll', handleScroll, { passive: true });
        map.on('move', updatePositions);
        map.on('zoom', updatePositions);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('scroll', handleScroll);
            map.off('move', updatePositions);
            map.off('zoom', updatePositions);
        };
    }, [map]);

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-[2000]"
            aria-hidden="true"
            style={{ overflow: 'visible' }}
        >
            <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D4AF76" />
                    <stop offset="100%" stopColor="#e9c675" />
                </linearGradient>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F8B4C0" />
                    <stop offset="100%" stopColor="#D4AF76" />
                </linearGradient>
                <filter id="shadowBlur" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="3" />
                </filter>
            </defs>

            {/* Paths */}
            <g id="paths-layer">
                <path
                    ref={path1Ref}
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ opacity: 0, transition: 'opacity 0.5s ease-out' }}
                />
                <path
                    ref={path2Ref}
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ opacity: 0, transition: 'opacity 0.5s ease-out' }}
                />
            </g>

            {/* Heart */}
            <g ref={heartGroupRef} id="heart-layer">
                <ellipse cx="0" cy="0" rx="14" ry="6" fill="rgba(0,0,0,0.3)" filter="url(#shadowBlur)" />
                <g transform="translate(0, -32)">
                    <path
                        d="M0 -10 C-12 -24 -30 -12 -24 6 C-22 14 0 26 0 26 C0 26 22 14 24 6 C30 -12 12 -24 0 -10 Z"
                        fill="url(#heartGradient)"
                        stroke="#fff"
                        strokeWidth="2.5"
                    />
                    {/* Stage number inside heart */}
                    <text
                        ref={stageTextRef}
                        x="0"
                        y="6"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#fff"
                        fontSize="18"
                        fontWeight="bold"
                        fontFamily="'Nunito', sans-serif"
                        style={{
                            transition: 'opacity 0.15s ease-in-out',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}
                    >
                        1
                    </text>
                </g>
            </g>
        </svg>
    );
};

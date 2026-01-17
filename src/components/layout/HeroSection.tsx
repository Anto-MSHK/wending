import React from 'react';
import Image from 'next/image';

/**
 * Full-bleed hero section with couple photo, vertical date, and names
 * Inspired by elegant wedding invitation design
 */
export function HeroSection() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-white">
            {/* Main Photo - Full Width */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero-photo.jpg"
                    alt="Антон и Ксения"
                    fill
                    className="object-cover object-center animate-fade-in-image"
                    priority
                    sizes="100vw"
                />
                {/* Subtle overlay for text readability */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Vertical Date - Always on the right */}
            <div className="absolute right-4 md:right-8 lg:right-16 top-[40%] -translate-y-1/2 z-20 flex flex-col items-center">
                {/* Soft white diffused background */}
                <div className="absolute -inset-1 md:-inset-2 lg:-inset-4 bg-white/80 rounded-full blur-xl" />
                <div
                    className="relative text-6xl md:text-7xl lg:text-8xl xl:text-9xl pl-4 overflow-visible"
                    style={{
                        fontFamily: '"Dynalight", cursive',
                        fontWeight: 400,
                    }}
                >
                    <span
                        className="block mb-1 md:mb-2 animate-fade-in-up-delay-1"
                        style={{
                            textIndent: '0.1em',
                            background: 'linear-gradient(180deg, #e9c675 0%, #b48d40 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            WebkitTextStroke: '0.3px rgba(85, 62, 10, 0.5)',
                            textShadow: '2px 2px 8px rgba(85, 62, 10, 0.3)'
                        }}
                    >08</span>
                    <span
                        className="block mb-1 md:mb-2 animate-fade-in-up-delay-2"
                        style={{
                            textIndent: '0.1em',
                            background: 'linear-gradient(180deg, #e9c675 0%, #b48d40 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            WebkitTextStroke: '0.3px rgba(85, 62, 10, 0.5)',
                            textShadow: '2px 2px 8px rgba(85, 62, 10, 0.3)'
                        }}
                    >05</span>
                    <span
                        className="block animate-fade-in-up-delay-3"
                        style={{
                            textIndent: '0.1em',
                            background: 'linear-gradient(180deg, #e9c675 0%, #b48d40 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            WebkitTextStroke: '0.3px rgba(85, 62, 10, 0.5)',
                            textShadow: '2px 2px 8px rgba(85, 62, 10, 0.3)'
                        }}
                    >26</span>
                </div>
            </div>

            {/* Bottom gradient for names contrast */}
            <div className="absolute bottom-0 left-0 right-0 h-[45vh] bg-gradient-to-t from-white via-white/90 to-transparent z-10" />

            {/* Names Image - Bottom Center */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-20 w-[320px] md:w-[480px] lg:w-[600px] animate-fade-in-scale">
                <Image
                    src="/images/names.png"
                    alt="Антон и Ксения"
                    width={500}
                    height={150}
                    className="w-full h-auto drop-shadow-[0_1px_2px_#e9c675]"
                    priority
                />
            </div>

            {/* Decorative scroll indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:block motion-safe:animate-bounce">
                <svg
                    className="w-6 h-6 text-charcoal/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}

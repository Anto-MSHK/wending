import React from 'react';
import Image from 'next/image';

/**
 * Full-bleed hero section with couple photo, vertical date, and names
 * Inspired by elegant wedding invitation design
 */
export function HeroSection() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-white">
            {/* Main Photo - Centered on Desktop with Gradients */}
            <div className="absolute inset-x-0 top-0 bottom-0 md:w-3/4 lg:w-3/5 mx-auto">
                <Image
                    src="/images/hero-photo-optimized.jpg"
                    alt="Антон и Ксения"
                    fill
                    className="object-cover object-[center_35%] animate-fade-in-image"
                    priority
                    sizes="(max-width: 768px) 100vw, 80vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6NT04Mj4xNUFHSklQTk9iZWJjOEpLb3Jybmb/2wBDARUXFx4aHR4eHWZCMkJmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmb/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAME/8QAIBAAAgEEAgMBAAAAAAAAAAAAAQIDAAQRITFBUWFxof/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AyWqypamKRgDnOMf1TAywYEZz+1KUH//Z"
                />

                {/* Horizontal Gradient Overlays for smooth edges on Desktop */}
                {/* Left Gradient */}
                <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-white to-transparent z-10 hidden md:block" />
                {/* Right Gradient */}
                <div className="absolute inset-y-0 right-0 w-32 md:w-48 bg-gradient-to-l from-white to-transparent z-10 hidden md:block" />

                {/* Subtle overlay for text readability */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Vertical Date - Always on the right */}
            <div className="absolute right-4 md:right-8 lg:right-16 top-[40%] -translate-y-1/2 z-20 flex flex-col items-center">
                {/* Soft white diffused background for readability against image/gradient */}
                <div className="absolute -inset-1 md:-inset-2 lg:-inset-4 bg-white/80 rounded-full blur-xl" />
                <div
                    className="relative text-6xl md:text-7xl lg:text-8xl xl:text-9xl overflow-visible"
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
            <div className="absolute bottom-0 left-0 right-0 mx-auto w-full md:w-3/4 lg:w-3/5 h-[45vh] bg-gradient-to-t from-white via-white/90 to-transparent z-10" />

            {/* Names Image - Bottom Center */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-20 w-[280px] md:w-[350px] lg:w-[400px] xl:w-[400px] max-w-[600px] animate-fade-in-scale">
                <Image
                    src="/images/names.webp"
                    alt="Антон и Ксения"
                    width={500}
                    height={150}
                    className="w-full h-auto drop-shadow-[0_1px_2px_#e9c675]"
                    priority
                />
            </div>

        </section>
    );
}

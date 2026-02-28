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
                    src="/images/hero-photo_new.jpg"
                    alt="Антон и Ксения"
                    fill
                    className="object-cover object-[25%_35%] md:object-[center_35%] animate-fade-in-image"
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
            <div className="absolute right-8 md:right-16 lg:right-24 top-[65%] -translate-y-1/2 z-20 flex flex-col items-center">
                <div
                    className="relative text-6xl md:text-7xl lg:text-8xl xl:text-9xl overflow-visible text-center leading-[0.9]"
                    style={{
                        fontFamily: '"Poiret One", cursive',
                        fontWeight: 400,
                        color: '#ffffff',
                    }}
                >
                    <span className="block animate-fade-in-up-delay-1">
                        <span className="inline-block w-[0.75em] text-left mr-0" style={{ transform: 'scaleX(0.78)', transformOrigin: 'left' }}>0</span>
                        <span className="inline-block w-[0.65em] text-left">8</span>
                    </span>
                    <span className="block animate-fade-in-up-delay-2">
                        <span className="inline-block w-[0.75em] text-left mr-0" style={{ transform: 'scaleX(0.78)', transformOrigin: 'left' }}>0</span>
                        <span className="inline-block w-[0.65em] text-left">5</span>
                    </span>
                    <span className="block animate-fade-in-up-delay-3">
                        <span className="inline-block w-[0.75em] text-left mr-0">2</span>
                        <span className="inline-block w-[0.65em] text-left">6</span>
                    </span>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 mx-auto w-full md:w-3/4 lg:w-3/5 h-[25vh] bg-gradient-to-t from-black via-black/30 to-transparent z-10" />

            {/* Names Image - Bottom Center */}
            <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20 w-[350px] md:w-[450px] lg:w-[500px] xl:w-[550px] max-w-[600px] animate-fade-in-scale">
                <Image
                    src="/images/names_new.png"
                    alt="Антон и Ксения"
                    width={500}
                    height={150}
                    className="w-full h-auto"
                    priority
                />
            </div>

        </section>
    );
}

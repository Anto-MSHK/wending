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

                {/* Decorative Frame - sits above the names */}
                <div className="absolute top-4 md:top-8 inset-x-4 md:inset-x-8 bottom-[18vh] md:bottom-[16vh] z-20 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/frame.svg"
                        alt="Decorative frame"
                        className="w-full h-full drop-shadow-sm"
                    />
                </div>

                {/* Horizontal Gradient Overlays for smooth edges on Desktop */}
                {/* Left Gradient */}
                <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-white to-transparent z-10 hidden md:block" />
                {/* Right Gradient */}
                <div className="absolute inset-y-0 right-0 w-32 md:w-48 bg-gradient-to-l from-white to-transparent z-10 hidden md:block" />

                {/* Subtle overlay for text readability */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Vertical Date - inside the frame, bottom-right area */}
            <div className="absolute right-10 md:right-20 lg:right-28 xl:right-36 bottom-[22vh] md:bottom-[22vh] z-30 flex flex-col items-center">
                <div
                    className="relative text-[4.55rem] sm:text-[5.85rem] md:text-[6.5rem] lg:text-[7.8rem] xl:text-[9.1rem] overflow-visible text-center leading-[0.9]"
                    style={{
                        fontFamily: '"Poiret One", cursive',
                        fontWeight: 400,
                        color: '#ffffff',
                        textShadow: '0 2px 10px rgba(0,0,0,0.1)',
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

            {/* Names Text - Below the frame */}
            <div className="absolute bottom-[6vh] md:bottom-[4vh] left-1/2 -translate-x-1/2 z-20 w-full animate-fade-in-scale flex flex-col items-center">
                <div
                    className="text-[3rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.8] md:leading-[0.85] text-center text-white font-semibold"
                    style={{ fontFamily: '"Playfair Display SC", serif', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                >
                    <div>
                        АНТОН <span style={{ fontFamily: '"PlayfairDisplaySC-Regular", serif', fontSize: '0.6em', fontWeight: 'normal', display: 'inline-block', transform: 'translate(-9px, 0px)' }}>&</span>
                    </div>
                    <div className="ml-12 md:ml-20">КСЕНИЯ</div>
                </div>
            </div>

        </section>
    );
}

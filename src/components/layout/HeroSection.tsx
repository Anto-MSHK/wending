import React from 'react';

interface HeroSectionProps {
    guestName: string;
}

/**
 * Full-bleed hero section with personalized greeting
 * AC: 3, 5 - Display guest name with themed visual design
 */
export function HeroSection({ guestName }: HeroSectionProps) {
    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Hero Image Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10" />

            {/* Placeholder for hero photo - will be replaced with actual image */}
            <div className="absolute inset-0 bg-cream" />

            {/* Text Overlay */}
            <div className="relative z-20 flex h-full items-center justify-center px-6">
                <div className="text-center motion-safe:animate-fade-in">
                    {/* Personalized Greeting */}
                    <h1 className="font-cormorant text-[1.75rem] italic text-charcoal mb-6">
                        Дорогой/ая {guestName}
                    </h1>

                    {/* Main Heading */}
                    <h2 className="font-cormorant text-[2.5rem] text-charcoal mb-4">
                        Мы приглашаем вас разделить наш особенный день
                    </h2>

                    {/* Decorative Line */}
                    <div className="mx-auto w-24 h-0.5 bg-gold mb-6" />
                </div>
            </div>
        </section>
    );
}

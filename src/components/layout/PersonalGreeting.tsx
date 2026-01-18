import React from 'react';

interface PersonalGreetingProps {
    guestName: string;
    isFamily?: boolean;
}

/**
 * Personal greeting section displayed below the hero
 * Shows personalized invitation message to the guest
 */
export function PersonalGreeting({ guestName, isFamily = false }: PersonalGreetingProps) {
    return (
        <section className="bg-white min-h-screen flex flex-col justify-center py-22 md:py-32 px-6 relative">
            {/* Top Divider - Absolute */}
            <img
                src="/images/divider.png"
                alt="divider"
                className="absolute top-0 left-0 mt-4 w-full h-auto max-h-40 object-contain pointer-events-none opacity-80 scale-y-[0.85] origin-top"
            />

            <div className="max-w-2xl mx-auto text-center motion-safe:animate-fade-in relative z-10">
                {/* Greeting Header */}
                <div className="mb-4 mt-4">
                    <p className="font-nunito font-bold text-xl md:text-2xl text-charcoal/60 mb-2 uppercase tracking-widest">
                        {isFamily ? 'ДОРОГАЯ СЕМЬЯ' : 'Дорогой/ая'}
                    </p>
                    <h2 className="font-great-vibes text-6xl md:text-7xl lg:text-8xl text-gold leading-tight drop-shadow-sm">
                        {guestName}
                    </h2>
                </div>

                {/* Main Text */}
                <div className="font-nunito font-medium text-lg md:text-xl text-charcoal leading-relaxed space-y-4">
                    <p>
                        Хотим, чтобы вы разделили с нами
                        <br className="hidden md:block" />
                        {" "}радость и были на торжестве в самый лучший
                        <br className="hidden md:block" />
                        {" "}и трогательный день в нашей жизни!
                    </p>

                    <p className="text-3xl md:text-4xl text-gold font-bold tracking-widest my-4 font-cormorant">
                        08.05.2026
                    </p>

                    <p className="mb-6">
                        Мы будем безумно рады видеть вас
                        <br className="hidden md:block" />
                        {" "}в кругу наших гостей!
                    </p>
                </div>
            </div>

            {/* Bottom Divider - Mirrored & Absolute */}
            <img
                src="/images/divider.png"
                alt="divider"
                className="absolute bottom-0 left-0 mb-4 w-full h-auto max-h-40 object-contain pointer-events-none opacity-80 scale-y-[-0.85]"
            />
        </section>
    );
}

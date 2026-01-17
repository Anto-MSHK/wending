import React from 'react';

interface PersonalGreetingProps {
    guestName: string;
}

/**
 * Personal greeting section displayed below the hero
 * Shows personalized invitation message to the guest
 */
export function PersonalGreeting({ guestName }: PersonalGreetingProps) {
    return (
        <section className="bg-cream py-16 md:py-24 px-6">
            <div className="max-w-2xl mx-auto text-center motion-safe:animate-fade-in">
                {/* Decorative Line */}
                <div className="mx-auto w-16 h-0.5 bg-gold mb-10" />

                {/* Greeting Header */}
                <div className="mb-12">
                    <p className="font-cormorant text-2xl md:text-3xl text-charcoal/60 mb-2 italic">
                        Дорогой/ая
                    </p>
                    <h2 className="font-dynalight text-6xl md:text-7xl lg:text-8xl text-gold leading-tight drop-shadow-sm">
                        {guestName}
                    </h2>
                </div>

                {/* Main Text */}
                <div className="font-cormorant text-xl md:text-2xl text-charcoal leading-relaxed space-y-8">
                    <p>
                        Хотим, чтобы вы разделили с нами
                        <br className="hidden md:block" />
                        радость и были на торжестве в самый лучший
                        <br className="hidden md:block" />
                        и трогательный день в нашей жизни!
                    </p>

                    <p className="text-3xl md:text-4xl text-gold font-bold tracking-widest my-8">
                        08.05.2026
                    </p>

                    <p>
                        Мы будем безумно рады видеть вас
                        <br className="hidden md:block" />
                        в кругу наших гостей!
                    </p>
                </div>

                {/* Decorative Line */}
                <div className="mx-auto w-16 h-0.5 bg-gold mt-12" />
            </div>
        </section>
    );
}

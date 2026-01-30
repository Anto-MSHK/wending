"use client";

import { updateGuestRsvp } from "@/actions/rsvp.actions";
import { RSVPSection } from "@/components/rsvp/RSVPSection";
import { GuestForRSVP } from "@/components/rsvp/types";
import { WEDDING_CONFIG } from "@/lib/config";

interface PersonalGreetingProps {
    guestName: string;
    isFamily?: boolean;
    guestGender?: 'male' | 'female';
    guests: GuestForRSVP[];
    householdName: string;
    householdId: string;
    onRSVPUpdate?: (guestId: string, isAttending: boolean) => void;
}

/**
 * Personal greeting section displayed below the hero
 * Shows personalized invitation message to the guest and RSVP form
 */
export function PersonalGreeting({
    guestName,
    isFamily = false,
    guestGender,
    guests,
    householdName,
    householdId,
    onRSVPUpdate,
}: PersonalGreetingProps) {
    return (
        <section className="bg-white flex flex-col pt-32 pb-10 md:pt-38 md:pb-12 px-6 relative overflow-visible">
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
                        {isFamily ? 'ДОРОГАЯ СЕМЬЯ' : (guestGender === 'female' ? 'Дорогая' : 'Дорогой')}
                    </p>
                    <h2
                        className="font-great-vibes text-6xl md:text-7xl lg:text-8xl leading-tight"
                        style={{
                            background: 'linear-gradient(180deg, #e9c675 0%, #b48d40 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            WebkitTextStroke: '0.3px rgba(85, 62, 10, 0.5)',
                            textShadow: '2px 2px 8px rgba(85, 62, 10, 0.3)'
                        }}
                    >
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

                    <p
                        className="text-4xl md:text-5xl font-bold tracking-widest my-4"
                        style={{
                            fontFamily: '"Dynalight", cursive',
                            background: 'linear-gradient(180deg, #e9c675 0%, #b48d40 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            WebkitTextStroke: '0px transparent',
                            textShadow: '1px 1px 6px rgba(85, 62, 10, 0.25)'
                        }}
                    >
                        {WEDDING_CONFIG.DATE.split('-').reverse().join('.')}
                    </p>

                    <p className="mb-2">
                        Мы будем безумно рады видеть вас
                        <br className="hidden md:block" />
                        {" "}в кругу наших гостей!
                    </p>
                </div>

                {/* RSVP Section */}
                <RSVPSection
                    guests={guests}
                    householdName={householdName}
                    householdId={householdId}
                    showNames={isFamily}
                    onUpdate={onRSVPUpdate}
                />
            </div>
        </section>
    );
}




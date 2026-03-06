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
        <section className="bg-white flex flex-col pt-12 pb-10 md:pt-38 md:pb-12 px-6 relative overflow-visible">


            <div className="max-w-2xl mx-auto text-center motion-safe:animate-fade-in relative z-10">
                {/* Greeting Header */}
                <div className="mb-4 mt-4">
                    <p className="font-nunito font-bold text-xl md:text-2xl text-charcoal/60 mb-2 uppercase tracking-widest">
                        {isFamily
                            ? (householdName.trim() ? 'ДОРОГАЯ СЕМЬЯ' : 'ДОРОГИЕ')
                            : (guestGender === 'female' ? 'Дорогая' : 'Дорогой')}
                    </p>
                    <h2
                        className="font-great-vibes text-6xl md:text-7xl lg:text-8xl leading-tight text-gold"
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
                        className="text-6xl md:text-7xl my-4 text-gold tracking-normal"
                        style={{ fontFamily: '"Great Vibes", cursive' }}
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




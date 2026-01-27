import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { WEDDING_CONFIG } from '@/lib/config';

export function EventDetails() {
    const { DATE, TIME, VENUE_NAME, GOOGLE_MAPS_URL } = WEDDING_CONFIG;

    // Format date for display (Russian locale)
    const eventDate = new Date(DATE);
    const formattedDate = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(eventDate);

    return (
        <section className="py-12 bg-cream text-center">
            <div className="max-w-md mx-auto p-6 border-2 border-gold rounded-lg shadow-soft bg-cream">
                <h2 className="text-2xl font-serif text-charcoal mb-6 flex items-center justify-center gap-3">
                    <Calendar className="w-6 h-6 text-gold" />
                    Детали события
                </h2>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-center gap-3 text-lg font-medium text-charcoal">
                        <Calendar className="w-5 h-5 text-gold/60" />
                        <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-lg font-medium text-charcoal">
                        <Clock className="w-5 h-5 text-gold/60" />
                        <span>{TIME}</span>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-lg font-medium text-charcoal">
                        <MapPin className="w-5 h-5 text-gold/60" />
                        <span>{VENUE_NAME}</span>
                    </div>
                </div>

                <Link
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-white transition-colors duration-300 rounded-full font-serif text-lg"
                >
                    <MapPin className="w-5 h-5" />
                    <span>Открыть карту</span>
                </Link>
            </div>
        </section>
    );
}

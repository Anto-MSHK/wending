'use client';

import { useEffect, useState } from 'react';
import { PartyPopper } from 'lucide-react';
import { WEDDING_CONFIG } from '@/lib/config';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(`${WEDDING_CONFIG.DATE}T${WEDDING_CONFIG.TIME}`) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
                setHasStarted(false);
            } else {
                setTimeLeft(null);
                setHasStarted(true);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    if (hasStarted) {
        return (
            <section className="py-12 text-center">
                <h2 className="text-3xl font-serif text-gold animate-pulse flex items-center justify-center gap-2">
                    <PartyPopper className="w-8 h-8" />
                    Праздник начался!
                </h2>
            </section>
        );
    }

    if (!timeLeft) {
        return null; // Prevent hydration mismatch or layout shift
    }

    const { days, hours, minutes, seconds } = timeLeft;

    return (
        <section className="pt-6 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                <h2
                    className="font-great-vibes text-5xl md:text-7xl leading-tight text-center mb-8"
                    style={{
                        background: 'linear-gradient(180deg, #e9c675 0%, #b48d40 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        WebkitTextStroke: '0.3px rgba(85, 62, 10, 0.5)',
                        filter: 'drop-shadow(0px 4px 4px rgba(255, 255, 255, 1))'
                    }}
                >
                    Увидимся через...
                </h2>

                <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                    <TimeUnit value={days} label="дней" />
                    <TimeUnit value={hours} label="часов" />
                    <TimeUnit value={minutes} label="минут" />
                    <TimeUnit value={seconds} label="секунд" />
                </div>
            </div>
        </section>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center p-4 border border-gold/30 rounded-lg bg-cream">
            <span className="text-3xl md:text-4xl font-serif font-bold text-charcoal tabular-nums">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-sm md:text-base text-gray-500 mt-1">{label}</span>
        </div>
    );
}

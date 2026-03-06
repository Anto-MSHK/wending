'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PartyPopper } from 'lucide-react';
import { WEDDING_CONFIG } from '@/lib/config';

/**
 * Russian pluralization: picks the correct word form based on the number.
 * forms[0] = 1 (день), forms[1] = 2-4 (дня), forms[2] = 5-20 (дней)
 */
function pluralize(n: number, forms: [string, string, string]): string {
    const abs = Math.abs(n) % 100;
    const lastDigit = abs % 10;
    if (abs >= 11 && abs <= 19) return forms[2];
    if (lastDigit === 1) return forms[0];
    if (lastDigit >= 2 && lastDigit <= 4) return forms[1];
    return forms[2];
}

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
        const timer = setInterval(calculateTimeLeft, 60000);

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
        return null;
    }

    const { days, hours, minutes } = timeLeft;

    return (
        <section className="relative w-full overflow-hidden bg-white">
            {/* Hands photo background */}
            <div className="relative w-full" style={{ minHeight: '55vh' }}>
                <Image
                    src="/images/hands.webp"
                    alt="Руки"
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                    quality={90}
                />

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Top gradient fade */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b to-transparent z-10" style={{ height: '50px', background: 'linear-gradient(to bottom, #1a1a1a, transparent)' }} />

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t to-transparent z-10" style={{ height: '50px', background: 'linear-gradient(to top, #1a1a1a, transparent)' }} />

                {/* Content overlay */}
                <div className="relative z-20 flex flex-col items-center justify-center h-full py-20 md:py-28 px-4"
                    style={{ minHeight: '47vh' }}>
                    {/* Title */}
                    <h2
                        className="font-great-vibes text-5xl md:text-7xl leading-tight text-center mb-10 md:mb-14"
                        style={{
                            color: '#fff',
                            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                        }}
                    >
                        Увидимся через...
                    </h2>

                    {/* Countdown grid */}
                    <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-md mx-auto w-full">
                        <TimeUnit value={days} label={pluralize(days, ['день', 'дня', 'дней'])} />
                        <TimeUnit value={hours} label={pluralize(hours, ['час', 'часа', 'часов'])} />
                        <TimeUnit value={minutes} label={pluralize(minutes, ['минута', 'минуты', 'минут'])} />
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            {/* Number */}
            <span
                className="text-5xl md:text-6xl lg:text-7xl tabular-nums font-light tracking-tight"
                style={{
                    fontFamily: '"Poiret One", cursive',
                    color: '#fff',
                    textShadow: '0 2px 15px rgba(0,0,0,0.5)',
                }}
            >
                {value}
            </span>
            {/* Thin separator */}
            <div
                className="w-8 md:w-10 h-px my-2 md:my-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
            />
            {/* Label */}
            <span
                className="text-xs md:text-sm tracking-[0.2em] uppercase font-semibold"
                style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontFamily: '"Poiret One", cursive',
                    letterSpacing: '0.15em',
                }}
            >
                {label}
            </span>
        </div>
    );
}

"use client";

import React from "react";
import Image from "next/image";

export function QuoteSection() {
    return (
        <section className="relative w-full overflow-hidden bg-white lg:hidden">
            <div className="relative w-full" style={{ minHeight: '65vh' }}>
                {/* Photo */}
                <Image
                    src="/images/DSC_7709.jpg"
                    alt="Антон и Ксения"
                    fill
                    className="object-cover object-center"
                    loading="lazy"
                    sizes="100vw"
                />

                {/* Dark overlay for text readability (same as CountdownTimer) */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Top gradient fade */}
                <div className="absolute top-0 left-0 right-0 z-10" style={{ height: '50px', background: 'linear-gradient(to bottom, #1a1a1a, transparent)' }} />

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: '50px', background: 'linear-gradient(to top, #1a1a1a, transparent)' }} />

                {/* Content overlay — centered at bottom */}
                <div className="relative z-20 flex flex-col items-center justify-end h-full px-8 pb-14 pt-20" style={{ minHeight: '65vh' }}>
                    <div className="flex flex-col items-center text-center">
                        {/* Quote text */}
                        <p
                            className="font-great-vibes text-4xl md:text-5xl leading-tight text-center font-light"
                            style={{
                                color: '#fff',
                                textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                            }}
                        >
                            «Ищите любовь и
                            копите любовь в сердцах ваших»
                        </p>

                        {/* Decorative line */}
                        <div
                            className="w-10 h-px my-5"
                            style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
                        />

                        {/* Author */}
                        <p
                            className="text-base md:text-lg tracking-[0.15em] uppercase"
                            style={{
                                fontFamily: '"Poiret One", cursive',
                                color: 'rgba(255,255,255,0.8)',
                                textShadow: '0 1px 10px rgba(0,0,0,0.3)',
                            }}
                        >
                            Ф.М. Достоевский
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

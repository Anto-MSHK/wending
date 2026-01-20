'use client';

import { useState, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import { WEDDING_CONFIG } from '@/lib/config';

export function RestaurantDetails() {
    const images = [
        { src: '/restaurant/res_1.jpg', alt: 'Интерьер Scher Hof 1' },
        { src: '/restaurant/res_2.jpeg', alt: 'Интерьер Scher Hof 2' },
        { src: '/restaurant/res_3.jpg', alt: 'Интерьер Scher Hof 3' },
        { src: '/restaurant/res_4.png', alt: 'Интерьер Scher Hof 4' },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    // Swipe handlers
    const handleTouchStart = (e: TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            nextSlide(); // Swipe Left
        } else if (distance < -minSwipeDistance) {
            prevSlide(); // Swipe Right
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    return (
        <section className="relative bg-cream">
            {/* Top Gradient Transition */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />

            <div className="relative max-w-2xl mx-auto px-6 text-center z-20 pb-6">
                {/* 1. Title */}
                <h2
                    className="font-great-vibes text-6xl md:text-7xl lg:text-8xl text-charcoal mb-6 leading-tight"
                    style={{
                        background: 'linear-gradient(180deg, #e9c675 0%, #b48d40 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        WebkitTextStroke: '0.3px rgba(85, 62, 10, 0.5)',
                        textShadow: '2px 2px 8px rgba(85, 62, 10, 0.3)',
                        marginLeft: '-0.5rem'
                    }}
                >
                    Локация
                </h2>

                {/* 2. Carousel */}
                <div
                    className="relative w-full aspect-video rounded-xl overflow-hidden shadow-soft border border-gold/20 group mb-4"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Slides */}
                    <div
                        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {images.map((img, idx) => (
                            <div key={idx} className="relative min-w-full h-full">
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 800px"
                                />
                                <div className="absolute inset-0 bg-black/10" />
                            </div>
                        ))}
                    </div>

                    {/* Logo - Bottom Left */}
                    <div className="absolute bottom-1 left-4 z-20">
                        <div className="relative w-32 h-16 md:w-48 md:h-24 opacity-90 transition-opacity">
                            <Image
                                src="/restaurant/logo-scherhof.png"
                                alt="Scher Hof Logo"
                                fill
                                className="object-contain object-left-bottom drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
                            />
                        </div>
                    </div>

                    {/* Navigation Buttons (Hidden on mobile usually, but kept for desktop accessibility) */}
                    <button
                        onClick={prevSlide}
                        className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gold p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                        aria-label="Previous slide"
                    >
                        ❮
                    </button>
                    <button
                        onClick={nextSlide}
                        className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gold p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                        aria-label="Next slide"
                    >
                        ❯
                    </button>

                    {/* Dots - Bottom Right */}
                    <div className="absolute bottom-4 right-4 flex gap-2 z-20 items-end">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2 rounded-full transition-all shadow-sm ${currentSlide === idx ? 'bg-white w-6' : 'bg-white/60 hover:bg-white/80 w-2'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* 3. Address */}
                <div className="font-nunito text-charcoal/90 mb-6 font-medium text-lg leading-relaxed">
                    <p className="text-xl font-bold">
                        Ростовская область, город Азов
                    </p>
                    <p className="text-charcoal/80">
                        Пляжный проезд, 18
                    </p>
                </div>

                {/* 4. Map Button */}
                <a
                    href="https://yandex.ru/maps/?text=Scher+Hof+Azov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-gold text-white rounded-full hover:bg-gold/90 transition-all shadow-md hover:shadow-lg font-nunito font-bold text-lg tracking-wide transform hover:-translate-y-0.5"
                >
                    Показать на карте
                </a>
            </div>
        </section>
    );
}

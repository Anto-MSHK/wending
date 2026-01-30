"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";

export function CalendarSection() {
    const handleAddToCalendar = () => {
        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Wedding//Anton-Ksenia//RU",
            "BEGIN:VEVENT",
            `UID:${Date.now()}@wedding.com`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
            "DTSTART;VALUE=DATE:20260508",
            "DTEND;VALUE=DATE:20260509",
            "SUMMARY:Свадьба Антона и Ксении",
            "DESCRIPTION:Будем рады видеть вас на нашей свадьбе!",
            "LOCATION:Азов",
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", "wedding-anton-ksenia.ics");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="relative w-full flex flex-col items-center justify-center gap-10 bg-white overflow-hidden">
            {/* Image Container - Full Width, Natural Height */}
            <div className="relative w-full overflow-hidden group-hover:scale-[1.01] transition-transform duration-700 block">
                {/* Mobile: slightly offset center (-52%) to visually center the "Friday 8" column if the source image isn't perfectly symmetrical */}
                <div className="relative w-[176%] md:w-full left-1/2 -translate-x-[48.5%] md:left-0 md:translate-x-0 flex-shrink-0">
                    <Image
                        src="/calendar.jpg"
                        alt="Календарь: 8 мая, пятница"
                        width={1000}
                        height={600}
                        className="w-full h-auto object-cover"
                        priority
                    />
                </div>

                {/* Visual Overlays - Positioned relative to the viewport container */}

                {/* Side Gradients - Fixed to viewport edges */}
                <div className="absolute inset-y-0 left-0 w-8 md:w-32 bg-gradient-to-r from-[#f4efeb] to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-8 md:w-32 bg-gradient-to-l from-[#f4efeb] to-transparent z-10" />

                {/* Top/Bottom Gradients */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#fff8f0] to-transparent pointer-events-none z-20" />

                {/* Add to Calendar Button - Overlayed on image */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                    <button
                        onClick={handleAddToCalendar}
                        className="inline-flex items-center gap-2 px-6 py-4 bg-[#D4AF76] text-white rounded-full font-sans font-medium text-sm hover:bg-[#b8935c] transition-all shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF76] backdrop-blur-sm bg-[#D4AF76]/90 whitespace-nowrap"
                    >
                        <Calendar size={16} />
                        Добавить в календарь
                    </button>
                </div>
            </div>
        </section>
    );
}

import { NextResponse } from 'next/server';

export async function GET() {
    const description = "Будем рады видеть вас на нашей свадьбе!\\n\\nРасписание:\\n13:20 - Роспись (ЗАГС г. Азов)\\n14:10 - Венчание (Храм Азовской иконы Божией Матери)\\n16:30 - Банкет (Ресторан «Шер Хоф»)";

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Wedding//Anton-Ksenia//RU",
        "BEGIN:VEVENT",
        `UID:wedding-anton-ksenia@wedding.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        "DTSTART;VALUE=DATE:20260508",
        "DTEND;VALUE=DATE:20260509",
        "SUMMARY:Свадьба Антона и Ксении",
        `DESCRIPTION:${description}`,
        "LOCATION:Азов",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    return new NextResponse(icsContent, {
        headers: {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': 'attachment; filename="wedding-anton-ksenia.ics"',
        },
    });
}

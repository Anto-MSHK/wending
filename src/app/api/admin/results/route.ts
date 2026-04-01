import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Guest, { IGuest } from '@/models/Guest';
import GuestQuestionnaire, { IGuestQuestionnaire } from '@/models/GuestQuestionnaire';
import mongoose from 'mongoose';

interface DetailedResponse {
    id: string;
    name: string;
    isAttending: boolean | null;
    gender: 'male' | 'female';
    menuChoice: string | null;
    allergies: string[];
    allergiesOther: string;
    alcohol: string[];
    needsTransfer: boolean | null;
    hasAccommodation: boolean | null;
    tracks: string[];
    updatedAt: Date;
}

interface AdminStats {
    total: number;
    attending: number;
    notAttending: number;
    pending: number;
    menu: {
        meat: number;
        fish: number;
        vegetarian: number;
        kids: number;
        none: number;
    };
    alcohol: {
        wine: number;
        champagne: number;
        spirits: number;
        none: number;
    };
    logistics: {
        transferNeeded: number;
        accommodationNeeded: number;
    };
    music: string[];
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== process.env.ADMIN_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        // Fetch all guests
        const guests = await Guest.find({}).lean() as (IGuest & { _id: mongoose.Types.ObjectId })[];
        // Fetch all questionnaires
        const questionnairesSource = await GuestQuestionnaire.find({}).lean() as (IGuestQuestionnaire & { _id: mongoose.Types.ObjectId })[];

        // Create a map for quick questionnaire lookup
        const questionnaireMap = new Map<string, IGuestQuestionnaire>();
        questionnairesSource.forEach((q) => {
            questionnaireMap.set(q.guestId.toString(), q);
        });

        // Detailed responses mapping
        const detailedResponses: DetailedResponse[] = guests.map((guest) => {
            const guestId = guest._id.toString();
            const questionnaire = questionnaireMap.get(guestId) || null;
            return {
                id: guestId,
                name: guest.guestName,
                isAttending: guest.isAttending,
                gender: guest.gender,
                menuChoice: questionnaire?.menuChoice || null,
                allergies: (questionnaire?.allergies as string[]) || [],
                allergiesOther: questionnaire?.allergiesOther || '',
                alcohol: (questionnaire?.alcoholPreferences as string[]) || [],
                needsTransfer: questionnaire?.needsTransfer ?? null,
                hasAccommodation: questionnaire?.hasAccommodation ?? null,
                tracks: questionnaire?.suggestedTracks || [],
                updatedAt: questionnaire?.updatedAt || guest.updatedAt,
            };
        });

        // Aggregated Stats
        const stats: AdminStats = {
            total: guests.length,
            attending: guests.filter((g) => g.isAttending === true).length,
            notAttending: guests.filter((g) => g.isAttending === false).length,
            pending: guests.filter((g) => g.isAttending === null).length,
            menu: {
                meat: detailedResponses.filter((r) => r.menuChoice === 'meat').length,
                fish: detailedResponses.filter((r) => r.menuChoice === 'fish').length,
                vegetarian: detailedResponses.filter((r) => r.menuChoice === 'vegetarian').length,
                kids: detailedResponses.filter((r) => r.menuChoice === 'kids').length,
                none: detailedResponses.filter((r) => r.isAttending === true && !r.menuChoice).length,
            },
            alcohol: {
                wine: detailedResponses.filter((r) => r.alcohol.includes('wine')).length,
                champagne: detailedResponses.filter((r) => r.alcohol.includes('champagne')).length,
                spirits: detailedResponses.filter((r) => r.alcohol.includes('spirits')).length,
                none: detailedResponses.filter((r) => r.alcohol.includes('none')).length,
            },
            logistics: {
                transferNeeded: detailedResponses.filter((r) => r.needsTransfer === true).length,
                accommodationNeeded: detailedResponses.filter((r) => r.hasAccommodation === true).length,
            },
            music: detailedResponses.flatMap((r) => r.tracks).filter(Boolean),
        };

        return NextResponse.json({ stats, detailedResponses });
    } catch (error: unknown) {
        console.error('Admin Results API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

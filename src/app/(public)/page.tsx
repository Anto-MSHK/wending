import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import Household from '@/models/Household';
import Guest from '@/models/Guest';
import { HeroSection } from '@/components/layout/HeroSection';
import { LoveStorySection } from '@/components/sections/LoveStorySection';
import { EventDetails } from '@/components/layout/EventDetails';
import { CountdownTimer } from '@/components/layout/CountdownTimer';

/**
 * Landing Page - Server Component
 * AC: 1, 2, 3 - Fetch guest by token, display personalized greeting
 */
export default async function LandingPage() {
    // AC1: Extract token from header set by middleware
    const headersList = await headers();
    const token = headersList.get('x-guest-token');

    // Middleware should catch this, but defensive check
    if (!token) {
        redirect('/error');
    }

    // AC2: DB Call - Fetch Guest by token (Guest-First Auth)
    await dbConnect();

    const guest = await Guest.findOne({ inviteToken: token }).lean();

    // AC3: Handle "Guest Not Found"
    if (!guest) {
        redirect('/error');
    }

    // Fetch the household for context
    const household = await Household.findById(guest.householdId).lean();

    if (!household) {
        console.error(`Household not found for guest ${guest._id}`);
        redirect('/error');
    }

    // Display Name Logic
    const displayName = guest.guestName;

    return (
        <main lang="ru">
            {/* AC3, AC5: Hero with guest name, themed design */}
            <HeroSection guestName={displayName} />

            {/* AC1, AC2, AC3: Event Details Component */}
            <EventDetails />

            {/* AC5: Countdown Timer */}
            <CountdownTimer />

            {/* AC4: Love Story section */}
            <LoveStorySection />
        </main>
    );
}

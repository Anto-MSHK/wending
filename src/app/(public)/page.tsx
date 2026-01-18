import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import Household from '@/models/Household';
import Guest from '@/models/Guest';
import { HeroSection } from '@/components/layout/HeroSection';
import { PersonalGreeting } from '@/components/layout/PersonalGreeting';
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
    let displayName = guest.guestName;
    let isFamily = false;

    // Check if we should display the household name (e.g. "Семья Ивановых")
    // This happens if the guest is the Head of Household AND a household name is set
    if (guest.isHeadOfHousehold && household?.householdName) {
        displayName = household.householdName;
        // Typically household names imply a family greeting
        isFamily = true;
    }

    return (
        <main lang="ru">
            {/* Hero with couple photo, date, and names */}
            <HeroSection />

            {/* Personalized greeting below hero */}
            <PersonalGreeting guestName={displayName} isFamily={isFamily} />

            {/* AC1, AC2, AC3: Event Details Component */}
            <EventDetails />

            {/* AC5: Countdown Timer */}
            <CountdownTimer />

            {/* AC4: Love Story section */}
            <LoveStorySection />
        </main>
    );
}

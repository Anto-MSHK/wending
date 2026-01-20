import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import Household from '@/models/Household';
import Guest from '@/models/Guest';
import { HeroSection } from '@/components/layout/HeroSection';
import { PersonalGreeting } from '@/components/layout/PersonalGreeting';
import { LoveStorySection } from '@/components/sections/LoveStorySection';
import { RestaurantDetails } from '@/components/layout/RestaurantDetails';
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

    // Determine if this guest is Head of Household
    const isHeadOfHousehold = guest.isHeadOfHousehold && !!household?.householdName;

    // Build RSVP guest list based on role
    let guestsForRSVP;
    if (isHeadOfHousehold) {
        // Head of Household sees all family members
        const householdGuests = await Guest.find({
            householdId: guest.householdId,
        }).lean();
        guestsForRSVP = householdGuests.map((g) => ({
            _id: g._id.toString(),
            guestName: g.guestName,
            isAttending: g.isAttending ?? null,
        }));
    } else {
        // Regular guest sees only their own RSVP
        guestsForRSVP = [{
            _id: guest._id.toString(),
            guestName: guest.guestName,
            isAttending: guest.isAttending ?? null,
        }];
    }

    // Display Name Logic
    const displayName = isHeadOfHousehold ? household.householdName : guest.guestName;

    return (
        <main lang="ru">
            {/* Hero with couple photo, date, and names */}
            <HeroSection />

            {/* Personalized greeting + RSVP section */}
            <PersonalGreeting
                guestName={displayName}
                isFamily={isHeadOfHousehold}
                guestGender={guest.gender}
                guests={guestsForRSVP}
                householdName={household.householdName || ''}
                householdId={household._id.toString()}
            />

            {/* AC1, AC2, AC3: Restaurant Details Component (Replaces EventDetails) */}
            <RestaurantDetails />

            {/* AC5: Countdown Timer */}
            <CountdownTimer />

            {/* AC4: Love Story section */}
            <LoveStorySection />
        </main>
    );
}



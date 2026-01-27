import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import Household from '@/models/Household';
import Guest from '@/models/Guest';
import GuestQuestionnaire from '@/models/GuestQuestionnaire';
import { LandingPageContent } from '@/components/layout/LandingPageContent';

/**
 * Landing Page - Server Component
 * Fetches data and passes it to the client wrapper for interactivity.
 * 
 * @see Story 2.4 / UX Improvements
 */
export default async function LandingPage() {
    // AC1: Extract token from header set by middleware
    const headersList = await headers();
    const token = headersList.get('x-guest-token');

    if (!token) {
        redirect('/error');
    }

    // AC2: DB Call - Fetch Guest by token
    await dbConnect();

    const guest = await Guest.findOne({ inviteToken: token }).lean();

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

    // Build guest lists based on role
    let householdGuests;
    if (isHeadOfHousehold) {
        // Head of Household sees all family members
        householdGuests = await Guest.find({
            householdId: guest.householdId,
        }).lean();
    } else {
        // Regular guest sees only themselves
        householdGuests = [guest];
    }

    // Build RSVP guest list
    const guestsForRSVP = householdGuests.map((g) => ({
        _id: g._id.toString(),
        guestName: g.guestName,
        isAttending: g.isAttending ?? null,
    }));

    // Build questionnaire guest list (guest info only)
    const guestsForQuestionnaire = householdGuests.map((g) => ({
        _id: g._id.toString(),
        guestName: g.guestName,
        age: g.age,
        isAttending: g.isAttending ?? null,
        isHeadOfHousehold: g.isHeadOfHousehold,
        householdId: g.householdId.toString(),
    }));

    // Fetch questionnaire data for all relevant guests
    const guestIds = householdGuests.map(g => g._id);
    const questionnaireDocsRaw = await GuestQuestionnaire.find({
        guestId: { $in: guestIds }
    }).lean();

    // Build questionnaire data map
    const questionnairesData = questionnaireDocsRaw.map((q) => ({
        guestId: q.guestId.toString(),
        menuChoice: q.menuChoice ?? null,
        allergies: q.allergies ?? [],
        allergiesOther: q.allergiesOther ?? '',
        hasNoAllergies: q.hasNoAllergies ?? false,
        alcoholPreferences: q.alcoholPreferences ?? [],
        needsTransfer: q.needsTransfer ?? null,
        hasAccommodation: q.hasAccommodation ?? null,
        suggestedTracks: q.suggestedTracks ?? [],
    }));

    // Display Name Logic
    const displayName = isHeadOfHousehold ? household.householdName : guest.guestName;

    return (
        <LandingPageContent
            guestName={displayName}
            isFamily={isHeadOfHousehold}
            guestGender={guest.gender}
            guestsForRSVP={guestsForRSVP}
            guestsForQuestionnaire={guestsForQuestionnaire}
            questionnairesData={questionnairesData}
            householdName={household.householdName || ''}
            householdId={household._id.toString()}
            isHeadOfHousehold={isHeadOfHousehold}
        />
    );
}

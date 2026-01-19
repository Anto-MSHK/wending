/**
 * Shared types for RSVP components
 * @see Story 2.1
 */

/**
 * Minimal guest data needed for RSVP UI
 */
export interface GuestForRSVP {
    _id: string;
    guestName: string;
    isAttending: boolean | null;
}

/**
 * Props for RSVPSection container component
 */
export interface RSVPSectionProps {
    guests: GuestForRSVP[];
    householdName: string;
    householdId: string;
    showNames?: boolean;
}

/**
 * Props for individual guest RSVP card
 */
export interface GuestRSVPCardProps {
    guest: GuestForRSVP;
    onUpdate: (guestId: string, isAttending: boolean) => Promise<void>;
    isPending: boolean;
    showName?: boolean;
}

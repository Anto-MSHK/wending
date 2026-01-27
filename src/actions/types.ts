/**
 * Shared types for Server Actions
 * @see architecture.md#Format-Patterns
 */

/**
 * Standard response type for all server actions.
 * Provides a consistent success/error shape for client handling.
 */
export type ActionResponse<T> = {
    success: boolean;
    data?: T;
    error?: string; // User-facing error message
};

/**
 * Result type for guest RSVP updates
 */
export interface GuestUpdateResult {
    guestId: string;
    guestName: string;
    isAttending: boolean;
    updatedAt: string; // ISO date string
}

/**
 * Result type for guest menu choice updates
 */
export interface GuestMenuResult {
    guestId: string;
    menuChoice: string | null;
    updatedAt: string;
}

/**
 * Result type for guest allergies updates
 */
export interface GuestAllergiesResult {
    guestId: string;
    allergies: string[];
    allergiesOther: string;
    hasNoAllergies: boolean;
    updatedAt: string;
}

/**
 * Result type for guest alcohol preferences updates
 */
export interface GuestAlcoholResult {
    guestId: string;
    alcoholPreferences: string[];
    updatedAt: string;
}

/**
 * Result type for guest transfer updates (per-guest now)
 */
export interface GuestTransferResult {
    guestId: string;
    needsTransfer: boolean;
    updatedAt: string;
}

/**
 * Result type for guest suggested tracks updates
 */
export interface GuestSuggestedTracksResult {
    guestId: string;
    suggestedTracks: string[];
    updatedAt: string;
}

/**
 * Result type for guest accommodation updates
 */
export interface GuestAccommodationResult {
    guestId: string;
    hasAccommodation: boolean;
    updatedAt: string;
}
/**
 * Result type for guest second day updates
 */
export interface GuestSecondDayResult {
    guestId: string;
    wantsSecondDay: boolean;
    updatedAt: string;
}

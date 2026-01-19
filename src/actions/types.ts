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

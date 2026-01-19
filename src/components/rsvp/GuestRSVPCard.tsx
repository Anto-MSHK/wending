"use client";

import { useState } from "react";
import { GuestRSVPCardProps } from "./types";

/**
 * Individual guest RSVP card with Yes/No emoji buttons.
 * Implements auto-save behavior with optimistic UI.
 *
 * @see Story 2.1 - GuestRSVPCard Component
 */
export function GuestRSVPCard({
    guest,
    onUpdate,
    isPending,
    showName = true,
}: GuestRSVPCardProps) {
    const [localValue, setLocalValue] = useState<boolean | null>(
        guest.isAttending
    );
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showSadEmoji, setShowSadEmoji] = useState(false);

    const handleSelect = async (isAttending: boolean) => {
        // If already selected, do nothing
        if (localValue === isAttending) return;

        const previousValue = localValue;

        // Optimistic update
        setLocalValue(isAttending);
        setIsUpdating(true);

        // Confetti on first "Yes" selection
        if (isAttending && previousValue !== true) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }

        // Sad emoji on first "No" selection
        if (!isAttending && previousValue !== false) {
            setShowSadEmoji(true);
            setTimeout(() => setShowSadEmoji(false), 3000);
        }

        try {
            await onUpdate(guest._id, isAttending);
        } catch {
            // Revert on error
            setLocalValue(previousValue);
        } finally {
            setIsUpdating(false);
        }
    };

    const isYesSelected = localValue === true;
    const isNoSelected = localValue === false;
    const showSpinner = isUpdating || isPending;

    return (
        <div
            className={`flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-md ${showName ? 'justify-between' : 'justify-center'}`}
            role="radiogroup"
            aria-label={`Подтверждение для ${guest.guestName}`}
        >
            {/* Guest Name - only show if showName is true */}
            {showName && (
                <span className="flex-1 text-base font-medium text-charcoal text-left">
                    {guest.guestName}
                </span>
            )}

            {/* Yes/No Buttons with Labels */}
            <div className="flex gap-4">
                {/* Yes Button */}
                <div className="flex flex-col items-center">
                    <button
                        type="button"
                        onClick={() => handleSelect(true)}
                        disabled={showSpinner}
                        aria-label={`${guest.guestName}: Приду`}
                        aria-checked={isYesSelected}
                        role="radio"
                        className={`
                            relative flex h-12 w-12 items-center justify-center rounded-full
                            text-xl transition-all duration-300
                            focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                            ${isYesSelected
                                ? "scale-110 bg-blush text-white shadow-lg"
                                : "border-2 border-muted/50 bg-white text-muted hover:scale-105 hover:border-blush hover:text-blush"
                            }
                            ${showSpinner && isYesSelected ? "animate-pulse" : ""}
                        `}
                    >
                        👍
                        {/* Confetti burst */}
                        {showConfetti && (
                            <>
                                <span className="absolute -top-2 left-0 animate-bounce text-sm">✨</span>
                                <span className="absolute -top-2 right-0 animate-bounce text-sm">🎉</span>
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce text-base">💕</span>
                            </>
                        )}
                    </button>
                    <span className={`mt-1 text-xs transition-colors ${isYesSelected ? "font-medium text-blush" : "text-muted"}`}>
                        приду
                    </span>
                </div>

                {/* No Button */}
                <div className="flex flex-col items-center">
                    <button
                        type="button"
                        onClick={() => handleSelect(false)}
                        disabled={showSpinner}
                        aria-label={`${guest.guestName}: Не приду`}
                        aria-checked={isNoSelected}
                        role="radio"
                        className={`
                            relative flex h-12 w-12 items-center justify-center rounded-full
                            text-xl transition-all duration-300
                            focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                            ${isNoSelected
                                ? "scale-110 bg-charcoal text-white shadow-lg"
                                : "border-2 border-muted/50 bg-white text-muted hover:scale-105 hover:border-charcoal hover:text-charcoal"
                            }
                            ${showSpinner && isNoSelected ? "animate-pulse" : ""}
                        `}
                    >
                        👎
                        {/* Sad emoji burst */}
                        {showSadEmoji && (
                            <>
                                <span className="absolute -top-2 left-0 animate-bounce text-sm">😢</span>
                                <span className="absolute -top-2 right-0 animate-bounce text-sm">💔</span>
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce text-base">😔</span>
                            </>
                        )}
                    </button>
                    <span className={`mt-1 text-xs transition-colors ${isNoSelected ? "font-medium text-charcoal" : "text-muted"}`}>
                        не приду
                    </span>
                </div>
            </div>
        </div>
    );
}


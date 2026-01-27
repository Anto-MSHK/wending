"use client";

import { useState } from "react";

interface AccommodationSectionProps {
    guests: { _id: string; guestName: string; isAttending: boolean | null }[];
    questionnaires: { guestId: string; hasAccommodation: boolean | null }[];
    isHeadOfHousehold: boolean;
    onGuestAccommodationChange: (guestId: string, hasAccommodation: boolean) => Promise<void>;
    onBulkAccommodationChange: (hasAccommodation: boolean) => Promise<void>;
    isPending: boolean;
    embedded?: boolean;
}

/**
 * Accommodation section.
 * - HoH: Sets accommodation for ALL family members (single toggle).
 * - Guest: Sets accommodation for themselves (single toggle).
 */
export default function AccommodationSection({
    guests,
    questionnaires,
    isHeadOfHousehold,
    onGuestAccommodationChange,
    onBulkAccommodationChange,
    isPending,
    embedded = false,
}: AccommodationSectionProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    // Only show attending guests
    const attendingGuests = guests.filter(g => g.isAttending === true);
    if (attendingGuests.length === 0) return null;

    // Determine current accommodation state
    const anyHasAccommodation = attendingGuests.some(g => {
        const q = questionnaires.find(q => q.guestId === g._id);
        return q?.hasAccommodation === true;
    });

    const allNoAccommodation = attendingGuests.every(g => {
        const q = questionnaires.find(q => q.guestId === g._id);
        return q?.hasAccommodation === false;
    });

    const isYesSelected = anyHasAccommodation;
    const isNoSelected = !anyHasAccommodation && allNoAccommodation;

    const handleSelect = async (value: boolean) => {
        if (isPending || isUpdating) return;

        if (value && isYesSelected) return;
        if (!value && isNoSelected) return;

        setIsUpdating(true);
        try {
            if (isHeadOfHousehold) {
                await onBulkAccommodationChange(value);
            } else {
                // Single guest - update self
                if (guests.length > 0) {
                    await onGuestAccommodationChange(guests[0]._id, value);
                }
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const showSpinner = isUpdating || isPending;

    const containerClasses = embedded
        ? "" // Embedded - no extra wrapper
        : "rounded-2xl bg-white p-5 shadow-md"; // Standalone

    return (
        <div className={containerClasses}>
            <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🏨</span>
                <h5 className="font-inter text-sm font-medium text-charcoal">Размещение</h5>
            </div>
            <p className="mb-3 text-xs text-muted">
                {isHeadOfHousehold
                    ? "Есть ли у вашей семьи где остаться между мероприятиями?"
                    : "Есть ли где остаться между мероприятиями и после ресторана?"}
            </p>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => handleSelect(true)}
                    disabled={showSpinner}
                    aria-pressed={isYesSelected}
                    className={`
                        flex-1 rounded-xl border-2 px-4 py-2.5 font-inter text-sm font-medium
                        transition-all duration-200
                        ${isYesSelected
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-muted/30 bg-white text-charcoal hover:border-muted/50"
                        }
                        ${showSpinner ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    `}
                >
                    ✓ Да, есть
                </button>
                <button
                    type="button"
                    onClick={() => handleSelect(false)}
                    disabled={showSpinner}
                    aria-pressed={isNoSelected}
                    className={`
                        flex-1 rounded-xl border-2 px-4 py-2.5 font-inter text-sm font-medium
                        transition-all duration-200
                        ${isNoSelected
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-muted/30 bg-white text-charcoal hover:border-muted/50"
                        }
                        ${showSpinner ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    `}
                >
                    ✗ Нужна помощь
                </button>
            </div>

            {/* Helper note */}
            {isHeadOfHousehold && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                    <span>ℹ️</span>
                    <span>Мы поможем подобрать размещение для всех</span>
                </p>
            )}
        </div>
    );
}

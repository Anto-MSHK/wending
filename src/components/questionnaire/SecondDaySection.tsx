"use client";

import { useState } from "react";
import { CalendarRange, Check, X, Info } from "lucide-react";
import { SecondDaySectionProps } from "./types";

/**
 * Second day celebration section.
 * - HoH: Sets preference for ALL family members (single toggle).
 * - Guest: Sets preference for themselves (single toggle).
 */
export default function SecondDaySection({
    guests,
    questionnaires,
    isHeadOfHousehold,
    onGuestSecondDayChange,
    onBulkSecondDayChange,
    isPending,
    embedded = false,
}: SecondDaySectionProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    // Only show attending guests
    const attendingGuests = guests.filter(g => g.isAttending === true);
    if (attendingGuests.length === 0) return null;

    // Determine current state
    const anyWantsSecondDay = attendingGuests.some(g => {
        const q = questionnaires.find(q => q.guestId === g._id);
        return q?.wantsSecondDay === true;
    });

    const allWantsNoSecondDay = attendingGuests.every(g => {
        const q = questionnaires.find(q => q.guestId === g._id);
        return q?.wantsSecondDay === false;
    });

    const isYesSelected = anyWantsSecondDay;
    const isNoSelected = !anyWantsSecondDay && allWantsNoSecondDay;

    const handleSelect = async (value: boolean) => {
        if (isPending || isUpdating) return;

        if (value && isYesSelected) return;
        if (!value && isNoSelected) return;

        setIsUpdating(true);
        try {
            if (isHeadOfHousehold) {
                await onBulkSecondDayChange(value);
            } else {
                // Single guest - update self
                if (guests.length > 0) {
                    await onGuestSecondDayChange(guests[0]._id, value);
                }
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const showSpinner = isUpdating || isPending;

    const containerClasses = embedded
        ? "" // Embedded - no extra wrapper
        : "rounded-2xl bg-white p-5 shadow-md mb-4"; // Standalone

    return (
        <div className={containerClasses}>
            <div className="mb-2 flex items-center gap-2">
                <CalendarRange className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium text-charcoal">Второй день</span>
            </div>
            <p className="mb-4 text-xs text-charcoal/80">
                Хотели бы вы продлить праздник на второй день?
            </p>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => handleSelect(true)}
                    disabled={showSpinner}
                    aria-pressed={isYesSelected}
                    className={`
                        flex-1 rounded-xl px-4 py-3 text-sm font-medium
                        flex items-center justify-center gap-2
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                        ${isYesSelected
                            ? "bg-blush text-white shadow-md transform scale-[1.02]"
                            : "border border-muted/30 bg-white text-charcoal hover:border-blush"
                        }
                        ${showSpinner ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                    `}
                >
                    <Check size={18} />
                    <span>Да</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleSelect(false)}
                    disabled={showSpinner}
                    aria-pressed={isNoSelected}
                    className={`
                        flex-1 rounded-xl px-4 py-3 text-sm font-medium
                        flex items-center justify-center gap-2
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                        ${isNoSelected
                            ? "bg-charcoal/80 text-white shadow-md transform scale-[1.02]"
                            : "border border-muted/30 bg-white text-charcoal hover:border-charcoal/50"
                        }
                        ${showSpinner ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                    `}
                >
                    <X size={18} />
                    <span>Нет</span>
                </button>
            </div>

        </div>
    );
}

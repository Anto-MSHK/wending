"use client";

import { useState } from "react";
import { Bus, Car, Info } from "lucide-react";
import { TransferSectionProps } from "./types";

/**
 * Transfer section.
 * - HoH: Sets transfer for ALL family members (single toggle).
 * - Guest: Sets transfer for themselves (single toggle).
 * 
 * @see Story 2.4 - AC 6 (refactored)
 */
export function TransferSection({
    guests,
    questionnaires,
    isHeadOfHousehold,
    onGuestTransferChange,
    onBulkTransferChange,
    isPending,
    embedded = false,
}: TransferSectionProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    // Only show attending guests
    const attendingGuests = guests.filter(g => g.isAttending === true);
    if (attendingGuests.length === 0) return null;

    // Determine current transfer state
    const anyTransferNeeded = attendingGuests.some(g => {
        const q = questionnaires.find(q => q.guestId === g._id);
        return q?.needsTransfer === true;
    });

    const allNoTransfer = attendingGuests.every(g => {
        const q = questionnaires.find(q => q.guestId === g._id);
        return q?.needsTransfer === false;
    });

    const isYesSelected = anyTransferNeeded;
    const isNoSelected = !anyTransferNeeded && allNoTransfer;

    const handleSelect = async (value: boolean) => {
        if (isPending || isUpdating) return;

        if (value && isYesSelected) return;
        if (!value && isNoSelected) return;

        setIsUpdating(true);
        try {
            if (isHeadOfHousehold) {
                await onBulkTransferChange(value);
            } else {
                // Single guest - update self
                if (guests.length > 0) {
                    await onGuestTransferChange(guests[0]._id, value);
                }
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const showSpinner = isUpdating || isPending;

    const containerClasses = embedded
        ? "" // Remove border-t here, GuestPreferenceCard will handle vertical spacing
        : "rounded-2xl bg-white p-5 shadow-md"; // Standalone style

    return (
        <div className={containerClasses}>
            {/* Header */}
            <div className="mb-2 flex items-center gap-2">
                <Bus className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium text-charcoal">
                    Трансфер
                </span>
            </div>

            <p className="mb-4 text-xs text-charcoal/80">
                {isHeadOfHousehold
                    ? "Нужен ли вашей семье трансфер до ресторана?"
                    : "Нужен ли вам трансфер до ресторана?"}
            </p>

            {/* Single Toggle Buttons */}
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
                    <Bus size={18} />
                    <span>Да{isHeadOfHousehold ? ", нужен всем" : ", нужен"}</span>
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
                    <Car size={18} />
                    <span>Нет{isHeadOfHousehold ? ", приедем сами" : ""}</span>
                </button>
            </div>

        </div>
    );
}

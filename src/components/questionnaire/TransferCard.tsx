"use client";

import { useState } from "react";
import { TransferSectionProps } from "./types";

/**
 * Transfer section with per-guest selection.
 * HoH can set for all family members with one click.
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
}: TransferSectionProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    // Only show attending guests
    const attendingGuests = guests.filter(g => g.isAttending === true);

    if (attendingGuests.length === 0) return null;

    const handleGuestTransfer = async (guestId: string, value: boolean) => {
        if (isPending || isUpdating) return;
        setIsUpdating(true);
        try {
            await onGuestTransferChange(guestId, value);
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 1000);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleBulkTransfer = async (value: boolean) => {
        if (isPending || isUpdating) return;
        setIsUpdating(true);
        try {
            await onBulkTransferChange(value);
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 1000);
        } finally {
            setIsUpdating(false);
        }
    };

    const getTransferValue = (guestId: string): boolean | null => {
        return questionnaires.find(q => q.guestId === guestId)?.needsTransfer ?? null;
    };

    const showSpinner = isUpdating || isPending;

    return (
        <div className="rounded-2xl bg-white p-5 shadow-md">
            {/* Header */}
            <div className="mb-4 flex items-center gap-2">
                <span className="text-xl">🚌</span>
                <h3 className="font-cormorant text-xl font-semibold text-charcoal">
                    Трансфер
                </h3>
                {showSaved && (
                    <span className="text-xs text-sage animate-fade-in">✓ сохранено</span>
                )}
            </div>

            <p className="mb-4 text-sm text-charcoal/80">
                Нужен ли трансфер до ресторана?
            </p>

            {/* HoH Bulk Set Buttons */}
            {isHeadOfHousehold && attendingGuests.length > 1 && (
                <div className="mb-4 p-3 bg-cream/50 rounded-xl">
                    <p className="text-xs text-charcoal/70 mb-2">Установить для всех:</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleBulkTransfer(true)}
                            disabled={showSpinner}
                            className={`
                                flex-1 rounded-lg px-3 py-2 text-sm font-medium
                                transition-all duration-200 border border-blush/50
                                focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                                bg-blush/10 text-blush hover:bg-blush hover:text-white
                                ${showSpinner ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                            `}
                        >
                            ✓ Всем нужен
                        </button>
                        <button
                            type="button"
                            onClick={() => handleBulkTransfer(false)}
                            disabled={showSpinner}
                            className={`
                                flex-1 rounded-lg px-3 py-2 text-sm font-medium
                                transition-all duration-200 border border-charcoal/30
                                focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                                bg-charcoal/5 text-charcoal hover:bg-charcoal hover:text-white
                                ${showSpinner ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                            `}
                        >
                            ✗ Никому не нужен
                        </button>
                    </div>
                </div>
            )}

            {/* Per-Guest Transfer Selection */}
            <div className="space-y-3">
                {attendingGuests.map((guest) => {
                    const transferValue = getTransferValue(guest._id);
                    const isYes = transferValue === true;
                    const isNo = transferValue === false;

                    return (
                        <div key={guest._id} className="flex items-center justify-between gap-3">
                            <span className="text-sm text-charcoal flex-1">
                                {guest.guestName}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleGuestTransfer(guest._id, true)}
                                    disabled={showSpinner}
                                    aria-pressed={isYes}
                                    className={`
                                        rounded-lg px-3 py-1.5 text-xs font-medium
                                        transition-all duration-200
                                        focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                                        ${isYes
                                            ? "bg-blush text-white shadow-sm"
                                            : "border border-muted/30 bg-white text-charcoal hover:border-blush"
                                        }
                                        ${showSpinner ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                                    `}
                                >
                                    🚌 Да
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleGuestTransfer(guest._id, false)}
                                    disabled={showSpinner}
                                    aria-pressed={isNo}
                                    className={`
                                        rounded-lg px-3 py-1.5 text-xs font-medium
                                        transition-all duration-200
                                        focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                                        ${isNo
                                            ? "bg-charcoal/80 text-white shadow-sm"
                                            : "border border-muted/30 bg-white text-charcoal hover:border-charcoal/50"
                                        }
                                        ${showSpinner ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                                    `}
                                >
                                    🚗 Нет
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Helper note */}
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                <span>ℹ️</span>
                <span>Каждый гость может выбрать индивидуально</span>
            </p>
        </div>
    );
}

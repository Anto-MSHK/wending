"use client";

import { useTransition } from "react";
import { updateGuestRsvp } from "@/actions/rsvp.actions";
import { GuestRSVPCard } from "./GuestRSVPCard";
import { RSVPSectionProps, GuestForRSVP } from "./types";
import { useState } from "react";

/**
 * RSVP widget embedded in PersonalGreeting.
 * Manages optimistic state for all guests and handles server action calls.
 *
 * @see Story 2.1 - RSVPSection Component
 */
export function RSVPSection({ guests, showNames = true }: RSVPSectionProps) {
    const [isPending, startTransition] = useTransition();
    const [localGuests, setLocalGuests] = useState<GuestForRSVP[]>(guests);

    const handleUpdate = async (guestId: string, isAttending: boolean) => {
        // Optimistic update
        setLocalGuests((prev) =>
            prev.map((g) => (g._id === guestId ? { ...g, isAttending } : g))
        );

        startTransition(async () => {
            const result = await updateGuestRsvp(guestId, isAttending);

            if (!result.success) {
                // Revert on error
                setLocalGuests((prev) =>
                    prev.map((g) =>
                        g._id === guestId
                            ? { ...g, isAttending: guests.find((og) => og._id === guestId)?.isAttending ?? null }
                            : g
                    )
                );
                console.error("RSVP update failed:", result.error);
            }
        });
    };

    return (
        <div id="rsvp" className="mt-4 w-full">
            <div className="flex flex-col gap-3">
                {localGuests.map((guest) => (
                    <GuestRSVPCard
                        key={guest._id}
                        guest={guest}
                        onUpdate={handleUpdate}
                        isPending={isPending}
                        showName={showNames}
                    />
                ))}
            </div>
        </div>
    );
}


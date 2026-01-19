"use server";

import { ActionResponse, GuestUpdateResult } from "./types";
import connectDB from "@/lib/db";
import Guest from "@/models/Guest";
import mongoose from "mongoose";

/**
 * Updates a single guest's RSVP attendance status.
 * Called on each tap of Yes/No buttons in RSVPSection.
 *
 * @param guestId - MongoDB ObjectId as string
 * @param isAttending - true = Yes (attending), false = No (not attending)
 * @returns ActionResponse with updated guest data or error message
 */
export async function updateGuestRsvp(
    guestId: string,
    isAttending: boolean
): Promise<ActionResponse<GuestUpdateResult>> {
    try {
        // 1. Validate guestId format
        if (!mongoose.Types.ObjectId.isValid(guestId)) {
            return { success: false, error: "Invalid guest ID" };
        }

        // 2. Validate isAttending is boolean
        if (typeof isAttending !== "boolean") {
            return { success: false, error: "Invalid attendance value" };
        }

        // 3. Connect and update atomically
        await connectDB();
        const guest = await Guest.findByIdAndUpdate(
            guestId,
            { isAttending },
            { new: true }
        ).lean();

        // 4. Handle guest not found
        if (!guest) {
            return { success: false, error: "Гость не найден" };
        }

        // 5. Return success with updated data
        return {
            success: true,
            data: {
                guestId: guest._id.toString(),
                guestName: guest.guestName,
                isAttending: guest.isAttending!,
                updatedAt: new Date().toISOString(),
            },
        };
    } catch (error) {
        console.error("RSVP update error:", error);
        return {
            success: false,
            error: "Что-то пошло не так. Попробуйте ещё раз.",
        };
    }
}

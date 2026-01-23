"use server";

import {
    ActionResponse,
    GuestMenuResult,
    GuestAllergiesResult,
    GuestAlcoholResult,
    GuestTransferResult,
} from "./types";
import connectDB from "@/lib/db";
import Guest from "@/models/Guest";
import GuestQuestionnaire, {
    MenuChoice,
    AllergenType,
    AlcoholPreference
} from "@/models/GuestQuestionnaire";
import mongoose from "mongoose";

/**
 * Gets or creates a questionnaire document for a guest.
 * Uses upsert to ensure atomic creation.
 */
async function getOrCreateQuestionnaire(guestId: string) {
    return await GuestQuestionnaire.findOneAndUpdate(
        { guestId: new mongoose.Types.ObjectId(guestId) },
        { $setOnInsert: { guestId: new mongoose.Types.ObjectId(guestId) } },
        { upsert: true, new: true }
    );
}

/**
 * Updates a guest's menu choice.
 * Auto-save on selection.
 */
export async function updateGuestMenu(
    guestId: string,
    menuChoice: MenuChoice
): Promise<ActionResponse<GuestMenuResult>> {
    try {
        if (!mongoose.Types.ObjectId.isValid(guestId)) {
            return { success: false, error: "Invalid guest ID" };
        }

        const validChoices: MenuChoice[] = ['meat', 'fish', 'vegetarian', 'kids', null];
        if (!validChoices.includes(menuChoice)) {
            return { success: false, error: "Invalid menu choice" };
        }

        await connectDB();
        const questionnaire = await GuestQuestionnaire.findOneAndUpdate(
            { guestId: new mongoose.Types.ObjectId(guestId) },
            { $set: { menuChoice }, $setOnInsert: { guestId: new mongoose.Types.ObjectId(guestId) } },
            { upsert: true, new: true }
        ).lean();

        return {
            success: true,
            data: {
                guestId,
                menuChoice: questionnaire.menuChoice,
                updatedAt: new Date().toISOString(),
            },
        };
    } catch (error) {
        console.error("Menu update error:", error);
        return {
            success: false,
            error: "Что-то пошло не так. Попробуйте ещё раз.",
        };
    }
}

/**
 * Updates a guest's allergy information.
 * Handles common allergens, custom text, and explicit "no allergies" flag.
 */
export async function updateGuestAllergies(
    guestId: string,
    allergies: AllergenType[],
    allergiesOther: string,
    hasNoAllergies: boolean
): Promise<ActionResponse<GuestAllergiesResult>> {
    try {
        if (!mongoose.Types.ObjectId.isValid(guestId)) {
            return { success: false, error: "Invalid guest ID" };
        }

        // Validate allergen types
        const validAllergens: AllergenType[] = ['nuts', 'seafood', 'gluten', 'lactose'];
        const invalidAllergens = allergies.filter(a => !validAllergens.includes(a));
        if (invalidAllergens.length > 0) {
            return { success: false, error: "Invalid allergen type" };
        }

        await connectDB();
        const questionnaire = await GuestQuestionnaire.findOneAndUpdate(
            { guestId: new mongoose.Types.ObjectId(guestId) },
            {
                $set: { allergies, allergiesOther: allergiesOther.trim(), hasNoAllergies },
                $setOnInsert: { guestId: new mongoose.Types.ObjectId(guestId) }
            },
            { upsert: true, new: true }
        ).lean();

        return {
            success: true,
            data: {
                guestId,
                allergies: questionnaire.allergies,
                allergiesOther: questionnaire.allergiesOther,
                hasNoAllergies: questionnaire.hasNoAllergies,
                updatedAt: new Date().toISOString(),
            },
        };
    } catch (error) {
        console.error("Allergies update error:", error);
        return {
            success: false,
            error: "Что-то пошло не так. Попробуйте ещё раз.",
        };
    }
}

/**
 * Updates a guest's alcohol preferences.
 * Handles multi-select with mutual exclusivity for 'none'.
 */
export async function updateGuestAlcohol(
    guestId: string,
    alcoholPreferences: AlcoholPreference[]
): Promise<ActionResponse<GuestAlcoholResult>> {
    try {
        if (!mongoose.Types.ObjectId.isValid(guestId)) {
            return { success: false, error: "Invalid guest ID" };
        }

        // Validate alcohol preferences
        const validPrefs: AlcoholPreference[] = ['wine', 'champagne', 'spirits', 'none'];
        const invalidPrefs = alcoholPreferences.filter(p => !validPrefs.includes(p));
        if (invalidPrefs.length > 0) {
            return { success: false, error: "Invalid alcohol preference" };
        }

        // Enforce mutual exclusivity: if 'none' is selected, clear others
        let finalPreferences = alcoholPreferences;
        if (alcoholPreferences.includes('none')) {
            finalPreferences = ['none'];
        } else {
            // Remove 'none' if other options are selected
            finalPreferences = alcoholPreferences.filter(p => p !== 'none');
        }

        await connectDB();
        const questionnaire = await GuestQuestionnaire.findOneAndUpdate(
            { guestId: new mongoose.Types.ObjectId(guestId) },
            {
                $set: { alcoholPreferences: finalPreferences },
                $setOnInsert: { guestId: new mongoose.Types.ObjectId(guestId) }
            },
            { upsert: true, new: true }
        ).lean();

        return {
            success: true,
            data: {
                guestId,
                alcoholPreferences: questionnaire.alcoholPreferences,
                updatedAt: new Date().toISOString(),
            },
        };
    } catch (error) {
        console.error("Alcohol preferences update error:", error);
        return {
            success: false,
            error: "Что-то пошло не так. Попробуйте ещё раз.",
        };
    }
}

/**
 * Updates a single guest's transfer preference.
 */
export async function updateGuestTransfer(
    guestId: string,
    needsTransfer: boolean
): Promise<ActionResponse<GuestTransferResult>> {
    try {
        if (!mongoose.Types.ObjectId.isValid(guestId)) {
            return { success: false, error: "Invalid guest ID" };
        }

        if (typeof needsTransfer !== "boolean") {
            return { success: false, error: "Invalid transfer value" };
        }

        await connectDB();
        const questionnaire = await GuestQuestionnaire.findOneAndUpdate(
            { guestId: new mongoose.Types.ObjectId(guestId) },
            {
                $set: { needsTransfer },
                $setOnInsert: { guestId: new mongoose.Types.ObjectId(guestId) }
            },
            { upsert: true, new: true }
        ).lean();

        return {
            success: true,
            data: {
                guestId,
                needsTransfer: questionnaire.needsTransfer!,
                updatedAt: new Date().toISOString(),
            },
        };
    } catch (error) {
        console.error("Transfer update error:", error);
        return {
            success: false,
            error: "Что-то пошло не так. Попробуйте ещё раз.",
        };
    }
}

/**
 * Updates transfer preference for ALL guests in a household.
 * Used by Head of Household to set transfer for entire family.
 */
export async function updateHouseholdTransfer(
    householdId: string,
    needsTransfer: boolean
): Promise<ActionResponse<{ updatedCount: number; updatedAt: string }>> {
    try {
        if (!mongoose.Types.ObjectId.isValid(householdId)) {
            return { success: false, error: "Invalid household ID" };
        }

        if (typeof needsTransfer !== "boolean") {
            return { success: false, error: "Invalid transfer value" };
        }

        await connectDB();

        // Find all guests in the household
        const guests = await Guest.find({ householdId: new mongoose.Types.ObjectId(householdId) }).lean();

        if (guests.length === 0) {
            return { success: false, error: "Семья не найдена" };
        }

        // Update or create questionnaire for each guest
        const bulkOps = guests.map(guest => ({
            updateOne: {
                filter: { guestId: guest._id },
                update: {
                    $set: { needsTransfer },
                    $setOnInsert: { guestId: guest._id }
                },
                upsert: true,
            }
        }));

        const result = await GuestQuestionnaire.bulkWrite(bulkOps);

        return {
            success: true,
            data: {
                updatedCount: guests.length,
                updatedAt: new Date().toISOString(),
            },
        };
    } catch (error) {
        console.error("Household transfer update error:", error);
        return {
            success: false,
            error: "Что-то пошло не так. Попробуйте ещё раз.",
        };
    }
}

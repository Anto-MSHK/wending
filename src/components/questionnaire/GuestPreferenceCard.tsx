"use client";

import { useState, useCallback } from "react";
import { MenuChoice, AllergenType, AlcoholPreference } from "@/models/GuestQuestionnaire";
import { GuestPreferenceCardProps } from "./types";
import { MenuChoiceButtons } from "./MenuChoiceButtons";
import { AllergyInput } from "./AllergyInput";
import { AlcoholPreferenceButtons } from "./AlcoholPreferenceButtons";
import SuggestedTracksInput from "./SuggestedTracksInput";

/**
 * Individual guest preference card containing menu, allergies, alcohol, and tracks sections.
 * Supports embedding children (e.g., TransferSection, AccommodationSection) for single-guest unified layout.
 * 
 * @see Story 2.4
 */
export function GuestPreferenceCard({
    guest,
    questionnaire,
    onMenuChange,
    onAllergiesChange,
    onAlcoholChange,
    onSuggestedTracksChange,
    isPending,
    showName = true,
    children,
}: GuestPreferenceCardProps) {
    const [localMenu, setLocalMenu] = useState<MenuChoice>(questionnaire.menuChoice);
    const [localAllergies, setLocalAllergies] = useState<AllergenType[]>(questionnaire.allergies);
    const [localAllergiesOther, setLocalAllergiesOther] = useState(questionnaire.allergiesOther);
    const [localHasNoAllergies, setLocalHasNoAllergies] = useState(questionnaire.hasNoAllergies);
    const [localAlcohol, setLocalAlcohol] = useState<AlcoholPreference[]>(questionnaire.alcoholPreferences);
    const [localTracks, setLocalTracks] = useState<string[]>(questionnaire.suggestedTracks || []);
    const [isUpdating, setIsUpdating] = useState(false);

    const showKidsOption = (guest.age ?? 100) < 12;
    const disabled = isPending || isUpdating;

    const handleMenuSelect = useCallback(async (choice: MenuChoice) => {
        setLocalMenu(choice);
        setIsUpdating(true);
        try {
            await onMenuChange(guest._id, choice);
        } catch {
            setLocalMenu(questionnaire.menuChoice); // Revert on error
        } finally {
            setIsUpdating(false);
        }
    }, [guest._id, questionnaire.menuChoice, onMenuChange]);

    const handleAllergiesUpdate = useCallback(async (
        allergies: AllergenType[],
        allergiesOther: string,
        hasNoAllergies: boolean
    ) => {
        setLocalAllergies(allergies);
        setLocalAllergiesOther(allergiesOther);
        setLocalHasNoAllergies(hasNoAllergies);
        setIsUpdating(true);
        try {
            await onAllergiesChange(guest._id, allergies, allergiesOther, hasNoAllergies);
        } catch {
            // Revert on error
            setLocalAllergies(questionnaire.allergies);
            setLocalAllergiesOther(questionnaire.allergiesOther);
            setLocalHasNoAllergies(questionnaire.hasNoAllergies);
        } finally {
            setIsUpdating(false);
        }
    }, [guest._id, questionnaire.allergies, questionnaire.allergiesOther, questionnaire.hasNoAllergies, onAllergiesChange]);

    const handleAlcoholSelect = useCallback(async (preferences: AlcoholPreference[]) => {
        setLocalAlcohol(preferences);
        setIsUpdating(true);
        try {
            await onAlcoholChange(guest._id, preferences);
        } catch {
            setLocalAlcohol(questionnaire.alcoholPreferences); // Revert on error
        } finally {
            setIsUpdating(false);
        }
    }, [guest._id, questionnaire.alcoholPreferences, onAlcoholChange]);

    const handleTracksUpdate = useCallback(async (tracks: string[]) => {
        setLocalTracks(tracks);
        setIsUpdating(true);
        try {
            await onSuggestedTracksChange(guest._id, tracks);
        } catch {
            setLocalTracks(questionnaire.suggestedTracks || []); // Revert on error
        } finally {
            setIsUpdating(false);
        }
    }, [guest._id, questionnaire.suggestedTracks, onSuggestedTracksChange]);

    return (
        <div className="rounded-2xl bg-white p-5 shadow-md">
            {/* Guest Name Header - Optional */}
            {showName && (
                <div className="mb-6 flex items-center gap-2 border-b border-muted/20 pb-3">
                    <span className="text-lg">👤</span>
                    <h4 className="font-inter text-lg font-semibold text-charcoal">
                        {guest.guestName}
                        {showKidsOption && (
                            <span className="ml-2 text-sm font-normal text-muted">(ребёнок)</span>
                        )}
                    </h4>
                </div>
            )}

            {/* Menu Choice Section */}
            <div className="mb-8">
                <MenuChoiceButtons
                    selected={localMenu}
                    showKidsOption={showKidsOption}
                    onSelect={handleMenuSelect}
                    disabled={disabled}
                />
            </div>

            {/* Alcohol Preferences Section */}
            <div className="mb-8">
                <AlcoholPreferenceButtons
                    selected={localAlcohol}
                    onSelect={handleAlcoholSelect}
                    disabled={disabled}
                />
            </div>

            {/* Allergies Section */}
            <div className="mb-8">
                <AllergyInput
                    allergies={localAllergies}
                    allergiesOther={localAllergiesOther}
                    hasNoAllergies={localHasNoAllergies}
                    onUpdate={handleAllergiesUpdate}
                    disabled={disabled}
                />
            </div>

            {/* Suggested Tracks Section */}
            <div className="mb-8">
                <SuggestedTracksInput
                    tracks={localTracks}
                    onUpdate={handleTracksUpdate}
                    disabled={disabled}
                />
            </div>

            {/* Embedded Children (Transfer, Accommodation sections for single guest) */}
            {children && (
                <div className="mt-8 pt-6 border-t border-muted/20">
                    {children}
                </div>
            )}
        </div>
    );
}

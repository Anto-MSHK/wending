"use client";

import { useTransition, useState, useMemo, useCallback } from "react";
import { MenuChoice, AllergenType, AlcoholPreference } from "@/models/GuestQuestionnaire";
import {
    updateGuestMenu,
    updateGuestAllergies,
    updateGuestAlcohol,
    updateGuestTransfer,
    updateHouseholdTransfer,
    updateGuestSuggestedTracks,
    updateGuestAccommodation,
    updateHouseholdAccommodation,
} from "@/actions/questionnaire.actions";
import { GuestQuestionnaireSectionProps, QuestionnaireData } from "./types";
import { GuestPreferenceCard } from "./GuestPreferenceCard";
import { TransferSection } from "./TransferSection";
import AccommodationSection from "./AccommodationSection";

/**
 * Main questionnaire section that appears after RSVP confirmation.
 * Only displays if at least one guest is attending.
 * Shows per-guest preference cards and transfer section.
 * 
 * @see Story 2.4 - AC 1, 2
 */
export function GuestQuestionnaireSection({
    guests,
    questionnaires: initialQuestionnaires,
    householdId,
    isHeadOfHousehold,
}: GuestQuestionnaireSectionProps) {
    const [isPending, startTransition] = useTransition();
    const [questionnaires, setQuestionnaires] = useState<QuestionnaireData[]>(initialQuestionnaires);

    // Filter to only attending guests
    const attendingGuests = useMemo(
        () => guests.filter((g) => g.isAttending === true),
        [guests]
    );



    // Get questionnaire for a guest (or create empty default)
    const getQuestionnaire = useCallback((guestId: string): QuestionnaireData => {
        return questionnaires.find(q => q.guestId === guestId) || {
            guestId,
            menuChoice: null,
            allergies: [],
            allergiesOther: '',
            hasNoAllergies: false,
            alcoholPreferences: [],
            needsTransfer: null,
            hasAccommodation: null,
            suggestedTracks: [],
        };
    }, [questionnaires]);

    const updateQuestionnaire = useCallback((guestId: string, updates: Partial<QuestionnaireData>) => {
        setQuestionnaires(prev => {
            const existing = prev.find(q => q.guestId === guestId);
            if (existing) {
                return prev.map(q => q.guestId === guestId ? { ...q, ...updates } : q);
            } else {
                return [...prev, {
                    guestId,
                    menuChoice: null,
                    allergies: [],
                    allergiesOther: '',
                    hasNoAllergies: false,
                    alcoholPreferences: [],
                    needsTransfer: null,
                    hasAccommodation: null,
                    suggestedTracks: [],
                    ...updates,
                }];
            }
        });
    }, []);

    const handleMenuChange = useCallback(async (guestId: string, menuChoice: MenuChoice) => {
        updateQuestionnaire(guestId, { menuChoice });

        startTransition(async () => {
            const result = await updateGuestMenu(guestId, menuChoice);
            if (!result.success) {
                const original = initialQuestionnaires.find(q => q.guestId === guestId);
                updateQuestionnaire(guestId, { menuChoice: original?.menuChoice ?? null });
                console.error("Menu update failed:", result.error);
            }
        });
    }, [initialQuestionnaires, updateQuestionnaire]);

    const handleAllergiesChange = useCallback(async (
        guestId: string,
        allergies: AllergenType[],
        allergiesOther: string,
        hasNoAllergies: boolean
    ) => {
        updateQuestionnaire(guestId, { allergies, allergiesOther, hasNoAllergies });

        startTransition(async () => {
            const result = await updateGuestAllergies(guestId, allergies, allergiesOther, hasNoAllergies);
            if (!result.success) {
                const original = initialQuestionnaires.find(q => q.guestId === guestId);
                updateQuestionnaire(guestId, {
                    allergies: original?.allergies ?? [],
                    allergiesOther: original?.allergiesOther ?? '',
                    hasNoAllergies: original?.hasNoAllergies ?? false,
                });
                console.error("Allergies update failed:", result.error);
            }
        });
    }, [initialQuestionnaires, updateQuestionnaire]);

    const handleAlcoholChange = useCallback(async (guestId: string, alcoholPreferences: AlcoholPreference[]) => {
        updateQuestionnaire(guestId, { alcoholPreferences });

        startTransition(async () => {
            const result = await updateGuestAlcohol(guestId, alcoholPreferences);
            if (!result.success) {
                const original = initialQuestionnaires.find(q => q.guestId === guestId);
                updateQuestionnaire(guestId, { alcoholPreferences: original?.alcoholPreferences ?? [] });
                console.error("Alcohol update failed:", result.error);
            }
        });
    }, [initialQuestionnaires, updateQuestionnaire]);

    const handleGuestTransferChange = useCallback(async (guestId: string, needsTransfer: boolean) => {
        updateQuestionnaire(guestId, { needsTransfer });

        startTransition(async () => {
            const result = await updateGuestTransfer(guestId, needsTransfer);
            if (!result.success) {
                const original = initialQuestionnaires.find(q => q.guestId === guestId);
                updateQuestionnaire(guestId, { needsTransfer: original?.needsTransfer ?? null });
                console.error("Transfer update failed:", result.error);
            }
        });
    }, [initialQuestionnaires, updateQuestionnaire]);

    const handleBulkTransferChange = useCallback(async (needsTransfer: boolean) => {
        // Optimistic update for all attending guests
        attendingGuests.forEach(g => {
            updateQuestionnaire(g._id, { needsTransfer });
        });

        startTransition(async () => {
            const result = await updateHouseholdTransfer(householdId, needsTransfer);
            if (!result.success) {
                // Revert all
                attendingGuests.forEach(g => {
                    const original = initialQuestionnaires.find(q => q.guestId === g._id);
                    updateQuestionnaire(g._id, { needsTransfer: original?.needsTransfer ?? null });
                });
                console.error("Bulk transfer update failed:", result.error);
            }
        });
    }, [attendingGuests, householdId, initialQuestionnaires, updateQuestionnaire]);

    const handleSuggestedTracksChange = useCallback(async (guestId: string, suggestedTracks: string[]) => {
        updateQuestionnaire(guestId, { suggestedTracks });

        startTransition(async () => {
            const result = await updateGuestSuggestedTracks(guestId, suggestedTracks);
            if (!result.success) {
                const original = initialQuestionnaires.find(q => q.guestId === guestId);
                updateQuestionnaire(guestId, { suggestedTracks: original?.suggestedTracks ?? [] });
                console.error("Suggested tracks update failed:", result.error);
            }
        });
    }, [initialQuestionnaires, updateQuestionnaire]);

    const handleAccommodationChange = useCallback(async (guestId: string, hasAccommodation: boolean) => {
        updateQuestionnaire(guestId, { hasAccommodation });

        startTransition(async () => {
            const result = await updateGuestAccommodation(guestId, hasAccommodation);
            if (!result.success) {
                const original = initialQuestionnaires.find(q => q.guestId === guestId);
                updateQuestionnaire(guestId, { hasAccommodation: original?.hasAccommodation ?? null });
                console.error("Accommodation update failed:", result.error);
            }
        });
    }, [initialQuestionnaires, updateQuestionnaire]);

    const handleBulkAccommodationChange = useCallback(async (hasAccommodation: boolean) => {
        // Optimistic update for all attending guests
        attendingGuests.forEach(g => {
            updateQuestionnaire(g._id, { hasAccommodation });
        });

        startTransition(async () => {
            const result = await updateHouseholdAccommodation(householdId, hasAccommodation);
            if (!result.success) {
                // Revert all
                attendingGuests.forEach(g => {
                    const original = initialQuestionnaires.find(q => q.guestId === g._id);
                    updateQuestionnaire(g._id, { hasAccommodation: original?.hasAccommodation ?? null });
                });
                console.error("Bulk accommodation update failed:", result.error);
            }
        });
    }, [attendingGuests, householdId, initialQuestionnaires, updateQuestionnaire]);

    // Single guest view if not HoH (as requested: "if specific guest... unified form")
    const isSingleGuestView = !isHeadOfHousehold;

    // Don't render if no one is attending
    if (attendingGuests.length === 0) {
        return null;
    }

    return (
        <section
            id="questionnaire"
            className="animate-fade-in-up mt-8 w-full px-4"
            aria-labelledby="questionnaire-heading"
        >
            {/* Section Header */}
            <div className="mb-6 text-center">
                <h2
                    id="questionnaire-heading"
                    className="font-cormorant text-2xl font-semibold text-gold"
                >
                    🍽️ Несколько вопросов
                </h2>
                <p className="mt-1 text-sm text-charcoal/70">
                    Чтобы сделать праздник идеальным для вас
                </p>
            </div>

            {/* Guest Cards */}
            <div className="flex flex-col gap-4">
                {attendingGuests.map((guest) => (
                    <GuestPreferenceCard
                        key={guest._id}
                        guest={guest}
                        questionnaire={getQuestionnaire(guest._id)}
                        onMenuChange={handleMenuChange}
                        onAllergiesChange={handleAllergiesChange}
                        onAlcoholChange={handleAlcoholChange}
                        onTransferChange={handleGuestTransferChange}
                        onSuggestedTracksChange={handleSuggestedTracksChange}
                        isPending={isPending}
                        showName={!isSingleGuestView}
                    >
                        {/* Embed Transfer and Accommodation if Single Guest View */}
                        {isSingleGuestView && (
                            <>
                                <TransferSection
                                    guests={attendingGuests}
                                    questionnaires={questionnaires}
                                    isHeadOfHousehold={isHeadOfHousehold}
                                    onGuestTransferChange={handleGuestTransferChange}
                                    onBulkTransferChange={handleBulkTransferChange}
                                    isPending={isPending}
                                    embedded={true}
                                />
                                <div className="mt-6 pt-6 border-t border-muted/20">
                                    <AccommodationSection
                                        guests={attendingGuests}
                                        questionnaires={questionnaires}
                                        isHeadOfHousehold={isHeadOfHousehold}
                                        onGuestAccommodationChange={handleAccommodationChange}
                                        onBulkAccommodationChange={handleBulkAccommodationChange}
                                        isPending={isPending}
                                        embedded={true}
                                    />
                                </div>
                            </>
                        )}
                    </GuestPreferenceCard>
                ))}

                {/* Standalone Transfer and Accommodation if Family View (HoH) */}
                {!isSingleGuestView && (
                    <>
                        <TransferSection
                            guests={attendingGuests}
                            questionnaires={questionnaires}
                            isHeadOfHousehold={isHeadOfHousehold}
                            onGuestTransferChange={handleGuestTransferChange}
                            onBulkTransferChange={handleBulkTransferChange}
                            isPending={isPending}
                            embedded={false}
                        />
                        <AccommodationSection
                            guests={attendingGuests}
                            questionnaires={questionnaires}
                            isHeadOfHousehold={isHeadOfHousehold}
                            onGuestAccommodationChange={handleAccommodationChange}
                            onBulkAccommodationChange={handleBulkAccommodationChange}
                            isPending={isPending}
                            embedded={false}
                        />
                    </>
                )}
            </div>
        </section>
    );
}

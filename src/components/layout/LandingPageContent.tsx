"use client";

import { useState, useCallback } from "react";
import { PersonalGreeting } from "@/components/layout/PersonalGreeting";
import { GuestQuestionnaireSection } from "@/components/questionnaire/GuestQuestionnaireSection";
import { HeroSection } from "@/components/layout/HeroSection";
import { LoveStorySection } from "@/components/sections/LoveStorySection";
import { RestaurantDetails } from "@/components/layout/RestaurantDetails";
import { CountdownTimer } from "@/components/layout/CountdownTimer";
import { GuestForRSVP } from "@/components/rsvp/types";
import { GuestForQuestionnaire, QuestionnaireData } from "@/components/questionnaire/types";

interface LandingPageContentProps {
    guestName: string;
    isFamily: boolean;
    guestGender: 'male' | 'female';
    guestsForRSVP: GuestForRSVP[];
    guestsForQuestionnaire: GuestForQuestionnaire[];
    questionnairesData: QuestionnaireData[];
    householdName: string;
    householdId: string;
    isHeadOfHousehold: boolean;
}

export function LandingPageContent({
    guestName,
    isFamily,
    guestGender,
    guestsForRSVP: initialRSVPGuests,
    guestsForQuestionnaire,
    questionnairesData,
    householdName,
    householdId,
    isHeadOfHousehold,
}: LandingPageContentProps) {
    // Shared state for attendance
    // Initialize from props
    const [guestsRSVP, setGuestsRSVP] = useState<GuestForRSVP[]>(initialRSVPGuests);

    // Derived state for questionnaire visibility
    const updatedGuestsForQuestionnaire = guestsForQuestionnaire.map(g => ({
        ...g,
        isAttending: guestsRSVP.find(r => r._id === g._id)?.isAttending ?? g.isAttending
    }));

    // Handler to update local state from RSVP section
    const handleRSVPUpdate = useCallback((guestId: string, isAttending: boolean) => {
        setGuestsRSVP(prev =>
            prev.map(g => g._id === guestId ? { ...g, isAttending } : g)
        );
    }, []);

    return (
        <main lang="ru">
            <HeroSection />

            <PersonalGreeting
                guestName={guestName}
                isFamily={isFamily}
                guestGender={guestGender}
                guests={guestsRSVP}
                householdName={householdName}
                householdId={householdId}
                onRSVPUpdate={handleRSVPUpdate}
            />



            <RestaurantDetails />

            <CountdownTimer />

            <LoveStorySection />

            <GuestQuestionnaireSection
                guests={updatedGuestsForQuestionnaire}
                questionnaires={questionnairesData}
                householdId={householdId}
                isHeadOfHousehold={isHeadOfHousehold}
            />
        </main>
    );
}

/**
 * Shared types for Questionnaire components
 * @see Story 2.4
 */

import { MenuChoice, AllergenType, AlcoholPreference } from "@/models/GuestQuestionnaire";

/**
 * Guest data needed for questionnaire UI
 */
export interface GuestForQuestionnaire {
    _id: string;
    guestName: string;
    age?: number;
    isAttending: boolean | null;
    isHeadOfHousehold: boolean;
    householdId: string;
}

/**
 * Questionnaire data per guest
 */
export interface QuestionnaireData {
    guestId: string;
    menuChoice: MenuChoice;
    allergies: AllergenType[];
    allergiesOther: string;
    hasNoAllergies: boolean;
    alcoholPreferences: AlcoholPreference[];
    needsTransfer: boolean | null;
    hasAccommodation: boolean | null;
    wantsSecondDay: boolean | null;
    suggestedTracks: string[];
}

/**
 * Props for GuestQuestionnaireSection container
 */
export interface GuestQuestionnaireSectionProps {
    guests: GuestForQuestionnaire[];
    questionnaires: QuestionnaireData[];
    householdId: string;
    isHeadOfHousehold: boolean;
}

/**
 * Props for individual guest preference card
 */
export interface GuestPreferenceCardProps {
    guest: GuestForQuestionnaire;
    questionnaire: QuestionnaireData;
    onMenuChange: (guestId: string, menuChoice: MenuChoice) => Promise<void>;
    onAllergiesChange: (guestId: string, allergies: AllergenType[], allergiesOther: string, hasNoAllergies: boolean) => Promise<void>;
    onAlcoholChange: (guestId: string, alcoholPreferences: AlcoholPreference[]) => Promise<void>;
    onTransferChange: (guestId: string, needsTransfer: boolean) => Promise<void>;
    onSuggestedTracksChange: (guestId: string, tracks: string[]) => Promise<void>;
    isPending: boolean;
    showName?: boolean;
    children?: React.ReactNode;
}

/**
 * Props for MenuChoiceButtons
 */
export interface MenuChoiceButtonsProps {
    selected: MenuChoice;
    showKidsOption: boolean;
    onSelect: (choice: MenuChoice) => void;
    disabled?: boolean;
}

/**
 * Props for AllergyInput
 */
export interface AllergyInputProps {
    allergies: AllergenType[];
    allergiesOther: string;
    hasNoAllergies: boolean;
    onUpdate: (allergies: AllergenType[], allergiesOther: string, hasNoAllergies: boolean) => void;
    disabled?: boolean;
}

/**
 * Props for AlcoholPreferenceButtons
 */
export interface AlcoholPreferenceButtonsProps {
    selected: AlcoholPreference[];
    onSelect: (preferences: AlcoholPreference[]) => void;
    disabled?: boolean;
}

/**
 * Props for SuggestedTracksInput
 */
export interface SuggestedTracksInputProps {
    tracks: string[];
    onUpdate: (tracks: string[]) => void;
    disabled?: boolean;
}

/**
 * Props for TransferSection (per-guest with HoH bulk option)
 */
export interface TransferSectionProps {
    guests: GuestForQuestionnaire[];
    questionnaires: QuestionnaireData[];
    isHeadOfHousehold: boolean;
    onGuestTransferChange: (guestId: string, needsTransfer: boolean) => Promise<void>;
    onBulkTransferChange: (needsTransfer: boolean) => Promise<void>;
    isPending: boolean;
    embedded?: boolean;
}

/**
 * Props for SecondDaySection (per-guest with HoH bulk option)
 */
export interface SecondDaySectionProps {
    guests: GuestForQuestionnaire[];
    questionnaires: QuestionnaireData[];
    isHeadOfHousehold: boolean;
    onGuestSecondDayChange: (guestId: string, wantsSecondDay: boolean) => Promise<void>;
    onBulkSecondDayChange: (wantsSecondDay: boolean) => Promise<void>;
    isPending: boolean;
    embedded?: boolean;
}

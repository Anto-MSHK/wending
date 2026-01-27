"use client";

import { useState, useEffect, useCallback } from "react";
import { Bean, Fish, Wheat, Milk, Check, Info } from "lucide-react";
import { AllergenType } from "@/models/GuestQuestionnaire";
import { AllergyInputProps } from "./types";

const ALLERGEN_OPTIONS: { value: AllergenType; icon: React.ReactNode; label: string }[] = [
    { value: "nuts", icon: <Bean size={18} />, label: "Орехи" },
    { value: "seafood", icon: <Fish size={18} />, label: "Морепродукты" },
    { value: "gluten", icon: <Wheat size={18} />, label: "Глютен" },
    { value: "lactose", icon: <Milk size={18} />, label: "Лактоза" },
];

/**
 * Allergy input component with checkboxes for common allergens,
 * custom text field, and explicit "no allergies" option.
 * 
 * @see Story 2.4 - AC 4
 */
export function AllergyInput({
    allergies,
    allergiesOther,
    hasNoAllergies,
    onUpdate,
    disabled = false,
}: AllergyInputProps) {
    const [localOther, setLocalOther] = useState(allergiesOther);

    // Debounced update for text input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localOther !== allergiesOther) {
                onUpdate(allergies, localOther, hasNoAllergies);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localOther, allergies, allergiesOther, hasNoAllergies, onUpdate]);

    const handleAllergenToggle = useCallback((allergen: AllergenType) => {
        if (disabled) return;

        let newAllergies: AllergenType[];
        if (allergies.includes(allergen)) {
            newAllergies = allergies.filter((a) => a !== allergen);
        } else {
            newAllergies = [...allergies, allergen];
        }

        // Clear "no allergies" when selecting an allergen
        onUpdate(newAllergies, localOther, false);
    }, [allergies, localOther, onUpdate, disabled]);

    const handleNoAllergies = useCallback(() => {
        if (disabled) return;

        // Clear all allergies and set flag
        onUpdate([], "", true);
        setLocalOther("");
    }, [disabled, onUpdate]);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium text-charcoal">Пищевые ограничения</span>
            </div>
            <p className="mb-4 text-xs text-charcoal/80">
                Пожалуйста, укажите, если у вас есть аллергия или особые требования к еде
            </p>

            {/* Common allergens */}
            <div className="flex flex-wrap gap-2">
                {ALLERGEN_OPTIONS.map((option) => {
                    const isSelected = allergies.includes(option.value);

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleAllergenToggle(option.value)}
                            disabled={disabled}
                            aria-pressed={isSelected}
                            className={`
                                flex items-center gap-1.5 rounded-lg px-3 py-2
                                text-sm transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                                ${isSelected
                                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                                    : "border border-muted/30 bg-white text-charcoal hover:border-amber-300"
                                }
                                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            `}
                        >
                            {option.icon}
                            <span>{option.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* No allergies button */}
            <button
                type="button"
                onClick={handleNoAllergies}
                disabled={disabled}
                aria-pressed={hasNoAllergies}
                className={`
                    relative flex items-center gap-2 rounded-lg px-3 py-2
                    text-sm transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                    ${hasNoAllergies
                        ? "bg-sage/30 text-sage-dark border border-sage"
                        : "border border-muted/30 bg-white text-charcoal hover:border-sage"
                    }
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
            >
                <span>✓</span>
                <span>Нет ограничений</span>
            </button>

            {/* Custom allergies text field */}
            {!hasNoAllergies && (
                <div className="relative">
                    <input
                        type="text"
                        value={localOther}
                        onChange={(e) => setLocalOther(e.target.value)}
                        placeholder="Другое..."
                        disabled={disabled}
                        className={`
                            w-full rounded-lg border border-muted/30 px-3 py-2
                            text-sm text-charcoal placeholder:text-muted
                            focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
                            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                    />
                </div>
            )}
        </div>
    );
}

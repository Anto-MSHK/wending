"use client";

import { AlcoholPreference } from "@/models/GuestQuestionnaire";
import { AlcoholPreferenceButtonsProps } from "./types";

const ALCOHOL_OPTIONS: { value: AlcoholPreference; emoji: string; label: string }[] = [
    { value: "wine", emoji: "🍷", label: "Вино" },
    { value: "champagne", emoji: "🥂", label: "Шампанское" },
    { value: "spirits", emoji: "🥃", label: "Крепкие" },
    { value: "none", emoji: "🚫", label: "Безалкогольное" },
];

/**
 * Alcohol preference buttons with multi-select.
 * "Безалкогольное" is mutually exclusive with other options.
 * 
 * @see Story 2.4 - AC 5
 */
export function AlcoholPreferenceButtons({
    selected,
    onSelect,
    disabled = false,
}: AlcoholPreferenceButtonsProps) {
    const handleToggle = (value: AlcoholPreference) => {
        if (disabled) return;

        let newSelected: AlcoholPreference[];

        if (value === "none") {
            // "None" is mutually exclusive
            newSelected = selected.includes("none") ? [] : ["none"];
        } else {
            // Remove "none" if selecting alcohol option
            const withoutNone = selected.filter((v) => v !== "none");

            if (withoutNone.includes(value)) {
                // Deselect
                newSelected = withoutNone.filter((v) => v !== value);
            } else {
                // Select (multi-select allowed)
                newSelected = [...withoutNone, value];
            }
        }

        onSelect(newSelected);
    };

    const isNoneSelected = selected.includes("none");

    return (
        <div className="space-y-2">
            <span className="text-sm font-medium text-charcoal">Напитки</span>
            <div className="flex flex-wrap gap-2">
                {ALCOHOL_OPTIONS.map((option) => {
                    const isSelected = selected.includes(option.value);
                    const isDisabledByNone = isNoneSelected && option.value !== "none";

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleToggle(option.value)}
                            disabled={disabled}
                            aria-pressed={isSelected}
                            className={`
                                relative flex items-center gap-1.5 rounded-full px-3 py-2
                                text-sm transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                                ${isSelected
                                    ? option.value === "none"
                                        ? "bg-charcoal/80 text-white shadow-md"
                                        : "bg-blush text-white shadow-md scale-105"
                                    : isDisabledByNone
                                        ? "border border-muted/20 bg-gray-50 text-muted cursor-not-allowed"
                                        : "border border-muted/30 bg-white text-charcoal hover:border-blush hover:scale-102"
                                }
                                ${disabled ? "opacity-50 cursor-not-allowed" : isDisabledByNone ? "" : "cursor-pointer"}
                            `}
                        >
                            <span className="text-base">{option.emoji}</span>
                            <span>{option.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

"use client";

import { MenuChoice } from "@/models/GuestQuestionnaire";
import { MenuChoiceButtonsProps } from "./types";

/**
 * Menu choice selection with emoji buttons.
 * Shows 3 options (meat, fish, vegetarian) + kids menu if guest is a child.
 * 
 * @see Story 2.4 - AC 3
 */
export function MenuChoiceButtons({
    selected,
    showKidsOption,
    onSelect,
    disabled = false,
}: MenuChoiceButtonsProps) {
    const handleSelect = (choice: MenuChoice) => {
        if (disabled || selected === choice) return;
        onSelect(choice);
    };

    const menuOptions: { value: MenuChoice; emoji: string; label: string }[] = [
        { value: "meat", emoji: "🥩", label: "Мясо" },
        { value: "fish", emoji: "🐟", label: "Рыба" },
        { value: "vegetarian", emoji: "🥗", label: "Вегетарианское" },
    ];

    if (showKidsOption) {
        menuOptions.push({ value: "kids", emoji: "🍝", label: "Детское" });
    }

    return (
        <div className="space-y-2">
            <span className="text-sm font-medium text-charcoal">Меню</span>
            <div className="flex flex-wrap gap-2">
                {menuOptions.map((option) => {
                    const isSelected = selected === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            disabled={disabled}
                            aria-pressed={isSelected}
                            className={`
                                relative flex items-center gap-1.5 rounded-full px-3 py-2
                                text-sm transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1
                                ${isSelected
                                    ? "bg-blush text-white shadow-md scale-105"
                                    : "border border-muted/30 bg-white text-charcoal hover:border-blush hover:scale-102"
                                }
                                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
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

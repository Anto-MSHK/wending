"use client";

import { MenuChoice } from "@/models/GuestQuestionnaire";
import { Beef, Fish, Salad, Baby, Utensils } from "lucide-react";
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

    const menuOptions: { value: MenuChoice; icon: React.ReactNode; label: string }[] = [
        { value: "meat", icon: <Beef size={18} />, label: "Мясо" },
        { value: "fish", icon: <Fish size={18} />, label: "Рыба" },
        { value: "vegetarian", icon: <Salad size={18} />, label: "Вегетарианское" },
    ];

    if (showKidsOption) {
        menuOptions.push({ value: "kids", icon: <Baby size={18} />, label: "Детское" });
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
                <Utensils className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium text-charcoal">Меню</span>
            </div>
            <p className="mb-4 text-xs text-charcoal/80">
                Выберите предпочтительное основное блюдо
            </p>
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
                            {option.icon}
                            <span>{option.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

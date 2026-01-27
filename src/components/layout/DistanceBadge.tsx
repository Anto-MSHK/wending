import React from 'react';

interface DistanceBadgeProps {
    type: 'walk' | 'car';
    duration: string;
    isVisible: boolean;
}

export const DistanceBadge: React.FC<DistanceBadgeProps> = ({ type, duration, isVisible }) => {
    const bgColor = type === 'walk' ? 'bg-[#B8C9A8]' : 'bg-[#757575]'; // Sage vs Muted
    const icon = type === 'walk' ? '🚶' : '🚗';

    return (
        <div
            className={`
        flex items-center space-x-2 px-4 py-2 rounded-full text-white shadow-lg
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'}
        ${bgColor}
      `}
        >
            <span className="text-xl">{icon}</span>
            <span className="font-sans font-medium text-sm whitespace-nowrap">{duration}</span>
        </div>
    );
};

"use client";

import { useState } from "react";
import { X, Smartphone } from "lucide-react";

export function DesktopWarning() {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[9999] hidden md:flex items-center justify-center bg-black/60 backdrop-blur-lg p-4 animate-in fade-in duration-300">
            <div className="bg-[#FFF8F0] max-w-md w-full rounded-3xl p-8 shadow-2xl relative border border-[#D4C3A3]/30 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4C3A3]/20 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#D4C3A3]/20 rounded-full blur-2xl"></div>
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#D4C3A3]/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-white w-20 h-20 rounded-full flex items-center justify-center shadow-sm border border-[#D4C3A3]/40">
                        <Smartphone className="w-10 h-10 text-[#5C4A3D]" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Text content */}
                <h2 className="font-cormorant text-3xl font-medium text-[#2C2119] mb-4">
                    Лучше с телефона
                </h2>
                <p className="font-nunito text-[#5C4A3D] text-lg mb-8 leading-relaxed">
                    Сайт оптимизирован для смартфонов. Пожалуйста, откройте его на телефоне для лучшего отображения.
                </p>

                {/* Action button */}
                <button
                    onClick={() => setDismissed(true)}
                    className="group relative w-full overflow-hidden rounded-full bg-[#5C4A3D] px-8 py-4 flex items-center justify-center transition-all hover:bg-[#3D3128] hover:shadow-lg active:scale-[0.98]"
                >
                    <span className="font-nunito text-white font-medium text-lg tracking-wide relative z-10">
                        Продолжить с ПК
                    </span>
                    <div className="absolute inset-0 h-full w-full opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </button>

            </div>
        </div>
    );
}

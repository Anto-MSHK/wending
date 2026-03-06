"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Full-screen 4-flap envelope animation — mobile only.
 *
 * Four SVG-path triangles with rounded tips and overlapping edges.
 * Bases extend beyond the viewport for a natural envelope look.
 * Wax seal sits at the centre where flaps overlap.
 *
 * Sequence:
 *   1. Envelope visible immediately, text fades in
 *   2. Wax seal peels off
 *   3. Top flap opens via 3D rotateX → reveals page
 *   4. Bottom flap slides down · side flaps fade in place
 *   5. Done — scroll unlocked
 */
export function EnvelopeAnimation() {
    const [phase, setPhase] = useState<
        "closed" | "unsealing" | "opening" | "separating" | "done"
    >("closed");
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        if (!mq.matches) {
            setPhase("done");
            return;
        }

        // Force scroll-top immediately
        window.scrollTo(0, 0);

        // Aggressive lock (prevents iOS Safari bypass of overflow:hidden)
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = "0";
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.touchAction = "none";

        timerRef.current = setTimeout(() => setPhase("unsealing"), 1000);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            // Safety unlock if unmounted early
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.touchAction = "";
        };
    }, []);

    /* ── Phase transitions ── */
    const handleSealEnd = useCallback(
        (e: React.AnimationEvent) => {
            if (e.animationName !== "envelope-seal-off") return;
            timerRef.current = setTimeout(() => setPhase("opening"), 200);
        },
        [],
    );

    const handleFlapEnd = useCallback(
        (e: React.AnimationEvent) => {
            if (e.animationName !== "envelope-flap-open") return;
            timerRef.current = setTimeout(() => setPhase("separating"), 250);
        },
        [],
    );

    const handleSeparateEnd = useCallback(
        (e: React.AnimationEvent) => {
            if (e.animationName !== "envelope-part-down") return;
            // Complete unlock
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.touchAction = "";

            setPhase("done");
        },
        [],
    );

    if (phase === "done") return null;

    /* ─── Palette ─── */
    const flapTop = "#CFBECD"; // pink
    const flapBottom = "#F8F8F8"; // white-ish
    const flapSide = "#F8F8F8"; // white-ish
    const textClr = "#5C4A3D"; // dark text for light envelope

    const isPostSeal = phase === "opening" || phase === "separating";
    const isSep = phase === "separating";

    /* ─── Premium Shadows ─── */
    const shadowLeft = "drop-shadow(3px 2px 10px rgba(92, 74, 61, 0.15)) drop-shadow(1px 1px 3px rgba(92, 74, 61, 0.1))";
    const shadowRight = "drop-shadow(-3px 2px 10px rgba(92, 74, 61, 0.15)) drop-shadow(-1px 1px 3px rgba(92, 74, 61, 0.1))";
    const shadowBottom = "drop-shadow(0 -3px 12px rgba(92, 74, 61, 0.15)) drop-shadow(0 -1px 4px rgba(92, 74, 61, 0.1))";
    const shadowTop = "drop-shadow(0 4px 14px rgba(92, 74, 61, 0.18)) drop-shadow(0 1px 6px rgba(92, 74, 61, 0.12))";

    /* ── Seal scalloped-edge circles (removed as we use image now) ── */

    return (
        <div
            className="fixed inset-0 z-[9998] md:hidden overscroll-none"
            style={{ touchAction: "none" }}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
        >
            {/* ── SVG Filters for texture and gradients ── */}
            <svg width="0" height="0" className="absolute pointer-events-none">
                <defs>
                    {/* Realistic paper grain strictly masked to the shape */}
                    <filter id="paperTexture" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04 0.02" numOctaves="4" result="noise" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.04 0" in="noise" result="coloredNoise" />

                        <feTurbulence type="fractalNoise" baseFrequency="0.1 0.05" numOctaves="2" result="grain" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.025 0" in="grain" result="darkGrain" />

                        <feMerge result="combinedNoise">
                            <feMergeNode in="coloredNoise" />
                            <feMergeNode in="darkGrain" />
                        </feMerge>

                        {/* Critical step to prevent rectangular texture bleeding! */}
                        <feComposite operator="in" in="combinedNoise" in2="SourceGraphic" result="clippedNoise" />
                        <feBlend mode="multiply" in="SourceGraphic" in2="clippedNoise" />
                    </filter>

                    <linearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#EDEDED" />
                    </linearGradient>

                    <linearGradient id="gradRight" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#EDEDED" />
                    </linearGradient>

                    <linearGradient id="gradBottom" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#EDEDED" />
                    </linearGradient>

                    <linearGradient id="gradTop" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#E0D0DE" />
                        <stop offset="100%" stopColor="#C0B0BE" />
                    </linearGradient>
                </defs>
            </svg>

            {/* ── Left flap ── */}
            <div
                className={`absolute inset-0 ${isSep ? "envelope-part-left" : ""}`}
                style={{ filter: shadowLeft }}
            >
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M -150 -50 L -150 150 L 44 56 Q 50 50 44 44 Z"
                        fill="url(#gradLeft)"
                        filter="url(#paperTexture)"
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth="0.4"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* ── Right flap ── */}
            <div
                className={`absolute inset-0 ${isSep ? "envelope-part-right" : ""}`}
                style={{ filter: shadowRight }}
            >
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M 250 -50 L 250 150 L 56 56 Q 50 50 56 44 Z"
                        fill="url(#gradRight)"
                        filter="url(#paperTexture)"
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth="0.4"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* ── Bottom flap ── */}
            <div
                className={`absolute inset-0 z-[1] ${isSep ? "envelope-part-down" : ""}`}
                onAnimationEnd={isSep ? handleSeparateEnd : undefined}
                style={{ filter: shadowBottom }}
            >
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M -150 150 L 250 150 L 56 44 Q 50 40 44 44 Z"
                        fill="url(#gradBottom)"
                        filter="url(#paperTexture)"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="0.4"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* ── Top flap (3D open → reveals page) ── */}
            <div
                className="absolute inset-0 z-[2] pointer-events-none"
                style={{ perspective: "1200px" }}
            >
                <div
                    className={`absolute inset-0 ${isPostSeal ? "envelope-flap-open" : ""}`}
                    style={{
                        transformOrigin: "top center",
                        backfaceVisibility: "hidden",
                        filter: shadowTop,
                    }}
                    onAnimationEnd={
                        phase === "opening" ? handleFlapEnd : undefined
                    }
                >
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-auto"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M -150 -50 L 250 -50 L 56 56 Q 50 60 44 56 Z"
                            fill="url(#gradTop)"
                            filter="url(#paperTexture)"
                            stroke="rgba(228, 220, 223, 0.77)"
                            strokeWidth="0.4"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* ── Wax Seal ── */}
            {(phase === "closed" || phase === "unsealing") && (
                <div
                    className={`absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-[4] ${phase === "unsealing" ? "envelope-seal-off" : ""
                        }`}
                    onAnimationEnd={
                        phase === "unsealing" ? handleSealEnd : undefined
                    }
                >
                    <img
                        src="/images/seal.webp"
                        alt="Seal"
                        className="w-[200px] h-[200px] object-contain pointer-events-none"
                        style={{ filter: "drop-shadow(0 8px 16px rgba(60, 45, 35, 0.45)) drop-shadow(0 3px 6px rgba(60, 45, 35, 0.3))" }}
                    />
                </div>
            )}

            {/* ── Centered text content ── */}
            <div
                className={`absolute inset-x-0 bottom-[16%] flex flex-col items-center text-center px-10 z-[5] ${phase === "closed" ? "envelope-text-fade-in" : ""
                    } ${isPostSeal ? "envelope-part-fade" : ""}`}
            >
                <p
                    className="leading-none tracking-[0.18em]"
                    style={{
                        fontFamily: "var(--font-poiret-one), 'Poiret One', sans-serif",
                        fontSize: "clamp(1.5rem, 7vw, 2.2rem)",
                        color: "#1A1A1A",
                        fontWeight: 300,
                    }}
                >
                    ВЫ
                </p>
                <p
                    className="leading-none tracking-[0.18em] -mt-1 mb-0"
                    style={{
                        fontFamily: "var(--font-poiret-one), 'Poiret One', sans-serif",
                        fontSize: "clamp(1.5rem, 7vw, 2.2rem)",
                        color: "#1A1A1A",
                        fontWeight: 300,
                    }}
                >
                    ПРИГЛАШЕНЫ
                </p>
                <p
                    className="-mt-3"
                    style={{
                        fontFamily: "'Kindentosca', cursive",
                        fontSize: "clamp(3rem, 15vw, 5rem)",
                        color: "#B38728",
                        WebkitTextStroke: "0.4px rgba(170, 119, 28, 0.4)",
                        filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.1))"
                    }}
                >
                    на свадьбу
                </p>
            </div>
        </div>
    );
}

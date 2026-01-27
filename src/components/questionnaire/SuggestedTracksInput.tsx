"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Music, X, Loader2, Info } from "lucide-react";
import { SuggestedTracksInputProps } from "./types";

interface MusicSearchResult {
    artist: string;
    track: string;
}

const MAX_TRACKS = 5;

/**
 * Input component for suggesting music tracks with autocomplete.
 * Uses iTunes Search API via proxy route.
 */
export default function SuggestedTracksInput({
    tracks,
    onUpdate,
    disabled = false,
}: SuggestedTracksInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<MusicSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const canAddMore = tracks.length < MAX_TRACKS;

    // Debounced search
    const searchMusic = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/music-search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSuggestions(data.results || []);
            setShowDropdown(true);
        } catch (error) {
            console.error("Music search error:", error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // Debounce search
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            searchMusic(value);
        }, 300);
    };

    const addTrack = (trackString: string) => {
        if (!canAddMore) return;

        const trimmed = trackString.trim();
        if (!trimmed) return;

        // Avoid duplicates
        if (tracks.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
            setInputValue("");
            setShowDropdown(false);
            return;
        }

        onUpdate([...tracks, trimmed]);
        setInputValue("");
        setSuggestions([]);
        setShowDropdown(false);
    };

    const selectSuggestion = (result: MusicSearchResult) => {
        addTrack(`${result.artist} — ${result.track}`);
    };

    const removeTrack = (index: number) => {
        const newTracks = [...tracks];
        newTracks.splice(index, 1);
        onUpdate(newTracks);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTrack(inputValue);
        } else if (e.key === "Escape") {
            setShowDropdown(false);
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Music className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium text-charcoal">Музыка</span>
            </div>
            <p className="mb-3 text-xs text-muted">
                Предложите до 5 треков для плейлиста
            </p>

            {/* Track pills */}
            {tracks.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {tracks.map((track, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 text-sm text-charcoal"
                        >
                            <span className="max-w-[200px] truncate">{track}</span>
                            <button
                                type="button"
                                className="flex h-5 w-5 items-center justify-center rounded-full text-muted transition-colors hover:bg-gold/20 hover:text-charcoal disabled:opacity-50"
                                onClick={() => removeTrack(index)}
                                disabled={disabled}
                                aria-label={`Удалить ${track}`}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input with autocomplete */}
            {canAddMore && (
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full rounded-xl border border-muted/30 bg-white px-4 py-2.5 font-inter text-sm text-charcoal placeholder-muted/60 transition-all focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 disabled:bg-muted/10 disabled:opacity-60"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                        placeholder="Исполнитель — Название трека"
                        disabled={disabled}
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gold animate-spin">
                            <Loader2 size={16} />
                        </div>
                    )}

                    {showDropdown && suggestions.length > 0 && (
                        <div
                            ref={dropdownRef}
                            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-muted/20 bg-white shadow-lg"
                        >
                            {suggestions.map((result, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className="flex w-full flex-col items-start gap-0.5 border-b border-muted/10 px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-gold/5"
                                    onClick={() => selectSuggestion(result)}
                                >
                                    <span className="font-inter text-sm font-medium text-charcoal">
                                        {result.artist}
                                    </span>
                                    <span className="text-xs text-muted">
                                        {result.track}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!canAddMore && (
                <p className="text-xs text-muted italic">
                    Достигнут максимум в 5 треков
                </p>
            )}
        </div>
    );
}

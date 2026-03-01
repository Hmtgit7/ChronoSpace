// "use client";
// import { Tag as TagIcon, X } from "lucide-react";
// import { useTags } from "@/lib/hooks/useFeed";
// import { cn } from "@/lib/utils";
// import type { Tag } from "@/types";

// interface Props {
//     selected: string[]; // tag IDs
//     onChange: (ids: string[]) => void;
//     max?: number;
// }

// export function TagSelector({ selected, onChange, max = 5 }: Props) {
//     const { data: tags, isLoading } = useTags();

//     const toggle = (tag: Tag) => {
//         if (selected.includes(tag.id)) {
//             onChange(selected.filter((id) => id !== tag.id));
//         } else {
//             if (selected.length >= max) return;
//             onChange([...selected, tag.id]);
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex gap-2 flex-wrap">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                     <div key={i} className="h-7 w-20 bg-muted rounded-full animate-pulse" />
//                 ))}
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-2">
//             <div className="flex items-center justify-between">
//                 <label className="flex items-center gap-2 text-sm font-medium">
//                     <TagIcon className="w-4 h-4 text-primary" />
//                     Topics
//                 </label>
//                 <span className="text-xs text-muted-foreground">
//                     {selected.length}/{max} selected
//                 </span>
//             </div>

//             <div className="flex flex-wrap gap-2">
//                 {tags?.map((tag) => {
//                     const isSelected = selected.includes(tag.id);
//                     const isDisabled = !isSelected && selected.length >= max;

//                     return (
//                         <button
//                             key={tag.id}
//                             type="button"
//                             onClick={() => toggle(tag)}
//                             disabled={isDisabled}
//                             className={cn(
//                                 "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all",
//                                 isSelected
//                                     ? "text-white border-transparent"
//                                     : "border-border text-muted-foreground bg-card hover:border-primary/30 hover:text-foreground",
//                                 isDisabled && "opacity-40 cursor-not-allowed"
//                             )}
//                             style={
//                                 isSelected
//                                     ? { backgroundColor: tag.color, borderColor: tag.color }
//                                     : {}
//                             }
//                         >
//                             {tag.label}
//                             {isSelected && <X className="w-3 h-3" />}
//                         </button>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag as TagIcon, X, Plus, Loader2, AlertCircle } from "lucide-react";
import { useTags, useCreateTag } from "@/lib/hooks/useTags";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types";

interface Props {
    selected: string[];         // tag IDs
    onChange: (ids: string[]) => void;
    max?: number;
}

export function TagSelector({ selected, onChange, max = 5 }: Props) {
    const { data: tags = [], isLoading } = useTags();
    const createTag = useCreateTag();

    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const trimmed = inputValue.trim();

    // Tags filtered by input
    const filtered = trimmed
        ? tags.filter((t) =>
            t.label.toLowerCase().includes(trimmed.toLowerCase())
        )
        : tags;

    // Check if exact match already exists (case-insensitive)
    const exactMatch = tags.some(
        (t) => t.label.toLowerCase() === trimmed.toLowerCase()
    );

    const canCreate =
        trimmed.length >= 2 &&
        trimmed.length <= 30 &&
        !exactMatch &&
        /^[a-zA-Z0-9\s\-]+$/.test(trimmed);

    const selectedTags = tags.filter((t) => selected.includes(t.id));
    const atMax = selected.length >= max;

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setIsFocused(false);
                setInputValue("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggleTag = useCallback(
        (tag: Tag) => {
            setError(null);
            if (selected.includes(tag.id)) {
                onChange(selected.filter((id) => id !== tag.id));
            } else {
                if (atMax) {
                    setError(`You can add at most ${max} tags`);
                    return;
                }
                onChange([...selected, tag.id]);
            }
            setInputValue("");
        },
        [selected, onChange, atMax, max, setError, setInputValue]
    );

    const removeTag = (id: string) => {
        onChange(selected.filter((sid) => sid !== id));
        setError(null);
    };

    const handleCreate = async () => {
        if (!canCreate || atMax || createTag.isPending) return;
        setError(null);

        try {
            const newTag = await createTag.mutateAsync({ label: trimmed });
            onChange([...selected, newTag.id]);
            setInputValue("");
            setIsFocused(false);
        } catch (err: unknown) {
            const msg =
                err instanceof Error ? err.message : "Failed to create tag";
            setError(msg);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (canCreate && !atMax) {
                handleCreate();
            } else if (filtered.length === 1) {
                toggleTag(filtered[0]);
            }
        }
        if (e.key === "Escape") {
            setIsFocused(false);
            setInputValue("");
        }
        // Backspace removes last selected tag when input is empty
        if (e.key === "Backspace" && !inputValue && selected.length > 0) {
            removeTag(selected[selected.length - 1]);
        }
    };

    const showDropdown = isFocused && !atMax;

    return (
        <div className="space-y-2" ref={containerRef}>
            {/* Label row */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <TagIcon className="w-4 h-4 text-primary" />
                    Topics
                </label>
                <span
                    className={cn(
                        "text-xs transition-colors",
                        atMax ? "text-amber-500 font-medium" : "text-muted-foreground"
                    )}
                >
                    {selected.length}/{max} selected
                </span>
            </div>

            <div className="relative">
                {/* Input + selected chips */}
                <div
                    className={cn(
                        "relative min-h-[42px] flex flex-wrap items-center gap-1.5 px-3 py-2",
                        "rounded-xl border bg-card transition-all cursor-text",
                        isFocused
                            ? "border-primary ring-2 ring-primary/15"
                            : "border-border hover:border-primary/30"
                    )}
                    onClick={() => {
                        if (!atMax) {
                            inputRef.current?.focus();
                            setIsFocused(true);
                        }
                    }}
                >
                    {/* Selected tag chips */}
                    <AnimatePresence initial={false}>
                        {selectedTags.map((tag) => (
                            <motion.span
                                key={tag.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                                className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full text-xs font-medium text-white flex-shrink-0"
                                style={{ backgroundColor: tag.color }}
                            >
                                {tag.label}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTag(tag.id);
                                    }}
                                    className="w-3.5 h-3.5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>

                    {/* Text input */}
                    {!atMax && (
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setError(null);
                                setIsFocused(true);
                            }}
                            onFocus={() => setIsFocused(true)}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                selected.length === 0 ? "Add topics…" : ""
                            }
                            maxLength={30}
                            className="flex-1 min-w-[100px] bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                        />
                    )}

                    {atMax && (
                        <span className="text-xs text-muted-foreground/60 ml-1">
                            Max {max} tags reached
                        </span>
                    )}
                </div>

                {/* Dropdown */}
                <AnimatePresence>
                    {showDropdown && (
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-border bg-card shadow-xl"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <>
                                    {/* Existing matching tags */}
                                    {filtered.length > 0 && (
                                        <div className="p-1">
                                            {filtered.map((tag) => {
                                                const isSelected = selected.includes(tag.id);
                                                return (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        onClick={() => toggleTag(tag)}
                                                        className={cn(
                                                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                                                            isSelected
                                                                ? "bg-primary/8 text-primary"
                                                                : "hover:bg-secondary text-foreground"
                                                        )}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span
                                                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                                style={{ backgroundColor: tag.color }}
                                                            />
                                                            {tag.label}
                                                        </span>
                                                        {isSelected && (
                                                            <span className="text-xs text-primary font-medium">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Divider if both exist */}
                                    {filtered.length > 0 && canCreate && (
                                        <div className="border-t border-border mx-2" />
                                    )}

                                    {/* Create new tag option */}
                                    {canCreate && (
                                        <div className="p-1">
                                            <button
                                                type="button"
                                                onClick={handleCreate}
                                                disabled={createTag.isPending}
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/8 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {createTag.isPending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                                                        <Plus className="w-3 h-3 text-primary" />
                                                    </div>
                                                )}
                                                <span>
                                                    {createTag.isPending
                                                        ? "Creating…"
                                                        : `Create "${trimmed}"`}
                                                </span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Empty state — no match, can't create */}
                                    {filtered.length === 0 && !canCreate && trimmed.length > 0 && (
                                        <div className="px-4 py-5 text-center text-xs text-muted-foreground">
                                            {trimmed.length < 2
                                                ? "Type at least 2 characters"
                                                : "Invalid tag — letters, numbers, spaces and hyphens only"}
                                        </div>
                                    )}

                                    {/* Empty state — no input yet */}
                                    {filtered.length === 0 && !trimmed && (
                                        <div className="px-4 py-5 text-center text-xs text-muted-foreground">
                                            No tags yet. Start typing to create one.
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-xs text-destructive"
                    >
                        <AlertCircle className="w-3 h-3" />
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>

        </div>
    );
}

"use client";
import { motion } from "framer-motion";
import { Tag as TagIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTags } from "@/lib/hooks/useTags";
import type { Tag } from "@/types";

interface Props {
    selected: string | undefined; // tag name
    onSelect: (tag: string | undefined) => void;
}

export function TagFilter({ selected, onSelect }: Props) {
    const { data: tags, isLoading } = useTags();

    if (isLoading) {
        return (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-7 w-20 bg-muted rounded-full animate-pulse flex-shrink-0" />
                ))}
            </div>
        );
    }

    if (!tags?.length) return null;

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* All pill */}
            <button
                onClick={() => onSelect(undefined)}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all flex-shrink-0",
                    !selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground bg-card"
                )}
            >
                <TagIcon className="w-3 h-3" />
                All Topics
            </button>

            {tags.map((tag) => (
                <TagPill
                    key={tag.id}
                    tag={tag}
                    selected={selected === tag.name}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}

// ── Extracted atom ─────────────────────────────────────
interface TagPillProps {
    tag: Tag;
    selected: boolean;
    onSelect: (name: string | undefined) => void;
}

function TagPill({ tag, selected, onSelect }: TagPillProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(selected ? undefined : tag.name)}
            className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all flex-shrink-0",
                selected
                    ? "text-white border-transparent"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground bg-card"
            )}
            style={selected ? { backgroundColor: tag.color, borderColor: tag.color } : {}}
        >
            {tag.label}
            {selected && <X className="w-3 h-3" />}
        </motion.button>
    );
}

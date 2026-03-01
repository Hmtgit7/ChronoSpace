"use client";
import { Tag as TagIcon, X } from "lucide-react";
import { useTags } from "@/lib/hooks/useFeed";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types";

interface Props {
    selected: string[]; // tag IDs
    onChange: (ids: string[]) => void;
    max?: number;
}

export function TagSelector({ selected, onChange, max = 5 }: Props) {
    const { data: tags, isLoading } = useTags();

    const toggle = (tag: Tag) => {
        if (selected.includes(tag.id)) {
            onChange(selected.filter((id) => id !== tag.id));
        } else {
            if (selected.length >= max) return;
            onChange([...selected, tag.id]);
        }
    };

    if (isLoading) {
        return (
            <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-7 w-20 bg-muted rounded-full animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <TagIcon className="w-4 h-4 text-primary" />
                    Topics
                </label>
                <span className="text-xs text-muted-foreground">
                    {selected.length}/{max} selected
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                {tags?.map((tag) => {
                    const isSelected = selected.includes(tag.id);
                    const isDisabled = !isSelected && selected.length >= max;

                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggle(tag)}
                            disabled={isDisabled}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all",
                                isSelected
                                    ? "text-white border-transparent"
                                    : "border-border text-muted-foreground bg-card hover:border-primary/30 hover:text-foreground",
                                isDisabled && "opacity-40 cursor-not-allowed"
                            )}
                            style={
                                isSelected
                                    ? { backgroundColor: tag.color, borderColor: tag.color }
                                    : {}
                            }
                        >
                            {tag.label}
                            {isSelected && <X className="w-3 h-3" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

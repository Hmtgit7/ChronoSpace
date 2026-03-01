"use client";
import { Rss, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeedSort } from "@/lib/api/public";

interface Props {
    sort: FeedSort;
    onSortChange: (s: FeedSort) => void;
}

const TABS: { label: string; value: FeedSort; icon: React.ElementType }[] = [
    { label: "Latest", value: "latest", icon: Rss },
    { label: "Trending", value: "trending", icon: TrendingUp },
];

export function FeedTabs({ sort, onSortChange }: Props) {
    return (
        <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-card w-fit">
            {TABS.map(({ label, value, icon: Icon }) => (
                <button
                    key={value}
                    onClick={() => onSortChange(value)}
                    className={cn(
                        "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                        sort === value
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                </button>
            ))}
        </div>
    );
}

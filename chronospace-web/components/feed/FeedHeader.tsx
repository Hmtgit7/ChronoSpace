"use client";
import { Search, LayoutGrid, List, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface Props {
    search: string;
    onSearchChange: (v: string) => void;
    view: ViewMode;
    onViewChange: (v: ViewMode) => void;
    totalCount?: number;
}

export function FeedHeader({
    search,
    onSearchChange,
    view,
    onViewChange,
    totalCount,
}: Props) {
    return (
        <div className="mb-10">
            {/* Title block */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-medium mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Public Feed
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                    Discover great{" "}
                    <span className="gradient-text">stories</span>
                </h1>
                {totalCount !== undefined && (
                    <p className="text-muted-foreground text-sm">
                        <span className="text-primary font-semibold">{totalCount}</span> published stories and counting
                    </p>
                )}
            </div>

            {/* Search + view toggle bar */}
            <div className="flex items-center gap-3 max-w-2xl mx-auto">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search stories by title or author..."
                        className="pl-10 pr-10 h-11 rounded-xl border-border bg-card text-sm focus-visible:ring-primary/20 focus-visible:border-primary"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-card">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewChange("grid")}
                        className={cn(
                            "w-9 h-9 rounded-lg",
                            view === "grid" && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                        title="Grid view"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewChange("list")}
                        className={cn(
                            "w-9 h-9 rounded-lg",
                            view === "list" && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                        title="List view"
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

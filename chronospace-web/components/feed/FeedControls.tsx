'use client';
import { LayoutGrid, List, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ViewMode = 'tiles' | 'list';

interface FeedControlsProps {
    search: string;
    onSearchChange: (value: string) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    resultCount?: number;
    isSearching?: boolean;
}

export function FeedControls({
    search,
    onSearchChange,
    viewMode,
    onViewModeChange,
    resultCount,
    isSearching,
}: FeedControlsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8"
        >
            {/* Search bar */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search stories by title or content..."
                    className="pl-9 pr-9 h-10 bg-background border-border focus-visible:ring-1 focus-visible:ring-primary/50"
                />
                {search && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Search result count */}
            {search && !isSearching && resultCount !== undefined && (
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {resultCount} {resultCount === 1 ? 'result' : 'results'}
                </span>
            )}

            {/* View toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg border border-border self-start sm:self-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewModeChange('tiles')}
                    className={cn(
                        'h-8 w-8 p-0 rounded-md transition-all',
                        viewMode === 'tiles'
                            ? 'bg-background shadow-sm text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                    title="Tile view"
                >
                    <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewModeChange('list')}
                    className={cn(
                        'h-8 w-8 p-0 rounded-md transition-all',
                        viewMode === 'list'
                            ? 'bg-background shadow-sm text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                    title="List view"
                >
                    <List className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}

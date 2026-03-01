'use client';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterStatus = 'all' | 'published' | 'draft';

interface BlogFiltersProps {
    search: string;
    status: FilterStatus;
    onSearch: (v: string) => void;
    onStatus: (v: FilterStatus) => void;
    total: number;
}

const STATUS_OPTIONS: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Drafts', value: 'draft' },
];

export function BlogFilters({ search, status, onSearch, onStatus, total }: BlogFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search blogs…"
                    className="w-full pl-9 pr-8 py-2 text-sm rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                />
                {search && (
                    <button
                        onClick={() => onSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Status filter pills */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/60 border border-border">
                {STATUS_OPTIONS.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => onStatus(value)}
                        className={cn(
                            'px-3 py-1 text-xs font-medium rounded-md transition-all',
                            status === value
                                ? 'bg-background text-foreground shadow-sm border border-border'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <p className="text-xs text-muted-foreground ml-auto sm:ml-0">
                {total} result{total !== 1 ? 's' : ''}
            </p>
        </div>
    );
}

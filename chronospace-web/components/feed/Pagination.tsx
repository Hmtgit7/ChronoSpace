'use client';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeedMeta } from '@/types';

interface Props {
    meta: FeedMeta;
    page: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export function Pagination({ meta, page, onPageChange, isLoading }: Props) {
    const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1);

    // Show max 5 page numbers with ellipsis logic
    const getVisiblePages = () => {
        if (meta.totalPages <= 5) return pages;
        if (page <= 3) return [1, 2, 3, 4, 5];
        if (page >= meta.totalPages - 2)
            return pages.slice(meta.totalPages - 5);
        return [page - 2, page - 1, page, page + 1, page + 2];
    };

    const visible = getVisiblePages();

    if (meta.totalPages <= 1) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-1 mt-10"
        >
            {/* Prev */}
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={!meta.hasPreviousPage || isLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* First page + ellipsis */}
            {visible[0] > 1 && (
                <>
                    <PageBtn n={1} current={page} onClick={onPageChange} />
                    {visible[0] > 2 && (
                        <span className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm">…</span>
                    )}
                </>
            )}

            {/* Visible pages */}
            {visible.map((n) => (
                <PageBtn key={n} n={n} current={page} onClick={onPageChange} disabled={isLoading} />
            ))}

            {/* Last page + ellipsis */}
            {visible[visible.length - 1] < meta.totalPages && (
                <>
                    {visible[visible.length - 1] < meta.totalPages - 1 && (
                        <span className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm">…</span>
                    )}
                    <PageBtn n={meta.totalPages} current={page} onClick={onPageChange} />
                </>
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={!meta.hasNextPage || isLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

function PageBtn({
    n, current, onClick, disabled,
}: {
    n: number; current: number; onClick: (n: number) => void; disabled?: boolean;
}) {
    const active = n === current;
    return (
        <button
            onClick={() => onClick(n)}
            disabled={disabled}
            className={cn(
                'w-9 h-9 rounded-xl text-sm font-medium border transition-all',
                active
                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            )}
        >
            {n}
        </button>
    );
}

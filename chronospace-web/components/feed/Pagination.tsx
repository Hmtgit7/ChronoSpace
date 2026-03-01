'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { FeedMeta } from '@/types';

interface PaginationProps {
    meta: FeedMeta;
    page: number;
    onPageChange: (p: number) => void;
    isLoading?: boolean;
}

function getPageRange(current: number, total: number): (number | '…')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
    if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '…', current - 1, current, current + 1, '…', total];
}

export function Pagination({ meta, page, onPageChange, isLoading }: PaginationProps) {
    if (meta.totalPages <= 1) return null;

    const pages = getPageRange(page, meta.totalPages);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-1.5 mt-10"
        >
            {/* Prev */}
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={!meta.hasPreviousPage || isLoading}
                className={cn(
                    'w-9 h-9 rounded-lg border flex items-center justify-center transition-all text-sm',
                    meta.hasPreviousPage && !isLoading
                        ? 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5'
                        : 'bg-muted border-border text-muted-foreground/30 cursor-not-allowed'
                )}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {pages.map((p, i) =>
                p === '…' ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="w-9 h-9 flex items-center justify-center text-xs text-muted-foreground"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        disabled={isLoading}
                        className={cn(
                            'w-9 h-9 rounded-lg border text-sm font-medium transition-all',
                            page === p
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/25'
                                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5'
                        )}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={!meta.hasNextPage || isLoading}
                className={cn(
                    'w-9 h-9 rounded-lg border flex items-center justify-center transition-all text-sm',
                    meta.hasNextPage && !isLoading
                        ? 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5'
                        : 'bg-muted border-border text-muted-foreground/30 cursor-not-allowed'
                )}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

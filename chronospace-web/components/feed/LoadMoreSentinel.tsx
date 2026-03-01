'use client';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadMoreSentinelProps {
    onIntersect: () => void;
    isLoading: boolean;
    hasMore: boolean;
}

export function LoadMoreSentinel({ onIntersect, isLoading, hasMore }: LoadMoreSentinelProps) {
    const ref = useRef<HTMLDivElement>(null);
    const callbackRef = useRef(onIntersect);
    callbackRef.current = onIntersect;

    useEffect(() => {
        if (!ref.current || !hasMore) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isLoading) {
                    callbackRef.current();
                }
            },
            { rootMargin: '300px' }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [hasMore, isLoading]);

    return (
        <div ref={ref} className="flex items-center justify-center py-10">
            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading more stories…
                </div>
            )}
        </div>
    );
}

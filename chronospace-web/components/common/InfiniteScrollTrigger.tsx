"use client";
import { useEffect, useRef } from "react";

interface Props {
    onIntersect: () => void;
    enabled?: boolean;
}

export function InfiniteScrollTrigger({ onIntersect, enabled = true }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!enabled) return;
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) onIntersect();
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [onIntersect, enabled]);

    return <div ref={ref} className="h-8 w-full" />;
}

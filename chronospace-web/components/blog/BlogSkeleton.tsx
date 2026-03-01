export function BlogCardSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-card p-5 animate-pulse space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-muted" />
                <div className="h-3 w-24 bg-muted rounded" />
            </div>
            <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-4/5 bg-muted rounded" />
            </div>
            <div className="space-y-1.5">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
            </div>
            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <div className="flex gap-3">
                    <div className="h-3 w-8 bg-muted rounded" />
                    <div className="h-3 w-8 bg-muted rounded" />
                </div>
                <div className="h-3 w-10 bg-muted rounded" />
            </div>
        </div>
    );
}

export function BlogRowSkeleton() {
    return (
        <div className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-3/4 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
            </div>
            <div className="hidden sm:flex gap-2">
                <div className="h-3 w-8 bg-muted rounded" />
                <div className="h-3 w-8 bg-muted rounded" />
            </div>
            <div className="h-5 w-16 bg-muted rounded-full hidden sm:block" />
        </div>
    );
}

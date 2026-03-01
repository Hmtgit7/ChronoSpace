export function BlogCardSkeleton() {
    return (
        <div className="p-5 rounded-2xl border border-border bg-card animate-pulse space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-muted" />
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-3 w-12 bg-muted rounded" />
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
            </div>
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-4/5" />
            <div className="flex gap-3 pt-2 border-t border-border/50">
                <div className="h-3 w-10 bg-muted rounded" />
                <div className="h-3 w-10 bg-muted rounded" />
            </div>
        </div>
    );
}

export function BlogListItemSkeleton() {
    return (
        <div className="flex items-start gap-4 p-4 border-b border-border last:border-0 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-full bg-muted rounded" />
                <div className="flex gap-3 mt-1">
                    <div className="h-3 w-8 bg-muted rounded" />
                    <div className="h-3 w-8 bg-muted rounded" />
                </div>
            </div>
        </div>
    );
}

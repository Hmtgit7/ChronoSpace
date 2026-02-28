
export function BlogRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-border last:border-0 animate-pulse">
            <div className="flex-1 space-y-2 min-w-0">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
            </div>
            <div className="h-6 w-16 bg-muted rounded-full" />
            <div className="h-8 w-8 bg-muted rounded-lg" />
        </div>
    );
}

export function BlogCardSkeleton() {
    return (
        <div className="p-6 rounded-2xl border border-border bg-card animate-pulse space-y-4">
            <div className="flex items-center gap-2">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
            </div>
            <div className="h-5 bg-muted rounded w-5/6" />
            <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-4/5" />
            </div>
            <div className="flex gap-3 pt-2">
                <div className="h-4 w-12 bg-muted rounded" />
                <div className="h-4 w-12 bg-muted rounded" />
            </div>
        </div>
    );
}

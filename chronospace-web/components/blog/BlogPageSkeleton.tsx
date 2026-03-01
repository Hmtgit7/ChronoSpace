const WIDTHS = ["w-full", "w-11/12", "w-3/4", "w-full", "w-5/6", "w-11/12", "w-4/5"];

export function BlogPageSkeleton() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 animate-pulse space-y-6">
            {/* Back */}
            <div className="h-4 w-20 bg-muted rounded" />

            {/* Title */}
            <div className="space-y-3 pt-2">
                <div className="h-9 bg-muted rounded w-full" />
                <div className="h-9 bg-muted rounded w-2/3" />
            </div>

            {/* Summary */}
            <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-4/5" />
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-4 pt-1">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Body */}
            <div className="space-y-3 pt-2">
                {WIDTHS.map((w, i) => (
                    <div key={i} className={`h-4 bg-muted rounded ${w}`} />
                ))}
            </div>
        </div>
    );
}

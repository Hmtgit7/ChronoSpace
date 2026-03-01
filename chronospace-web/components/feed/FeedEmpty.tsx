import { TrendingUp } from "lucide-react";
import Link from "next/link";

interface Props {
    isSearching?: boolean;
}

export function FeedEmpty({ isSearching }: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-28 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-primary/40" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
                {isSearching ? "No matching stories" : "No stories yet"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
                {isSearching
                    ? "Try a different search term or clear the search."
                    : "Be the first to publish a blog on ChronoSpace."}
            </p>
            {!isSearching && (
                <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    Start Writing
                </Link>
            )}
        </div>
    );
}

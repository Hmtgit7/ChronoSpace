import { BlogCardSkeleton } from "@/components/blog/BlogListSkeleton";
import { Navbar } from "@/components/layout/Navbar";

export default function FeedLoading() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 pt-24 pb-16 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header skeleton */}
                    <div className="text-center mb-10 space-y-3 animate-pulse">
                        <div className="h-6 w-32 bg-muted rounded-full mx-auto" />
                        <div className="h-11 w-80 max-w-full bg-muted rounded-xl mx-auto" />
                        <div className="h-4 w-48 bg-muted rounded mx-auto" />
                    </div>

                    {/* Search bar skeleton */}
                    <div className="flex gap-3 max-w-2xl mx-auto mb-10 animate-pulse">
                        <div className="flex-1 h-11 bg-muted rounded-xl" />
                        <div className="w-20 h-11 bg-muted rounded-xl" />
                    </div>

                    {/* Grid skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

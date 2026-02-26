import { BlogCardSkeleton } from '@/components/blog/BlogSkeleton';
import { Navbar } from '@/components/layout/Navbar';

export default function FeedLoading() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 pt-24 pb-16 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 text-center space-y-4">
                        <div className="h-8 w-48 bg-muted rounded-full mx-auto animate-pulse" />
                        <div className="h-12 w-96 max-w-full bg-muted rounded-xl mx-auto animate-pulse" />
                        <div className="h-4 w-72 bg-muted rounded mx-auto animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => <BlogCardSkeleton key={i} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}

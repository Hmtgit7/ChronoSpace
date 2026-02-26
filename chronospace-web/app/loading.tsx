import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-sm text-muted-foreground animate-pulse">Loading ChronoSpace...</p>
            </div>
        </div>
    );
}

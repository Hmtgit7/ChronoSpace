import Link from 'next/link';
import { Feather, Home, Rss } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            {/* Big 404 */}
            <div className="relative mb-8">
                <p className="text-[10rem] font-extrabold text-primary/10 leading-none select-none">
                    404
                </p>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                        <Feather className="w-8 h-8 text-primary" />
                    </div>
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">Page not found</h1>
            <p className="text-muted-foreground max-w-sm mb-8">
                The page you're looking for doesn't exist or may have been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                    <Home className="w-4 h-4" /> Go Home
                </Link>
                <Link
                    href="/feed"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-secondary transition-colors font-medium"
                >
                    <Rss className="w-4 h-4" /> Browse Feed
                </Link>
            </div>
        </div>
    );
}

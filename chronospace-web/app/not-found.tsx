import Link from "next/link";
import { Feather, Home, Rss } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            {/* Large number */}
            <p className="text-[9rem] font-black text-primary/8 leading-none select-none mb-0">
                404
            </p>

            {/* Icon overlaid */}
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center -mt-10 mb-6 relative z-10">
                <Feather className="w-7 h-7 text-primary" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Page not found</h1>
            <p className="text-sm text-muted-foreground max-w-sm mb-8">
                The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    <Home className="w-4 h-4" />
                    Go Home
                </Link>
                <Link
                    href="/feed"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
                >
                    <Rss className="w-4 h-4" />
                    Browse Feed
                </Link>
            </div>
        </div>
    );
}

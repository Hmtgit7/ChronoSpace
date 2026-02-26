'use client';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground max-w-sm mb-2">
                An unexpected error occurred. This has been noted.
            </p>
            {error.digest && (
                <p className="text-xs text-muted-foreground/60 mb-8 font-mono">
                    Error ID: {error.digest}
                </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Try Again
                </button>
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-secondary transition-colors font-medium"
                >
                    <Home className="w-4 h-4" /> Go Home
                </Link>
            </div>
        </div>
    );
}

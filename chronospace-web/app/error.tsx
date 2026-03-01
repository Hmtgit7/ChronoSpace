"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: Props) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-6">
                <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground text-sm max-w-sm mb-2">
                An unexpected error occurred. The issue has been noted.
            </p>

            {error.digest && (
                <p className="text-xs text-muted-foreground/50 font-mono mb-8">
                    ID: {error.digest}
                </p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
                >
                    <Home className="w-4 h-4" />
                    Go Home
                </Link>
            </div>
        </div>
    );
}

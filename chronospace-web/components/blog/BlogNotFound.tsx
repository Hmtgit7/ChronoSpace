import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

export function BlogNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Blog not found</h1>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                This blog may have been deleted, made private, or the URL might be
                incorrect.
            </p>
            <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Feed
            </Link>
        </div>
    );
}

'use client';
import Link from 'next/link';
import { PenSquare, ArrowRight } from 'lucide-react';

export function QuickWriteCTA() {
    return (
        <Link
            href="/dashboard/new"
            className="flex items-center justify-between p-5 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors group"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                    <PenSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">Write your first blog</p>
                    <p className="text-xs text-muted-foreground">
                        Share your thoughts and ideas with the world
                    </p>
                </div>
            </div>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </Link>
    );
}

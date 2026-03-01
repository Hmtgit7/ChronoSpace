'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

interface DashboardHeaderProps {
    username?: string;
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
    const greeting = useMemo(getGreeting, []);

    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                    {greeting},{' '}
                    <span className="text-primary">@{username ?? '…'}</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                    Here&apos;s an overview of your writing activity.
                </p>
            </div>
            <Button asChild size="sm" className="flex-shrink-0 hidden sm:flex">
                <Link href="/dashboard/new">
                    <PenSquare className="w-4 h-4 mr-2" />
                    New Blog
                </Link>
            </Button>
        </div>
    );
}

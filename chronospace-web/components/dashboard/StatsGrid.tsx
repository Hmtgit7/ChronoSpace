'use client';
import { motion } from 'framer-motion';
import { Eye, FileText, Heart, MessageSquare } from 'lucide-react';
import type { Blog } from '@/types';

interface StatsGridProps {
    blogs?: Blog[];
    isLoading?: boolean;
}

const STATS_CONFIG = [
    {
        key: 'published' as const,
        label: 'Published',
        icon: Eye,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
    },
    {
        key: 'drafts' as const,
        label: 'Drafts',
        icon: FileText,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
    },
    {
        key: 'likes' as const,
        label: 'Total Likes',
        icon: Heart,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
    },
    {
        key: 'comments' as const,
        label: 'Comments',
        icon: MessageSquare,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
    },
];

function computeStats(blogs: Blog[]) {
    return {
        published: blogs.filter((b) => b.isPublished).length,
        drafts: blogs.filter((b) => !b.isPublished).length,
        likes: blogs.reduce((acc, b) => acc + (b._count?.likes ?? 0), 0),
        comments: blogs.reduce((acc, b) => acc + (b._count?.comments ?? 0), 0),
    };
}

export function StatsGrid({ blogs, isLoading }: StatsGridProps) {
    const values = blogs ? computeStats(blogs) : null;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS_CONFIG.map(({ key, label, icon: Icon, color, bg, border }, i) => (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 + 0.1, duration: 0.35 }}
                    className={`p-5 rounded-xl border bg-card transition-colors hover:border-primary/20 ${border}`}
                >
                    <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                        <Icon className={`w-4.5 h-4.5 ${color}`} />
                    </div>
                    {isLoading ? (
                        <div className="h-7 w-10 bg-muted rounded animate-pulse mb-1" />
                    ) : (
                        <p className="text-2xl font-bold text-foreground tabular-nums">
                            {values?.[key] ?? 0}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </motion.div>
            ))}
        </div>
    );
}

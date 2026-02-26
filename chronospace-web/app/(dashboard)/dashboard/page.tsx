'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PenSquare, FileText, Eye, Heart, MessageSquare, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { useMyBlogs } from '@/lib/hooks/useBlogs';
import { useAuthStore } from '@/lib/store/auth.store';
import { BlogRowSkeleton } from '@/components/blog/BlogSkeleton';
import { BlogRow } from '@/components/blog/BlogRow';
import { timeAgo } from '@/lib/utils';

const fadeUp = (i = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.07, duration: 0.4 },
});

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { data: blogs, isLoading } = useMyBlogs();

    const published = blogs?.filter((b) => b.isPublished).length ?? 0;
    const drafts = blogs?.filter((b) => !b.isPublished).length ?? 0;
    const totalLikes = blogs?.reduce((acc, b) => acc + (b._count?.likes ?? 0), 0) ?? 0;
    const totalComments = blogs?.reduce((acc, b) => acc + (b._count?.comments ?? 0), 0) ?? 0;

    const stats = [
        { label: 'Published', value: published, icon: Eye, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Drafts', value: drafts, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Likes', value: totalLikes, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Comments', value: totalComments, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    ];

    const recent = blogs?.slice(0, 5) ?? [];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Greeting */}
            <motion.div {...fadeUp(0)}>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                    Good {getGreeting()}, <span className="text-primary">@{user?.username}</span> 👋
                </h1>
                <p className="text-muted-foreground">Here's what's happening with your blogs today.</p>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <motion.div key={s.label} {...fadeUp(i + 1)}>
                        <div className="p-5 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                            {isLoading ? (
                                <div className="h-7 w-12 bg-muted rounded animate-pulse mb-1" />
                            ) : (
                                <p className="text-2xl font-bold">{s.value}</p>
                            )}
                            <p className="text-sm text-muted-foreground">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent blogs */}
            <motion.div {...fadeUp(5)}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Recent Blogs
                    </h2>
                    <Link
                        href="/dashboard/blogs"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        View all <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <BlogRowSkeleton key={i} />)
                    ) : recent.length === 0 ? (
                        <EmptyDashboard />
                    ) : (
                        recent.map((blog, i) => <BlogRow key={blog.id} blog={blog} index={i} />)
                    )}
                </div>
            </motion.div>

            {/* Quick write CTA */}
            {!isLoading && blogs && blogs.length === 0 && (
                <motion.div {...fadeUp(6)}>
                    <Link
                        href="/dashboard/new"
                        className="flex items-center justify-between p-6 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <PenSquare className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Write your first blog</p>
                                <p className="text-sm text-muted-foreground">Share your thoughts with the world</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            )}
        </div>
    );
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

function EmptyDashboard() {
    return (
        <div className="py-16 text-center">
            <TrendingUp className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-medium text-muted-foreground">No blogs yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Start writing to see your stats here</p>
            <Link
                href="/dashboard/new"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
            >
                <PenSquare className="w-4 h-4" /> Write Now
            </Link>
        </div>
    );
}

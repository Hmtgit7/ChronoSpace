'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PenSquare, Filter, FileText } from 'lucide-react';
import { useState } from 'react';
import { useMyBlogs } from '@/lib/hooks/useBlogs';
import { BlogRowSkeleton } from '@/components/blog/BlogSkeleton';
import { BlogRow } from '@/components/blog/BlogRow';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'published' | 'drafts';

export default function MyBlogsPage() {
    const { data: blogs, isLoading } = useMyBlogs();
    const [filter, setFilter] = useState<Filter>('all');

    const filtered = blogs?.filter((b) => {
        if (filter === 'published') return b.isPublished;
        if (filter === 'drafts') return !b.isPublished;
        return true;
    }) ?? [];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        My Blogs
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {isLoading ? '...' : `${blogs?.length ?? 0} total blogs`}
                    </p>
                </div>
                <Link
                    href="/dashboard/new"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                    <PenSquare className="w-4 h-4" /> Write New
                </Link>
            </motion.div>

            {/* Filter tabs */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex gap-1 p-1 bg-secondary rounded-xl w-fit"
            >
                {(['all', 'published', 'drafts'] as Filter[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all',
                            filter === f
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {f}
                        {!isLoading && (
                            <span className={cn(
                                'ml-2 text-xs px-1.5 py-0.5 rounded-full',
                                filter === f ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            )}>
                                {f === 'all' ? blogs?.length ?? 0
                                    : f === 'published' ? blogs?.filter((b) => b.isPublished).length ?? 0
                                        : blogs?.filter((b) => !b.isPublished).length ?? 0}
                            </span>
                        )}
                    </button>
                ))}
            </motion.div>

            {/* List */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-border bg-card overflow-hidden"
            >
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <BlogRowSkeleton key={i} />)
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center">
                        <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground font-medium">
                            {filter === 'all' ? 'No blogs yet' : `No ${filter} blogs`}
                        </p>
                        <Link
                            href="/dashboard/new"
                            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                        >
                            <PenSquare className="w-4 h-4" /> Write one now
                        </Link>
                    </div>
                ) : (
                    filtered.map((blog, i) => <BlogRow key={blog.id} blog={blog} index={i} />)
                )}
            </motion.div>
        </div>
    );
}

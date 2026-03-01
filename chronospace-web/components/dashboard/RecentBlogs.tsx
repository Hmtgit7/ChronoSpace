'use client';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BlogRow } from '@/components/blog/BlogRow';
import { BlogRowSkeleton } from '@/components/blog/BlogSkeleton';
import type { Blog } from '@/types';

interface RecentBlogsProps {
    blogs?: Blog[];
    isLoading?: boolean;
}

export function RecentBlogs({ blogs, isLoading }: RecentBlogsProps) {
    const recent = blogs?.slice(0, 5) ?? [];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Recent Blogs
                </h2>
                <Link
                    href="/dashboard/blogs"
                    className="text-xs font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1"
                >
                    View all
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <BlogRowSkeleton key={i} />)
                ) : recent.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                            <BookOpen className="w-5 h-5 text-muted-foreground/40" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">No blogs yet</p>
                        <p className="text-xs text-muted-foreground">
                            Write your first blog to see it here.
                        </p>
                    </div>
                ) : (
                    recent.map((blog, i) => <BlogRow key={blog.id} blog={blog} index={i} />)
                )}
            </div>
        </div>
    );
}

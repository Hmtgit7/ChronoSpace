'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Clock } from 'lucide-react';
import { timeAgo, readingTime, getInitials } from '@/lib/utils';
import type { FeedBlog } from '@/types';

interface BlogCardListProps {
    blog: FeedBlog;
    index?: number;
}

export function BlogCardList({ blog, index = 0 }: BlogCardListProps) {
    const authorName = blog.author?.username ?? 'Unknown';

    return (
        <motion.article
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="group flex items-start gap-5 p-5 border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
        >
            {/* Author avatar */}
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary text-xs font-bold mt-0.5">
                {getInitials(authorName)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Author + date */}
                <div className="flex items-center gap-1.5 mb-1.5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">@{authorName}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span>{timeAgo(blog.publishedAt)}</span>
                </div>

                {/* Title */}
                <Link href={`/blog/${blog.slug}`} className="block mb-1">
                    <h2 className="font-semibold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {blog.title}
                    </h2>
                </Link>

                {/* Summary */}
                {blog.summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                        {blog.summary}
                    </p>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {blog.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {blog.commentCount}
                    </span>
                    {blog.summary && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {readingTime(blog.summary)}
                        </span>
                    )}
                </div>
            </div>

            {/* Read link */}
            <Link
                href={`/blog/${blog.slug}`}
                className="flex-shrink-0 text-xs font-medium text-primary hover:underline underline-offset-4 mt-1"
            >
                Read →
            </Link>
        </motion.article>
    );
}

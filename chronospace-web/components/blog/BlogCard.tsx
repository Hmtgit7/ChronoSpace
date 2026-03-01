'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { timeAgo, readingTime, getInitials } from '@/lib/utils';
import type { FeedBlog } from '@/types';

interface BlogCardProps {
    blog: FeedBlog;
    index: number;
    currentPage: number;
}

export function BlogCard({ blog, index }: BlogCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 hover:border-primary/25 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
        >
            {/* Author row */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
                    {getInitials(blog.author?.username)}
                </div>
                <span className="text-xs font-medium text-foreground/70">
                    @{blog.author?.username}
                </span>
                <span className="text-muted-foreground/30 text-xs">·</span>
                <span className="text-xs text-muted-foreground">{timeAgo(blog.publishedAt)}</span>
            </div>

            {/* Title */}
            <Link href={`/blog/${blog.slug}`} className="flex-1 mb-3 block">
                <h2 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                </h2>
            </Link>

            {/* Summary */}
            {blog.summary && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {blog.summary}
                </p>
            )}

            {/* Footer */}
            <div className="mt-auto pt-3.5 border-t border-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {blog.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {blog.commentCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {readingTime(blog.summary)}
                    </span>
                </div>

                <Link
                    href={`/blog/${blog.slug}`}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-4 group-hover:gap-1.5 transition-all"
                >
                    Read
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </motion.article>
    );
}

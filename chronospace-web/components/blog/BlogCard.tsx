'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Clock, User } from 'lucide-react';
import { timeAgo, readingTime } from '@/lib/utils';
import type { FeedBlog } from '@/types';

interface Props {
    blog: FeedBlog;
    index: number;
    currentPage: number;
}

export function BlogCard({ blog, index }: Props) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative flex flex-col p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
        >
            {/* Category accent line */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-violet-500 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Author + date */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground/80">@{blog.author.username}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground">{timeAgo(blog.publishedAt)}</span>
            </div>

            {/* Title */}
            <Link href={`/blog/${blog.slug}`} className="flex-1">
                <h2 className="font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                </h2>
            </Link>

            {/* Summary */}
            {blog.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {blog.summary}
                </p>
            )}

            <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between">
                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" />
                        {blog.likeCount}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {blog.commentCount}
                    </span>
                    {blog.summary && (
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {readingTime(blog.summary)}
                        </span>
                    )}
                </div>

                {/* Read more */}
                <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xs font-medium text-primary hover:underline underline-offset-4"
                >
                    Read →
                </Link>
            </div>
        </motion.article>
    );
}

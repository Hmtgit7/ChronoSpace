"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Clock, User } from "lucide-react";
import { timeAgo, readingTime } from "@/lib/utils";
import type { FeedBlog } from "@/types";

interface Props {
    blog: FeedBlog;
    index: number;
}

export function BlogCard({ blog, index }: Props) {
    // ✅ Fix: Safely resolve username from both API shapes
    const authorName = blog.author?.username ?? "Unknown";

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
            className="group relative flex flex-col h-full p-5 rounded-2xl border border-border bg-card hover:border-primary/25 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
        >
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Author row */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary text-xs font-bold uppercase">
                    {authorName[0]}
                </div>
                <span className="text-sm font-medium text-foreground/80 leading-none">
                    {authorName}
                </span>
                <span className="text-muted-foreground/30">·</span>
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

            {/* Footer */}
            <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
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

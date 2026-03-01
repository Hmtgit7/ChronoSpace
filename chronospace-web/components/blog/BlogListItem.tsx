"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Clock } from "lucide-react";
import { timeAgo, readingTime } from "@/lib/utils";
import type { FeedBlog } from "@/types";

interface Props {
    blog: FeedBlog;
    index: number;
}

export function BlogListItem({ blog, index }: Props) {
    const authorName = blog.author?.username ?? "Unknown";

    return (
        <motion.article
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className="group flex items-start gap-4 p-4 sm:p-5 border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
        >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold uppercase flex-shrink-0 mt-0.5">
                {authorName[0]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                    {/* <span className="font-medium text-foreground/70">{authorName}</span> */}
                    <Link
                        href={`/u/${blog.author?.username}`}
                        onClick={(e) => e.stopPropagation()} // prevent card click
                        className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                        {/* {blog.author?.username} */}
                        {authorName}
                    </Link>
                    <span>·</span>
                    <span>{timeAgo(blog.publishedAt)}</span>
                </div>
                <Link href={`/blog/${blog.slug}`}>
                    <h2 className="font-bold text-sm sm:text-base leading-snug mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {blog.title}
                    </h2>
                </Link>
                {blog.summary && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 leading-relaxed">
                        {blog.summary}
                    </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {blog.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {blog.commentCount}
                    </span>
                    {blog.summary && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {readingTime(blog.summary)}
                        </span>
                    )}
                </div>
            </div>

            {/* Read link */}
            <Link
                href={`/blog/${blog.slug}`}
                className="text-xs font-medium text-primary hover:underline underline-offset-4 flex-shrink-0 mt-1 hidden sm:block"
            >
                Read →
            </Link>
        </motion.article>
    );
}

import { Calendar, Clock, MessageSquare } from "lucide-react";
import { formatDate, readingTime, getInitials } from "@/lib/utils";
import type { Blog } from "@/types";
import Link from "next/link";

interface Props {
    blog: Blog;
    commentCount: number;
}

export function BlogPageMeta({ blog, commentCount }: Props) {
    const authorName = blog.user?.username ?? "Unknown";
    const publishDate = blog.publishedAt ?? blog.createdAt;

    return (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {/* Author */}
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase">
                    {getInitials(authorName)}
                </div>
                {/* <span className="font-medium text-foreground/80">{authorName}</span> */}
                <Link
                    href={`/u/${blog.user?.username}`}
                    onClick={(e) => e.stopPropagation()} // prevent card click
                    className="font-medium text-foreground hover:text-primary transition-colors"
                >
                    {/* {blog.author?.username} */}
                    {authorName}
                </Link>
            </div>

            <span className="text-border">·</span>

            {/* Date */}
            <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(new Date(publishDate))}
            </span>

            <span className="text-border">·</span>

            {/* Reading time */}
            <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {blog.content ? readingTime(blog.content) : "1 min read"}
            </span>

            <span className="text-border">·</span>

            {/* Comment count */}
            <a
                href="#comments"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
                <MessageSquare className="w-3.5 h-3.5" />
                {commentCount} {commentCount === 1 ? "comment" : "comments"}
            </a>
        </div>
    );
}

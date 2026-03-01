'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Heart, MessageSquare, Pencil } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Blog } from '@/types';

interface BlogRowProps {
    blog: Blog;
    index?: number;
}

export function BlogRow({ blog, index = 0 }: BlogRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors group"
        >
            {/* Status dot */}
            <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${blog.isPublished ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
            />

            {/* Main content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{blog.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {timeAgo(blog.updatedAt)}
                </p>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {blog._count?.likes ?? 0}
                </span>
                <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {blog._count?.comments ?? 0}
                </span>
            </div>

            {/* Status badge */}
            <Badge
                variant={blog.isPublished ? 'default' : 'secondary'}
                className="text-xs hidden sm:flex flex-shrink-0"
            >
                {blog.isPublished ? (
                    <>
                        <Eye className="w-3 h-3 mr-1" />
                        Published
                    </>
                ) : (
                    <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Draft
                    </>
                )}
            </Badge>

            {/* Edit link */}
            <Link
                href={`/dashboard/edit/${blog.id}`}
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs font-medium text-primary hover:underline underline-offset-4 transition-opacity flex-shrink-0"
            >
                <Pencil className="w-3 h-3" />
                Edit
            </Link>
        </motion.div>
    );
}

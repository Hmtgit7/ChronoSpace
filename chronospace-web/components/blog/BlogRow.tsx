'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Eye, EyeOff, Heart, MessageSquare, ExternalLink } from 'lucide-react';
import { useDeleteBlog } from '@/lib/hooks/useBlogs';
import { timeAgo, cn } from '@/lib/utils';
import type { Blog } from '@/types';

interface Props { blog: Blog; index: number; }

export function BlogRow({ blog, index }: Props) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const deleteBlog = useDeleteBlog();

    const handleDelete = () => {
        if (!confirmDelete) { setConfirmDelete(true); return; }
        deleteBlog.mutate(blog.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
        >
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate pr-2">{blog.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                    <span>{timeAgo(blog.createdAt)}</span>
                    {(blog._count?.likes ?? 0) > 0 && (
                        <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />{blog._count?.likes}
                        </span>
                    )}
                    {(blog._count?.comments ?? 0) > 0 && (
                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />{blog._count?.comments}
                        </span>
                    )}
                </p>
            </div>

            {/* Status badge */}
            <span className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0',
                blog.isPublished
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            )}>
                {blog.isPublished ? (
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />Published</span>
                ) : (
                    <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" />Draft</span>
                )}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {blog.isPublished && (
                    <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        title="View public page"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                )}
                <Link
                    href={`/dashboard/edit/${blog.id}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Edit"
                >
                    <Edit2 className="w-3.5 h-3.5" />
                </Link>
                <AnimatePresence mode="wait">
                    {confirmDelete ? (
                        <motion.button
                            key="confirm"
                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                            onClick={handleDelete}
                            disabled={deleteBlog.isPending}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                            onBlur={() => setConfirmDelete(false)}
                        >
                            Confirm
                        </motion.button>
                    ) : (
                        <motion.button
                            key="delete"
                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                            onClick={handleDelete}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

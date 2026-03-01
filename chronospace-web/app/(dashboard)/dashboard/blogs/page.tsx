'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PenSquare, Pencil, Trash2, Eye, EyeOff, ExternalLink, Heart, MessageSquare } from 'lucide-react';
import { useMyBlogs, useDeleteBlog } from '@/lib/hooks/useBlogs';
import { BlogRowSkeleton } from '@/components/blog/BlogSkeleton';
import { BlogFilters } from '@/components/dashboard/BlogFilters';
import { DeleteConfirmDialog } from '@/components/dashboard/DeleteConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { timeAgo } from '@/lib/utils';
import type { Blog } from '@/types';

type FilterStatus = 'all' | 'published' | 'draft';

export default function BlogsPage() {
    const { data: blogs, isLoading } = useMyBlogs();
    const deleteBlog = useDeleteBlog();

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<FilterStatus>('all');
    const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);

    const filtered = useMemo(() => {
        if (!blogs) return [];
        return blogs.filter((b) => {
            const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
            const matchStatus =
                status === 'all' ||
                (status === 'published' && b.isPublished) ||
                (status === 'draft' && !b.isPublished);
            return matchSearch && matchStatus;
        });
    }, [blogs, search, status]);

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteBlog.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-5xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Blogs</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {blogs?.length ?? 0} total · {blogs?.filter((b) => b.isPublished).length ?? 0} published
                    </p>
                </div>
                <Button asChild size="sm">
                    <Link href="/dashboard/new">
                        <PenSquare className="w-4 h-4 mr-2" />
                        New Blog
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            {!isLoading && !!blogs?.length && (
                <BlogFilters
                    search={search}
                    status={status}
                    onSearch={setSearch}
                    onStatus={setStatus}
                    total={filtered.length}
                />
            )}

            {/* Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <span>Title</span>
                    <span className="w-20 text-center">Status</span>
                    <span className="w-20 text-center">Engagement</span>
                    <span className="w-24">Updated</span>
                    <span className="w-20 text-right">Actions</span>
                </div>

                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <BlogRowSkeleton key={i} />)
                ) : filtered.length === 0 ? (
                    <EmptyBlogs hasBlogs={!!blogs?.length} onClear={() => { setSearch(''); setStatus('all'); }} />
                ) : (
                    filtered.map((blog, i) => (
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.04 }}
                            className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors group"
                        >
                            {/* Title + slug */}
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{blog.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">/{blog.slug}</p>
                            </div>

                            {/* Status */}
                            <div className="w-20 flex justify-start sm:justify-center">
                                <Badge variant={blog.isPublished ? 'default' : 'secondary'} className="text-xs gap-1">
                                    {blog.isPublished
                                        ? <><Eye className="w-3 h-3" /> Live</>
                                        : <><EyeOff className="w-3 h-3" /> Draft</>}
                                </Badge>
                            </div>

                            {/* Engagement */}
                            <div className="w-20 flex items-center gap-2.5 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {blog._count?.likes ?? 0}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {blog._count?.comments ?? 0}
                                </span>
                            </div>

                            {/* Updated */}
                            <span className="w-24 text-xs text-muted-foreground hidden sm:block">
                                {timeAgo(blog.updatedAt)}
                            </span>

                            {/* Actions */}
                            <div className="w-20 flex items-center justify-start sm:justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                {blog.isPublished && (
                                    <Link
                                        href={`/blog/${blog.slug}`}
                                        target="_blank"
                                        className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                                        title="View live"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                                <Link
                                    href={`/dashboard/edit/${blog.id}`}
                                    className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                                    title="Edit"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                    onClick={() => setDeleteTarget(blog)}
                                    className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Delete dialog */}
            <DeleteConfirmDialog
                open={!!deleteTarget}
                title={deleteTarget?.title ?? ''}
                isPending={deleteBlog.isPending}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </motion.div>
    );
}

function EmptyBlogs({ hasBlogs, onClear }: { hasBlogs: boolean; onClear: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <p className="text-sm font-medium text-foreground mb-1">
                {hasBlogs ? 'No blogs match your filters' : 'No blogs yet'}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
                {hasBlogs ? 'Try adjusting your search or filter.' : 'Write your first blog to see it here.'}
            </p>
            {hasBlogs ? (
                <button onClick={onClear} className="text-xs text-primary hover:underline underline-offset-4">
                    Clear filters
                </button>
            ) : (
                <Button asChild size="sm">
                    <Link href="/dashboard/new">
                        <PenSquare className="w-3.5 h-3.5 mr-1.5" />
                        Write your first blog
                    </Link>
                </Button>
            )}
        </div>
    );
}

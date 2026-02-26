'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User } from 'lucide-react';
import { useComments } from '@/lib/hooks/useComments';
import { timeAgo } from '@/lib/utils';
import { CommentForm } from './CommentForm';

interface Props { blogId: string; }

export function CommentList({ blogId }: Props) {
    const { data: comments, isLoading } = useComments(blogId);

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">
                    Comments
                    {!isLoading && comments && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({comments.length})
                        </span>
                    )}
                </h2>
            </div>

            {/* Comment form */}
            <CommentForm blogId={blogId} />

            {/* Comment list */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex gap-3">
                            <div className="w-8 h-8 rounded-xl bg-muted flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-muted rounded w-24" />
                                <div className="h-3 bg-muted rounded w-full" />
                                <div className="h-3 bg-muted rounded w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments?.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-border">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
                </div>
            ) : (
                <AnimatePresence initial={false}>
                    <div className="space-y-4">
                        {comments?.map((comment, i) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="flex gap-3 group"
                            >
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary text-xs font-bold">
                                    {comment.user.username[0].toUpperCase()}
                                </div>

                                {/* Content bubble */}
                                <div className="flex-1 min-w-0">
                                    <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-sm font-semibold">@{comment.user.username}</span>
                                            <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap break-words">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            )}
        </section>
    );
}

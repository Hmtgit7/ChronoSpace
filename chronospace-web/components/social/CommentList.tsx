'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useComments } from '@/lib/hooks/useComments';
import { CommentItem } from '@/components/social/CommentItem';
import { CommentForm } from '@/components/social/CommentForm';

interface CommentListProps {
    blogId: string;
}

export function CommentList({ blogId }: CommentListProps) {
    const { data: comments, isLoading } = useComments(blogId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h2 className="text-base font-semibold text-foreground">
                    Comments
                    {comments?.length ? (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                            ({comments.length})
                        </span>
                    ) : null}
                </h2>
            </div>

            {/* Comment form */}
            <CommentForm blogId={blogId} />

            {/* Comment list */}
            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-28 bg-muted rounded" />
                                <div className="h-3 w-full bg-muted rounded" />
                                <div className="h-3 w-3/4 bg-muted rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments?.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                    No comments yet. Be the first to start the conversation.
                </div>
            ) : (
                <AnimatePresence initial={false}>
                    <div className="space-y-5">
                        {comments?.map((comment, i) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <CommentItem comment={comment} />
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
}

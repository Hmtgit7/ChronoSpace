"use client";
import { AnimatePresence } from "framer-motion";
import { MessageSquare, Loader2 } from "lucide-react";
import { useComments } from "@/lib/hooks/useComments";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";

interface Props {
    blogId: string;
}

export function CommentList({ blogId }: Props) {
    const { data: comments, isLoading } = useComments(blogId);

    return (
        <section id="comments" className="space-y-8 pt-4">
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

            {/* Form */}
            <CommentForm blogId={blogId} />

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading comments…
                </div>
            )}

            {/* Empty */}
            {!isLoading && comments?.length === 0 && (
                <div className="text-center py-10">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                        No comments yet. Be the first to comment.
                    </p>
                </div>
            )}

            {/* Comments list */}
            {!isLoading && comments && comments.length > 0 && (
                <div className="space-y-6">
                    <AnimatePresence initial={false}>
                        {comments.map((comment, i) => (
                            <CommentItem key={comment.id} comment={comment} index={i} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </section>
    );
}

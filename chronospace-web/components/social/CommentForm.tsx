"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, LogIn } from "lucide-react";
import { useAddComment } from "@/lib/hooks/useComments";
import { useAuthStore } from "@/lib/store/auth.store";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface Props {
    blogId: string;
}

export function CommentForm({ blogId }: Props) {
    const { isAuthenticated, user } = useAuthStore();
    const [content, setContent] = useState("");
    const [focused, setFocused] = useState(false);
    const addComment = useAddComment(blogId);

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-border bg-secondary/30">
                <p className="text-sm text-muted-foreground">
                    Sign in to join the conversation
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = content.trim();
        if (!trimmed || trimmed.length < 1) return;
        await addComment.mutateAsync(trimmed);
        setContent("");
        setFocused(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div
                className={cn(
                    "rounded-2xl border bg-card transition-all duration-200 overflow-hidden",
                    focused ? "border-primary/40 ring-2 ring-primary/10" : "border-border"
                )}
            >
                {/* Author indicator */}
                <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                    <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase">
                        {getInitials(user?.username ?? "")}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                        {user?.username}
                    </span>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full px-4 py-2 bg-transparent resize-none text-sm focus:outline-none placeholder:text-muted-foreground/50 leading-relaxed"
                />

                {/* Action bar */}
                <AnimatePresence>
                    {(focused || content.trim()) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center justify-between px-4 pb-3"
                        >
                            <span className="text-xs text-muted-foreground">
                                {content.length} / 500
                            </span>
                            <button
                                type="submit"
                                disabled={addComment.isPending || !content.trim()}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {addComment.isPending ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Send className="w-3.5 h-3.5" />
                                )}
                                Post
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
}

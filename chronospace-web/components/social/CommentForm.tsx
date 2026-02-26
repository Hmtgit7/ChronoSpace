'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, LogIn } from 'lucide-react';
import { useAddComment } from '@/lib/hooks/useComments';
import { useAuthStore } from '@/lib/store/auth.store';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props { blogId: string; }

export function CommentForm({ blogId }: Props) {
    const { isAuthenticated, user } = useAuthStore();
    const [content, setContent] = useState('');
    const [focused, setFocused] = useState(false);
    const addComment = useAddComment(blogId);

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-border bg-secondary/50">
                <p className="text-sm text-muted-foreground">Sign in to leave a comment</p>
                <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                >
                    <LogIn className="w-3.5 h-3.5" /> Sign In
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = content.trim();
        if (!trimmed || trimmed.length < 1) return;
        await addComment.mutateAsync(trimmed);
        setContent('');
        setFocused(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div
                className={cn(
                    'rounded-2xl border transition-all duration-200 overflow-hidden',
                    focused ? 'border-primary ring-2 ring-primary/10 bg-card' : 'border-border bg-card'
                )}
            >
                {/* Author label */}
                {focused && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="px-4 pt-3 pb-1 flex items-center gap-2"
                    >
                        <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                            {user?.username[0].toUpperCase()}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">@{user?.username}</span>
                    </motion.div>
                )}

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => !content && setFocused(false)}
                    placeholder="Write a thoughtful comment..."
                    rows={focused ? 3 : 1}
                    maxLength={1000}
                    className="w-full px-4 py-3 bg-transparent resize-none text-sm focus:outline-none placeholder:text-muted-foreground/50 transition-all"
                />

                {focused && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between px-4 pb-3"
                    >
                        <span className={cn(
                            'text-xs',
                            content.length > 900 ? 'text-destructive' : 'text-muted-foreground'
                        )}>
                            {content.length}/1000
                        </span>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => { setContent(''); setFocused(false); }}
                                className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-secondary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!content.trim() || addComment.isPending}
                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                            >
                                {addComment.isPending ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Send className="w-3 h-3" />
                                )}
                                Post
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </form>
    );
}

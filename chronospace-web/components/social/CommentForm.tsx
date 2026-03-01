'use client';
import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { useAddComment } from '@/lib/hooks/useComments';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CommentFormProps {
    blogId: string;
}

export function CommentForm({ blogId }: CommentFormProps) {
    const { isAuthenticated } = useAuthStore();
    const addComment = useAddComment(blogId);
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;
        addComment.mutate(value.trim(), {
            onSuccess: () => setValue(''),
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="px-4 py-3.5 rounded-xl border border-dashed border-border bg-muted/40 text-center">
                <p className="text-sm text-muted-foreground">
                    <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">
                        Sign in
                    </Link>{' '}
                    to leave a comment.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Share your thoughts…"
                rows={2}
                className={cn(
                    'flex-1 px-4 py-3 rounded-xl bg-card border border-border text-sm',
                    'placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2',
                    'focus:ring-primary/15 outline-none resize-none transition-all leading-relaxed'
                )}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as unknown as React.FormEvent);
                }}
            />
            <button
                type="submit"
                disabled={addComment.isPending || !value.trim()}
                className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
                    'bg-primary text-primary-foreground transition-all',
                    'hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                title="Post comment (Ctrl+Enter)"
            >
                {addComment.isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />}
            </button>
        </form>
    );
}

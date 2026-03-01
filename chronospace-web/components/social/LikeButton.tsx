'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useLike } from '@/lib/hooks/useLike';
import { useAuthStore } from '@/lib/store/auth.store';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
    blogId: string;
    initialLikeCount: number;
    size?: 'sm' | 'md';
}

export function LikeButton({ blogId, initialLikeCount, size = 'md' }: LikeButtonProps) {
    const { isAuthenticated } = useAuthStore();
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialLikeCount);
    const { like, unlike } = useLike(blogId, 1);

    const handleToggle = () => {
        if (!isAuthenticated) return;
        if (liked) {
            setLiked(false);
            setCount((c) => c - 1);
            unlike.mutate(undefined, {
                onError: () => { setLiked(true); setCount((c) => c + 1); },
            });
        } else {
            setLiked(true);
            setCount((c) => c + 1);
            like.mutate(undefined, {
                onError: () => { setLiked(false); setCount((c) => c - 1); },
            });
        }
    };

    const isSmall = size === 'sm';

    return (
        <button
            onClick={handleToggle}
            disabled={!isAuthenticated}
            title={isAuthenticated ? (liked ? 'Unlike' : 'Like') : 'Sign in to like'}
            className={cn(
                'flex flex-col items-center gap-1 rounded-xl border transition-all group',
                isSmall ? 'w-10 h-auto py-2.5 px-2' : 'flex-row px-4 py-2.5 gap-2',
                liked
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                    : 'bg-secondary border-border text-muted-foreground hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/5',
                !isAuthenticated && 'cursor-not-allowed opacity-50'
            )}
        >
            <motion.div
                animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
            >
                <Heart
                    className={cn(
                        'flex-shrink-0 transition-all',
                        isSmall ? 'w-4 h-4' : 'w-4 h-4',
                        liked && 'fill-rose-500'
                    )}
                />
            </motion.div>
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={count}
                    initial={{ opacity: 0, y: liked ? -6 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: liked ? 6 : -6 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-medium tabular-nums leading-none"
                >
                    {count}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}

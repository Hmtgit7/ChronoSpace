'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useLike } from '@/lib/hooks/useLike';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Props {
    blogId: string;
    initialLikeCount: number;
    currentPage?: number;
    size?: 'sm' | 'md';
}

export function LikeButton({ blogId, initialLikeCount, currentPage = 1, size = 'md' }: Props) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const { like, unlike } = useLike(blogId, currentPage);
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialLikeCount);
    const [burst, setBurst] = useState(false);

    useEffect(() => {
        setCount(initialLikeCount);
    }, [initialLikeCount]);

    const handleToggle = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (liked) {
            setLiked(false);
            setCount((c) => c - 1);
            await unlike.mutateAsync().catch(() => {
                setLiked(true);
                setCount((c) => c + 1);
            });
        } else {
            setLiked(true);
            setCount((c) => c + 1);
            setBurst(true);
            setTimeout(() => setBurst(false), 600);
            await like.mutateAsync().catch(() => {
                setLiked(false);
                setCount((c) => c - 1);
            });
        }
    };

    const isSm = size === 'sm';

    return (
        <button
            onClick={handleToggle}
            disabled={like.isPending || unlike.isPending}
            className={cn(
                'relative flex items-center gap-2 rounded-xl font-medium transition-all duration-200 select-none',
                isSm ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm',
                liked
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/15'
                    : 'bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-primary/20'
            )}
            aria-label={liked ? 'Unlike' : 'Like'}
        >
            <AnimatePresence>
                {burst && (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                animate={{
                                    opacity: 0,
                                    scale: 1,
                                    x: Math.cos((i / 6) * 2 * Math.PI) * 20,
                                    y: Math.sin((i / 6) * 2 * Math.PI) * 20,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="absolute w-1.5 h-1.5 bg-rose-400 rounded-full pointer-events-none"
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>

            <motion.div
                animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Heart
                    className={cn(
                        isSm ? 'w-3.5 h-3.5' : 'w-4 h-4',
                        liked ? 'fill-rose-500 text-rose-500' : ''
                    )}
                />
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.span
                    key={count}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                >
                    {count}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}

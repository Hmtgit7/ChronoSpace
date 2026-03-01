"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { blogsApi } from "@/lib/api/blogs";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";

interface Props {
    blogId: string;
    initialLikeCount: number;
    size?: "sm" | "md";
}

export function LikeButton({ blogId, initialLikeCount, size = "md" }: Props) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialLikeCount);
    const [pending, setPending] = useState(false);
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    const handleLike = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (pending) return;

        // Optimistic update
        const wasLiked = liked;
        setLiked(!wasLiked);
        setCount((c) => (wasLiked ? c - 1 : c + 1));
        setPending(true);

        try {
            if (wasLiked) {
                await blogsApi.unlike(blogId);
            } else {
                await blogsApi.like(blogId);
            }
        } catch {
            // Revert on error
            setLiked(wasLiked);
            setCount((c) => (wasLiked ? c + 1 : c - 1));
        } finally {
            setPending(false);
        }
    };

    const isSmall = size === "sm";

    return (
        <button
            onClick={handleLike}
            disabled={pending}
            className={cn(
                "group inline-flex items-center gap-2 rounded-xl border font-medium transition-all duration-200",
                isSmall ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
                liked
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/15"
                    : "border-border bg-card text-muted-foreground hover:border-rose-500/30 hover:text-rose-500 hover:bg-rose-500/8"
            )}
            aria-label={liked ? "Unlike" : "Like"}
        >
            <motion.span
                animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
            >
                <Heart
                    className={cn(
                        "transition-colors",
                        isSmall ? "w-3.5 h-3.5" : "w-4 h-4",
                        liked ? "fill-rose-500 text-rose-500" : "fill-none"
                    )}
                />
            </motion.span>

            <AnimatePresence mode="wait">
                <motion.span
                    key={count}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                >
                    {count}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}

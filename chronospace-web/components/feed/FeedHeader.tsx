'use client';
import { motion } from 'framer-motion';
import { Rss } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FeedHeaderProps {
    totalCount?: number;
}

export function FeedHeader({ totalCount }: FeedHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Rss className="w-4 h-4 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                    Public Feed
                </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
                Discover Stories
            </h1>

            <p className="text-muted-foreground text-base">
                Read the latest from writers on ChronoSpace.
                {totalCount !== undefined && totalCount > 0 && (
                    <span className="text-foreground font-medium ml-1">
                        {totalCount.toLocaleString()} {totalCount === 1 ? 'story' : 'stories'} published.
                    </span>
                )}
            </p>
        </motion.div>
    );
}

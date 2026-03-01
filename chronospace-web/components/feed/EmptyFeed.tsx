'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileSearch, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyFeedProps {
    isSearch?: boolean;
    searchQuery?: string;
}

export function EmptyFeed({ isSearch, searchQuery }: EmptyFeedProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-24 text-center"
        >
            <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-5">
                <FileSearch className="w-7 h-7 text-muted-foreground/50" />
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-2">
                {isSearch ? 'No results found' : 'No stories yet'}
            </h2>

            <p className="text-muted-foreground max-w-sm text-sm mb-6">
                {isSearch
                    ? `No stories matched "${searchQuery}". Try different keywords.`
                    : 'Be the first to publish. Create an account and share your story.'}
            </p>

            {!isSearch && (
                <Button asChild>
                    <Link href="/register">
                        <PenSquare className="w-4 h-4 mr-2" />
                        Start Writing
                    </Link>
                </Button>
            )}
        </motion.div>
    );
}

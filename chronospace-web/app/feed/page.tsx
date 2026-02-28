'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rss, TrendingUp } from 'lucide-react';
import { useFeed } from '@/lib/hooks/useFeed';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogCardSkeleton } from '@/components/blog/BlogSkeleton';
import { Pagination } from '@/components/feed/Pagination';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function FeedPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching } = useFeed(page);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Rss className="w-3.5 h-3.5" />
                            Public Feed
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                            Discover great{' '}
                            <span className="gradient-text">stories</span>
                        </h1>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            Read the latest published blogs from writers on ChronoSpace.
                            {data && (
                                <span className="text-primary font-medium"> {data.meta.total} stories</span>
                            )}{' '}
                            and counting.
                        </p>
                    </motion.div>

                    {/* Loading skeleton */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <BlogCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : data?.data.length === 0 ? (
                        /* Empty state */
                        <EmptyFeed />
                    ) : (
                        <>
                            {/* Fetching overlay on page change */}
                            <div className={cn('transition-opacity duration-200', isFetching && !isLoading ? 'opacity-60' : 'opacity-100')}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={page}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        {data?.data.map((blog, i) => (
                                            <BlogCard
                                                key={blog.id}
                                                blog={blog}
                                                index={i}
                                                currentPage={page}
                                            />
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Pagination */}
                            {data?.meta && (
                                <Pagination
                                    meta={data.meta}
                                    page={page}
                                    onPageChange={handlePageChange}
                                    isLoading={isFetching}
                                />
                            )}

                            {/* Page info */}
                            {data?.meta && (
                                <p className="text-center text-xs text-muted-foreground mt-4">
                                    Showing {(page - 1) * 9 + 1}–{Math.min(page * 9, data.meta.total)} of {data.meta.total} stories
                                </p>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

function EmptyFeed() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
        >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-primary/50" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No stories yet</h2>
            <p className="text-muted-foreground max-w-sm">
                Be the first to publish a blog. Create your account and share your thoughts with the world.
            </p>
        </motion.div>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

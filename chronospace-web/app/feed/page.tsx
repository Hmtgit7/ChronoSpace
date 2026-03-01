'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rss, Feather } from 'lucide-react';
import { useFeed } from '@/lib/hooks/useFeed';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogCardSkeleton } from '@/components/blog/BlogSkeleton';
import { Pagination } from '@/components/feed/Pagination';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
                    {/* Page header */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary text-xs font-medium mb-5">
                            <Rss className="w-3 h-3" />
                            Public Feed
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                            Discover great stories
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            The latest published blogs from writers on ChronoSpace
                            {data && (
                                <> — <span className="text-primary font-medium">{data.meta.total} stories</span> and counting</>
                            )}.
                        </p>
                    </motion.div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 9 }).map((_, i) => <BlogCardSkeleton key={i} />)}
                        </div>
                    ) : data?.data.length === 0 ? (
                        <EmptyFeed />
                    ) : (
                        <>
                            <div className={cn('transition-opacity duration-200', isFetching && !isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100')}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={page}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.18 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                                    >
                                        {data?.data.map((blog, i) => (
                                            <BlogCard key={blog.id} blog={blog} index={i} currentPage={page} />
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {data?.meta && (
                                <>
                                    <Pagination meta={data.meta} page={page} onPageChange={handlePageChange} isLoading={isFetching} />
                                    <p className="text-center text-xs text-muted-foreground mt-3">
                                        Showing {(page - 1) * 9 + 1}–{Math.min(page * 9, data.meta.total)} of {data.meta.total} stories
                                    </p>
                                </>
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
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center"
        >
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Feather className="w-7 h-7 text-primary/60" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No stories yet</h2>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
                Be the first to publish a blog. Create your account and share your thoughts.
            </p>
            <Button asChild size="sm">
                <Link href="/register">Start writing free</Link>
            </Button>
        </motion.div>
    );
}

'use client';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    ArrowLeft, Calendar, User, Clock, MessageSquare, Share2, BookOpen,
} from 'lucide-react';
import { usePublicBlog } from '@/lib/hooks/useFeed';
import { useComments } from '@/lib/hooks/useComments';
import { LikeButton } from '@/components/social/LikeButton';
import { CommentList } from '@/components/social/CommentList';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatDate, readingTime } from '@/lib/utils';

export default function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { data: blog, isLoading, isError } = usePublicBlog(slug);
    const { data: comments } = useComments(blog?.id ?? '');

    const handleShare = async () => {
        if (navigator.share && blog) {
            await navigator.share({ title: blog.title, url: window.location.href });
        } else {
            await navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-24 pb-16">
                {isLoading ? (
                    <BlogPageSkeleton />
                ) : isError || !blog ? (
                    <BlogNotFound />
                ) : (
                    <>
                        {/* ── Hero ───────────────────────────────────────── */}
                        <header className="relative border-b border-border mb-12 overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-primary/6 rounded-full blur-3xl -z-10" />
                            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-12">
                                {/* Back */}
                                <Link
                                    href="/feed"
                                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back to Feed
                                </Link>

                                {/* Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45 }}
                                    className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] mb-5 text-foreground"
                                >
                                    {blog.title}
                                </motion.h1>

                                {/* Summary */}
                                {blog.summary && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.08 }}
                                        className="text-lg text-muted-foreground leading-relaxed mb-6"
                                    >
                                        {blog.summary}
                                    </motion.p>
                                )}

                                {/* Meta */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.14 }}
                                    className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
                                            <User className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="font-medium text-foreground">
                                            @{blog.user?.username}
                                        </span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {formatDate(blog.publishedAt ?? blog.createdAt)}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {readingTime(blog.content)}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        {comments?.length ?? 0} comments
                                    </span>
                                </motion.div>
                            </div>
                        </header>

                        {/* ── Body ───────────────────────────────────────── */}
                        <div className="max-w-6xl mx-auto px-4 sm:px-6">
                            <div className="flex gap-10 items-start">
                                {/* Floating sidebar (desktop only) */}
                                <motion.aside
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="hidden xl:flex flex-col items-center gap-2.5 sticky top-24 w-14 flex-shrink-0"
                                >
                                    <LikeButton
                                        blogId={blog.id}
                                        initialLikeCount={blog._count?.likes ?? 0}
                                        size="sm"
                                    />
                                    <button
                                        onClick={handleShare}
                                        className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/25 transition-all"
                                        title="Share"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <a
                                        href="#comments"
                                        className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/25 transition-all"
                                        title="Jump to comments"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                    </a>
                                </motion.aside>

                                {/* Article content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.18 }}
                                    className="flex-1 min-w-0 max-w-3xl"
                                >
                                    <article className="blog-content">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {blog.content}
                                        </ReactMarkdown>
                                    </article>

                                    {/* Mobile action bar */}
                                    <div className="flex items-center gap-3 mt-10 pt-6 border-t border-border xl:hidden">
                                        <LikeButton
                                            blogId={blog.id}
                                            initialLikeCount={blog._count?.likes ?? 0}
                                        />
                                        <button
                                            onClick={handleShare}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </button>
                                    </div>

                                    {/* Divider */}
                                    <div className="my-10 flex items-center gap-4">
                                        <div className="flex-1 border-t border-border" />
                                        <BookOpen className="w-4 h-4 text-muted-foreground/30" />
                                        <div className="flex-1 border-t border-border" />
                                    </div>

                                    {/* Comments */}
                                    <section id="comments">
                                        <CommentList blogId={blog.id} />
                                    </section>
                                </motion.div>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}

/* ─── Skeletons / Error states ──────────────────── */

function BlogPageSkeleton() {
    const WIDTHS = [95, 88, 72, 100, 83, 91, 76, 85, 68, 94];
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 animate-pulse space-y-5">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="space-y-3">
                <div className="h-10 bg-muted rounded w-full" />
                <div className="h-10 bg-muted rounded w-4/5" />
            </div>
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="flex gap-4 pt-2">
                {[28, 24, 20].map((w) => (
                    <div key={w} className={`h-3 bg-muted rounded`} style={{ width: `${w * 4}px` }} />
                ))}
            </div>
            <div className="h-px bg-border mt-4" />
            <div className="space-y-3 pt-2">
                {WIDTHS.map((w, i) => (
                    <div key={i} className="h-4 bg-muted rounded" style={{ width: `${w}%` }} />
                ))}
            </div>
        </div>
    );
}

function BlogNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-5">
                <BookOpen className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <h1 className="text-xl font-bold mb-2">Blog not found</h1>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                This blog may have been deleted, made private, or the URL might be wrong.
            </p>
            <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Feed
            </Link>
        </div>
    );
}

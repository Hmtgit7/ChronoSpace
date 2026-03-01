"use client";
import { use, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Share2, BookOpen } from "lucide-react";
import { usePublicBlog } from "@/lib/hooks/useFeed";
import { useComments } from "@/lib/hooks/useComments";
import { LikeButton } from "@/components/social/LikeButton";
import { CommentList } from "@/components/social/CommentList";
import { BlogPageMeta } from "@/components/blog/BlogPageMeta";
import { BlogPageSkeleton } from "@/components/blog/BlogPageSkeleton";
import { BlogNotFound } from "@/components/blog/BlogNotFound";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/blog/ReadingProgress";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function BlogPage({ params }: PageProps) {
    const { slug } = use(params);
    const { data: blog, isLoading, isError } = usePublicBlog(slug);
    const { data: comments } = useComments(blog?.id ?? "");
    const articleRef = useRef<HTMLElement>(null);

    const handleShare = () => {
        if (navigator.share && blog) {
            navigator.share({ title: blog.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <ReadingProgress targetRef={articleRef} />
            <Navbar />
            <main className="flex-1 pt-20">

                {/* Loading */}
                {isLoading && (
                    <div className="pt-8">
                        <BlogPageSkeleton />
                    </div>
                )}

                {/* Error / Not found */}
                {(isError || (!isLoading && !blog)) && <BlogNotFound />}

                {/* Content */}
                {!isLoading && blog && (
                    <>
                        {/* ── Hero header ───────────────────────────── */}
                        <div className="border-b border-border/60">
                            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-10">

                                {/* Back link */}
                                <motion.div
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-7"
                                >
                                    <Link
                                        href="/feed"
                                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Feed
                                    </Link>
                                </motion.div>

                                {/* Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 }}
                                    className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] mb-5"
                                >
                                    {blog.title}
                                </motion.h1>

                                {/* Summary */}
                                {blog.summary && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-lg text-muted-foreground leading-relaxed mb-6"
                                    >
                                        {blog.summary}
                                    </motion.p>
                                )}

                                {/* Meta row */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <BlogPageMeta
                                        blog={blog}
                                        commentCount={comments?.length ?? 0}
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* ── Body + Sidebar ─────────────────────────── */}
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                            <div className="flex gap-12 items-start">

                                {/* Sticky action sidebar — desktop */}
                                <motion.aside
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="hidden xl:flex flex-col items-center gap-3 sticky top-24 w-14 flex-shrink-0"
                                >
                                    <LikeButton
                                        blogId={blog.id}
                                        initialLikeCount={blog._count?.likes ?? 0}
                                        size="sm"
                                    />
                                    <button
                                        onClick={handleShare}
                                        className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                                        title="Share"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <a
                                        href="#comments"
                                        className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                                        title="Comments"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                    </a>
                                </motion.aside>

                                {/* Article body */}
                                <motion.div
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.18 }}
                                    className="flex-1 min-w-0 max-w-3xl"
                                >
                                    <article ref={articleRef} className="blog-content">
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
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </button>
                                    </div>

                                    {/* Section divider */}
                                    <div className="my-12 h-px bg-border" />

                                    {/* Comments */}
                                    <CommentList blogId={blog.id} />
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

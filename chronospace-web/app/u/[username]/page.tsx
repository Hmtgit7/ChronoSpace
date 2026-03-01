"use client";
import { use, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, LinkIcon, ArrowLeft,
    UserX, Loader2,
    FileText
} from "lucide-react";
import Link from "next/link";
import { useAuthorProfile, useAuthorBlogs } from "@/lib/hooks/useAuthor";
import { AuthorAvatar } from "@/components/profile/AuthorAvatar";
import { AuthorStats } from "@/components/profile/AuthorStats";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCardSkeleton } from "@/components/blog/BlogListSkeleton";
import { InfiniteScrollTrigger } from "@/components/common/InfiniteScrollTrigger";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatDate } from "@/lib/utils";

type Tab = "blogs" | "about";

interface Props {
    params: Promise<{ username: string }>;
}

export default function AuthorProfilePage({ params }: Props) {
    const { username } = use(params);
    const [tab, setTab] = useState<Tab>("blogs");

    const {
        data: profile,
        isLoading: profileLoading,
        isError,
    } = useAuthorProfile(username);

    const {
        data: blogsData,
        isLoading: blogsLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useAuthorBlogs(username);

    const allBlogs = useMemo(
        () => blogsData?.pages.flatMap((p) => p.data) ?? [],
        [blogsData]
    );

    // ── Not found ──────────────────────────────────────
    if (isError) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <UserX className="w-7 h-7 text-muted-foreground/40" />
                    </div>
                    <h1 className="text-xl font-bold mb-2">Author not found</h1>
                    <p className="text-sm text-muted-foreground mb-6">
                        No author with username <span className="font-mono text-primary">@{username}</span> exists.
                    </p>
                    <Link
                        href="/feed"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Feed
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-20 pb-16">
                {/* ── Hero ──────────────────────────────── */}
                <div className="relative border-b border-border bg-card overflow-hidden">
                    {/* Subtle glow */}
                    <div className="absolute top-0 left-1/3 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                        {profileLoading ? (
                            <AuthorHeroSkeleton />
                        ) : profile ? (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
                            >
                                {/* Avatar */}
                                <AuthorAvatar
                                    username={profile.username}
                                    displayName={profile.displayName}
                                    size="xl"
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-1">
                                        <h1 className="text-2xl font-bold">
                                            {profile.displayName ?? profile.username}
                                        </h1>
                                        <span className="text-sm text-muted-foreground font-mono">
                                            @{profile.username}
                                        </span>
                                    </div>

                                    {profile.bio && (
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-lg">
                                            {profile.bio}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 mb-5">
                                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Joined {formatDate(profile.joinedAt)}
                                        </span>
                                        <a
                                            href={`/u/${profile.username}`}
                                            className="flex items-center gap-1.5 text-xs text-primary hover:underline underline-offset-4"
                                        >
                                            <LinkIcon className="w-3.5 h-3.5" />
                                            chronospace.app/u/{profile.username}
                                        </a>
                                    </div>

                                    <AuthorStats stats={profile.stats} />
                                </div>
                            </motion.div>
                        ) : null}
                    </div>
                </div>

                {/* ── Tab bar ───────────────────────────── */}
                <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div className="flex gap-0">
                            {(["blogs", "about"] as Tab[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`
                    relative px-5 py-3.5 text-sm font-medium capitalize transition-colors
                    ${tab === t
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                        }
                  `}
                                >
                                    {t}
                                    {/* Active underline */}
                                    {tab === t && (
                                        <motion.div
                                            layoutId="author-tab-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Tab content ───────────────────────── */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                    <AnimatePresence mode="wait">
                        {tab === "blogs" && (
                            <motion.div
                                key="blogs"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Blog grid */}
                                {blogsLoading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <BlogCardSkeleton key={i} />
                                        ))}
                                    </div>
                                ) : allBlogs.length === 0 ? (
                                    <AuthorBlogsEmpty username={username} />
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {allBlogs.map((blog, i) => (
                                                <BlogCard key={blog.id} blog={blog} index={i} />
                                            ))}
                                        </div>

                                        <InfiniteScrollTrigger
                                            onIntersect={() => {
                                                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                                            }}
                                            enabled={!!hasNextPage && !isFetchingNextPage}
                                        />

                                        {isFetchingNextPage && (
                                            <div className="flex justify-center py-6">
                                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                            </div>
                                        )}

                                        {!hasNextPage && allBlogs.length > 0 && (
                                            <p className="text-center text-xs text-muted-foreground/50 py-8">
                                                All {allBlogs.length} blogs loaded
                                            </p>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        )}

                        {tab === "about" && (
                            <motion.div
                                key="about"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-2xl"
                            >
                                <AboutTab profile={profile} isLoading={profileLoading} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// ── Sub-components ─────────────────────────────────────

function AboutTab({
    profile,
    isLoading,
}: {
    profile: ReturnType<typeof useAuthorProfile>["data"];
    isLoading: boolean;
}) {
    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-5">
                {/* Display name */}
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Display Name
                    </p>
                    <p className="font-medium">
                        {profile.displayName ?? (
                            <span className="text-muted-foreground italic">Not set</span>
                        )}
                    </p>
                </div>

                {/* Username */}
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Username
                    </p>
                    <p className="font-mono text-primary">@{profile.username}</p>
                </div>

                {/* Bio */}
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Bio
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/80">
                        {profile.bio ?? (
                            <span className="text-muted-foreground italic">No bio yet.</span>
                        )}
                    </p>
                </div>

                {/* Joined */}
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Member Since
                    </p>
                    <p className="text-sm">{formatDate(profile.joinedAt)}</p>
                </div>
            </div>

            {/* Stats card */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Published Blogs", value: profile.stats.publishedBlogs },
                    { label: "Total Likes", value: profile.stats.totalLikes },
                    { label: "Total Comments", value: profile.stats.totalComments },
                ].map(({ label, value }) => (
                    <div
                        key={label}
                        className="p-4 rounded-2xl border border-border bg-card text-center"
                    >
                        <p className="text-2xl font-bold text-primary">{value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AuthorHeroSkeleton() {
    return (
        <div className="flex items-center gap-6 animate-pulse">
            <div className="w-20 h-20 bg-muted rounded-3xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="flex gap-3">
                    <div className="h-7 w-40 bg-muted rounded-lg" />
                    <div className="h-7 w-24 bg-muted rounded-lg" />
                </div>
                <div className="h-4 w-72 bg-muted rounded" />
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="flex gap-6 pt-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-1">
                            <div className="h-7 w-10 bg-muted rounded" />
                            <div className="h-3 w-12 bg-muted rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AuthorBlogsEmpty({ username }: { username: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold mb-1">No published blogs yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
                @{username} hasn&apos;t published any blogs yet. Check back later.
            </p>
        </div>
    );
}

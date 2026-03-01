"use client";
import { useState, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useFeedInfinite } from "@/lib/hooks/useFeed";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogListItem } from "@/components/blog/BlogListItem";
import { BlogCardSkeleton, BlogListItemSkeleton } from "@/components/blog/BlogListSkeleton";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { FeedEmpty } from "@/components/feed/FeedEmpty";
import { InfiniteScrollTrigger } from "@/components/common/InfiniteScrollTrigger";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { ViewMode } from "@/types";
import type { FeedSort } from "@/lib/api/public";

export default function FeedPage() {
    const [view, setView] = useState<ViewMode>("grid");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<FeedSort>("latest");
    const [selectedTag, setSelectedTag] = useState<string | undefined>();

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useFeedInfinite(sort, selectedTag);

    const allBlogs = useMemo(
        () => data?.pages.flatMap((p) => p.data) ?? [],
        [data]
    );

    const totalCount = data?.pages[0]?.meta.total;

    // Client-side search filter (on top of server-side tag/sort)
    const filtered = useMemo(() => {
        if (!search.trim()) return allBlogs;
        const q = search.toLowerCase();
        return allBlogs.filter(
            (b) =>
                b.title.toLowerCase().includes(q) ||
                b.author?.username?.toLowerCase().includes(q) ||
                b.summary?.toLowerCase().includes(q) ||
                b.tags?.some((t) => t.label.toLowerCase().includes(q))
        );
    }, [allBlogs, search]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Reset to page 1 when sort or tag changes
    const handleSortChange = (s: FeedSort) => {
        setSort(s);
        setSearch("");
    };

    const handleTagSelect = (tag: string | undefined) => {
        setSelectedTag(tag);
        setSearch("");
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    <FeedHeader
                        search={search}
                        onSearchChange={setSearch}
                        view={view}
                        onViewChange={setView}
                        sort={sort}
                        onSortChange={handleSortChange}
                        selectedTag={selectedTag}
                        onTagSelect={handleTagSelect}
                        totalCount={totalCount}
                    />

                    {/* Loading */}
                    {isLoading && (
                        view === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {Array.from({ length: 9 }).map((_, i) => <BlogCardSkeleton key={i} />)}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                                {Array.from({ length: 6 }).map((_, i) => <BlogListItemSkeleton key={i} />)}
                            </div>
                        )
                    )}

                    {/* Empty */}
                    {!isLoading && filtered.length === 0 && (
                        <FeedEmpty isSearching={!!search.trim() || !!selectedTag} />
                    )}

                    {/* Content */}
                    {!isLoading && filtered.length > 0 && (
                        <AnimatePresence mode="wait">
                            {view === "grid" ? (
                                <div key="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filtered.map((blog, i) => (
                                        <BlogCard key={blog.id} blog={blog} index={i} />
                                    ))}
                                </div>
                            ) : (
                                <div key="list" className="rounded-2xl border border-border bg-card overflow-hidden">
                                    {filtered.map((blog, i) => (
                                        <BlogListItem key={blog.id} blog={blog} index={i} />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    )}

                    {/* Infinite scroll */}
                    {!search && (
                        <InfiniteScrollTrigger
                            onIntersect={handleLoadMore}
                            enabled={!!hasNextPage && !isFetchingNextPage}
                        />
                    )}

                    {isFetchingNextPage && (
                        <div className="flex justify-center py-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                Loading more…
                            </div>
                        </div>
                    )}

                    {!hasNextPage && !isLoading && allBlogs.length > 0 && !search && (
                        <p className="text-center text-xs text-muted-foreground/50 py-8">
                            You&apos;ve reached the end · {allBlogs.length} stories
                        </p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

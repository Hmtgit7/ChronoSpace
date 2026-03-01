"use client";
import { useState } from "react";
import Link from "next/link";
import { PenSquare } from "lucide-react";
import { useMyBlogs } from "@/lib/hooks/useBlogs";
import { BlogRow } from "@/components/blog/BlogRow";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BlogsEmptyState } from "@/components/dashboard/BlogsEmptyState";
import { cn } from "@/lib/utils";
import { BlogRowSkeleton } from "@/components/blog/BlogSkeleton";

type Tab = "all" | "published" | "draft";

const TABS: { label: string; value: Tab }[] = [
    { label: "All", value: "all" },
    { label: "Published", value: "published" },
    { label: "Drafts", value: "draft" },
];

export default function MyBlogsPage() {
    const [tab, setTab] = useState<Tab>("all");
    const { data: blogs = [], isLoading } = useMyBlogs();

    const filtered = blogs.filter((b) => {
        if (tab === "published") return b.isPublished;
        if (tab === "draft") return !b.isPublished;
        return true;
    });

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <DashboardHeader
                title="My Blogs"
                description={`${blogs.length} total · ${blogs.filter((b) => b.isPublished).length} published`}
                action={
                    <Link
                        href="/dashboard/new"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <PenSquare className="w-4 h-4" />
                        New Blog
                    </Link>
                }
            />

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-card w-fit mb-6">
                {TABS.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => setTab(value)}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                            tab === value
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <BlogRowSkeleton key={i} />)
                ) : filtered.length === 0 ? (
                    <BlogsEmptyState variant={tab} />
                ) : (
                    filtered.map((blog, i) => (
                        <BlogRow key={blog.id} blog={blog} index={i} />
                    ))
                )}
            </div>
        </div>
    );
}

"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { PenSquare, ArrowRight, Clock } from "lucide-react";
import { useMyBlogs } from "@/lib/hooks/useBlogs";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BlogsEmptyState } from "@/components/dashboard/BlogsEmptyState";
import { useAuthStore } from "@/lib/store/auth.store";
import { timeAgo, cn } from "@/lib/utils";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { data: blogs = [], isLoading } = useMyBlogs();

    const recent = [...blogs]
        .sort(
            (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 5);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <DashboardHeader
                title={`Welcome back, ${user?.username ?? "writer"} ✦`}
                description="Here's an overview of your content."
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

            {/* Stats */}
            {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-28 rounded-2xl bg-muted animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <DashboardStats blogs={blogs} />
            )}

            {/* Recent blogs */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold">Recent Activity</h2>
                    </div>
                    <Link
                        href="/dashboard/blogs"
                        className="text-xs text-primary hover:underline underline-offset-4 flex items-center gap-1"
                    >
                        View all <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="divide-y divide-border">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-2/3" />
                                    <div className="h-3 bg-muted rounded w-1/3" />
                                </div>
                                <div className="h-6 w-16 bg-muted rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : recent.length === 0 ? (
                    <BlogsEmptyState variant="all" />
                ) : (
                    <div className="divide-y divide-border">
                        {recent.map((blog, i) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{blog.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Updated {timeAgo(blog.updatedAt)}
                                    </p>
                                </div>
                                <span
                                    className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0",
                                        blog.isPublished
                                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    )}
                                >
                                    {blog.isPublished ? "Live" : "Draft"}
                                </span>
                                <Link
                                    href={`/dashboard/edit/${blog.id}`}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                                >
                                    Edit →
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

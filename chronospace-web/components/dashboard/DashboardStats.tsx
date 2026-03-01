"use client";
import { motion } from "framer-motion";
import { FileText, Eye, Heart, MessageSquare } from "lucide-react";
import type { Blog } from "@/types";

interface Props {
    blogs: Blog[];
}

export function DashboardStats({ blogs }: Props) {
    const totalBlogs = blogs.length;
    const published = blogs.filter((b) => b.isPublished).length;
    const drafts = totalBlogs - published;
    const totalLikes = blogs.reduce((acc, b) => acc + (b._count?.likes ?? 0), 0);
    const totalComments = blogs.reduce(
        (acc, b) => acc + (b._count?.comments ?? 0),
        0
    );

    const stats = [
        {
            label: "Total Blogs",
            value: totalBlogs,
            icon: FileText,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            label: "Published",
            value: published,
            icon: Eye,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            label: "Total Likes",
            value: totalLikes,
            icon: Heart,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
        },
        {
            label: "Comments",
            value: totalComments,
            icon: MessageSquare,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
                <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="p-5 rounded-2xl border border-border bg-card"
                >
                    <div
                        className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}
                    >
                        <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                    </div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </motion.div>
            ))}
        </div>
    );
}

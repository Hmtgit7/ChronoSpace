"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Feather, Rss } from "lucide-react";
import { LandingStat } from "./LandingStat";

const STATS = [
    { value: "100%", label: "Free forever" },
    { value: "JWT", label: "Secured" },
    { value: "∞", label: "Stories" },
    { value: "0", label: "Ads" },
];

export function LandingHero() {
    return (
        <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
            {/* Subtle background grid */}
            <div
                className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* Top glow — single, clean */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl -z-10" />

            <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-medium mb-8"
                >
                    <Feather className="w-3.5 h-3.5" />
                    A platform for writers
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.08 }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
                >
                    Write. Publish.{" "}
                    <span className="gradient-text">Be read.</span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    ChronoSpace is a clean, distraction-free platform to publish your ideas,
                    share your stories, and connect with readers worldwide.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.22 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
                >
                    <Link
                        href="/register"
                        className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-md shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90 transition-all"
                    >
                        Start Writing Free
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                        href="/feed"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border font-semibold text-base hover:bg-secondary transition-colors"
                    >
                        <Rss className="w-4 h-4" />
                        Browse Feed
                    </Link>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex items-center justify-center gap-8 sm:gap-16 pt-8 border-t border-border/50"
                >
                    {STATS.map((s) => (
                        <LandingStat key={s.label} value={s.value} label={s.label} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

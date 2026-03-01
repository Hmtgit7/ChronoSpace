"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Feather, Rss } from "lucide-react";

export function LandingCTA() {
    return (
        <section className="py-24 px-4 sm:px-6 border-t border-border/50">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl border border-border bg-card p-12 sm:p-16 text-center overflow-hidden"
                >
                    {/* Subtle top accent line */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                        <Feather className="w-6 h-6 text-primary" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                        Ready to write your first story?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                        Join ChronoSpace today. Create your account in seconds — no credit card,
                        no ads, no noise.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/register"
                            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90 transition-all"
                        >
                            <Feather className="w-4 h-4" />
                            Start Writing Free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link
                            href="/feed"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border font-semibold hover:bg-secondary transition-colors"
                        >
                            <Rss className="w-4 h-4" />
                            Explore Feed
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

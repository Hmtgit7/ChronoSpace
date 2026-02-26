'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Feather, Sparkles } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export function LandingHero() {
    return (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-16">
            {/* Background blobs */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
                style={{
                    backgroundImage:
                        'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Secure · Private · Beautiful
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
                    >
                        Your stories,{' '}
                        <span className="gradient-text">your space.</span>
                    </motion.h1>

                    {/* Sub */}
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        ChronoSpace is a modern blog platform where you control whats public
                        and what stays private. Write, publish, and connect with readers who
                        care about your craft.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/register"
                            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-primary/90 transition-all duration-200 text-base"
                        >
                            <Feather className="w-4 h-4" />
                            Start Writing Free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/feed"
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-border hover:bg-secondary transition-colors font-semibold text-base"
                        >
                            Explore Feed
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={4}
                        className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
                    >
                        {[
                            { label: 'Public & Private Blogs', value: '✦' },
                            { label: 'JWT Secured', value: '✦' },
                            { label: 'Real-time Feed', value: '✦' },
                            { label: 'Like & Comment', value: '✦' },
                        ].map((s) => (
                            <div key={s.label} className="flex items-center gap-2">
                                <span className="text-primary text-xs">{s.value}</span>
                                <span>{s.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

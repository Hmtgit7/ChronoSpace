'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Feather, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function LandingHero() {
    return (
        <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
            {/* Subtle dot grid background */}
            <div
                className="absolute inset-0 -z-10 opacity-30 dark:opacity-15"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, oklch(0.52 0.2 255 / 25%) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />
            {/* Soft radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-3xl -z-10" />

            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6"
                >
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-xs font-medium">
                        <Feather className="w-3 h-3 text-primary" />
                        The modern writing platform
                    </Badge>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.08 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-5 leading-[1.12]"
                >
                    Write. Publish.
                    <br />
                    <span className="text-primary">Be discovered.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed"
                >
                    ChronoSpace is a focused blog platform for writers who want to craft,
                    publish, and grow — without the noise.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.22 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                    <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link href="/register">
                            Start writing free
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                        <Link href="/feed">
                            <Rss className="w-4 h-4 mr-2" />
                            Browse stories
                        </Link>
                    </Button>
                </motion.div>

                {/* Social proof strip */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 text-xs text-muted-foreground/60"
                >
                    Free forever · No ads · Markdown supported · AI summaries
                </motion.p>
            </div>
        </section>
    );
}

'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Feather } from 'lucide-react';

export function LandingCTA() {
    return (
        <section className="py-24 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl p-12 text-center overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
                >
                    {/* Glow */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 to-violet-500/10 blur-3xl opacity-50" />

                    <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-6">
                        <Feather className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to write your first story?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        Join ChronoSpace today. Create your account in seconds, no credit card needed.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/register"
                            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-primary/90 transition-all"
                        >
                            <Feather className="w-4 h-4" />
                            Create Free Account
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/feed"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border border-border hover:bg-secondary transition-colors font-semibold"
                        >
                            Browse Public Feed
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

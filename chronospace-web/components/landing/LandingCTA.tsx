'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Feather } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingCTA() {
    return (
        <section className="py-20 px-4 sm:px-6 border-t border-border">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto text-center"
            >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                    <Feather className="w-6 h-6 text-primary" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                    Ready to start writing?
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                    Join ChronoSpace for free and share your stories with readers who care.
                    No subscriptions, no ads, no noise.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button asChild size="lg">
                        <Link href="/register">
                            Create free account
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="lg">
                        <Link href="/feed">Browse the feed first</Link>
                    </Button>
                </div>
            </motion.div>
        </section>
    );
}

'use client';
import { motion } from 'framer-motion';
import { Shield, Globe, Heart, Zap, Lock, Rss } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
    icon: LucideIcon;
    title: string;
    desc: string;
    color: string;
    bg: string;
}

const FEATURES: Feature[] = [
    {
        icon: Lock,
        title: 'Private Dashboard',
        desc: 'Write drafts and manage all your blogs in a secure private space.',
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
    },
    {
        icon: Globe,
        title: 'Public Blog URLs',
        desc: 'Every published blog gets a clean, shareable slug URL.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        icon: Rss,
        title: 'Live Public Feed',
        desc: 'Discover content from all writers. Sorted by newest, infinite scroll.',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
    },
    {
        icon: Heart,
        title: 'Like & Comment',
        desc: 'Engage with content you love. DB-level unique likes enforced.',
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
    },
    {
        icon: Shield,
        title: 'JWT + bcrypt Auth',
        desc: 'Industry-standard security — hashed passwords and JWT tokens.',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
    {
        icon: Zap,
        title: 'Async Summaries',
        desc: 'Publish a blog and get a summary generated in the background.',
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10',
    },
];

export function LandingFeatures() {
    return (
        <section className="py-20 px-4 sm:px-6 border-t border-border bg-muted/30">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-xs font-semibold text-primary uppercase tracking-widest mb-3"
                    >
                        Platform features
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl font-bold text-foreground"
                    >
                        Everything you need to write well
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="p-5 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-sm transition-all"
                        >
                            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-4`}>
                                <Icon className={`w-4.5 h-4.5 ${color}`} />
                            </div>
                            <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

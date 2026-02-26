'use client';
import { motion } from 'framer-motion';
import { Shield, Globe, Heart, Zap, Lock, Rss } from 'lucide-react';

const features = [
    {
        icon: Lock,
        title: 'Private Dashboard',
        desc: 'Write drafts and manage all your blogs in a secure private space. Only you can see unpublished content.',
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
    },
    {
        icon: Globe,
        title: 'Public Blog URLs',
        desc: 'Every published blog gets a clean, shareable URL slug. Share your work with the world instantly.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        icon: Rss,
        title: 'Live Public Feed',
        desc: 'Discover content from all writers in a paginated feed. Sorted by newest, optimized for speed.',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
    },
    {
        icon: Heart,
        title: 'Like & Comment',
        desc: 'Engage with content you love. Like blogs once (enforced at DB level) and leave meaningful comments.',
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
    },
    {
        icon: Shield,
        title: 'JWT Auth & bcrypt',
        desc: 'Industry-standard security — hashed passwords, JWT tokens, and guards on every protected route.',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
    {
        icon: Zap,
        title: 'Async Summaries',
        desc: 'Publish a blog and get an AI-style summary generated in the background via BullMQ jobs.',
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10',
    },
];

export function LandingFeatures() {
    return (
        <section className="py-24 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-primary font-semibold text-sm uppercase tracking-widest mb-3"
                    >
                        Everything you need
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl font-bold mb-4"
                    >
                        Built for serious writers
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground max-w-xl mx-auto"
                    >
                        A complete blogging platform with production-grade architecture —
                        not just a demo.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                            className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                        >
                            <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <f.icon className={`w-5 h-5 ${f.color}`} />
                            </div>
                            <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

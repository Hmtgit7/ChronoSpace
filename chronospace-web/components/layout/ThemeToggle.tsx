'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const emptySubscribe = () => () => { };

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();

    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    if (!mounted) return <div className="w-9 h-9" />;

    const isDark = theme === 'dark';

    return (
        <motion.button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={cn(
                'relative w-9 h-9 rounded-xl flex items-center justify-center',
                'bg-secondary hover:bg-accent transition-colors duration-200',
                'border border-border',
                className
            )}
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait">
                {isDark ? <Moon key="moon" /> : <Sun key="sun" />}
            </AnimatePresence>
        </motion.button>
    );
}
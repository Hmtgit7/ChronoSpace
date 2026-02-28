'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth.store';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import SidebarContent from '@/components/layout/SidebarContent';
import { Menu, PenSquare } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Client-side auth guard
    useEffect(() => {
        if (!isAuthenticated) router.replace('/login');
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) return null;

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-border bg-card z-40">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 lg:hidden flex flex-col"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center"
                    >
                        <Menu className="w-4 h-4" />
                    </button>
                    <div className="hidden lg:block" />
                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard/new"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                        >
                            <PenSquare className="w-3.5 h-3.5" />
                            New Blog
                        </Link>
                        <ThemeToggle />
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Feather, LayoutDashboard, Rss, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '@/lib/store/auth.store';
import { cn, getInitials } from '@/lib/utils';

const NAV_LINKS = [
    { label: 'Feed', href: '/feed', icon: Rss },
];

export function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const prevPathnameRef = useRef(pathname);
    const router = useRouter();
    const { user, isAuthenticated, clearAuth } = useAuthStore();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    useEffect(() => {
        if (prevPathnameRef.current !== pathname) {
            prevPathnameRef.current = pathname;
            const id = setTimeout(() => setOpen(false), 0);
            return () => clearTimeout(id);
        }
    }, [pathname]);

    const handleLogout = () => {
        clearAuth();
        router.push('/');
    };

    return (
        <header
            className={cn(
                'fixed top-0 inset-x-0 z-50 transition-all duration-200',
                scrolled
                    ? 'bg-background/95 border-b border-border shadow-sm'
                    : 'bg-transparent'
            )}
        >
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                        <Feather className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                        Chrono<span className="text-primary">Space</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ label, href, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(href + '/');
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side */}
                <div className="hidden md:flex items-center gap-2">
                    <ThemeToggle />
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/dashboard"
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    pathname.startsWith('/dashboard')
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                )}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <div className="flex items-center gap-2 pl-2 border-l border-border">
                                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                    {user?.username ? getInitials(user.username) : 'U'}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                            >
                                Get started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="flex md:hidden items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-t border-border bg-background overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
                                const active = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                            active
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </Link>
                                );
                            })}
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <div className="pt-2 border-t border-border flex flex-col gap-2">
                                    <Link
                                        href="/login"
                                        className="flex justify-center py-2.5 rounded-lg text-sm font-medium border border-border hover:bg-secondary transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex justify-center py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        Get started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

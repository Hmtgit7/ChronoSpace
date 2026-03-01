"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Menu, X, Feather } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth.store";
import { ThemeToggle } from "./ThemeToggle";
import { NavUserMenu } from "./NavUserMenu";
import { NavMobileMenu } from "./NavMobileMenu";
import { NAV_LINKS } from "./NavLinks";

export function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const prevPathnameRef = useRef(pathname);
    const router = useRouter();
    const { user, isAuthenticated, clearAuth } = useAuthStore();

    // Scroll detection
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 16);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        if (prevPathnameRef.current !== pathname) {
            prevPathnameRef.current = pathname;
            setOpen(false);
        }
    }, [pathname]);

    const handleLogout = () => {
        clearAuth();
        router.push("/");
    };

    return (
        <header
            className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-300",
                scrolled
                    ? "border-b border-border bg-background/90 backdrop-blur-md shadow-sm"
                    : "bg-transparent"
            )}
        >
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md group-hover:shadow-primary/40 transition-shadow">
                        <Feather className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                        Chrono<span className="text-primary">Space</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                pathname === href
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            )}
                        >
                            {label}
                            {pathname === href && (
                                <span className="absolute inset-x-3 -bottom-px h-px bg-primary rounded-full" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Desktop right */}
                <div className="hidden md:flex items-center gap-2">
                    <ThemeToggle />
                    {isAuthenticated && user ? (
                        <NavUserMenu user={user} onLogout={handleLogout} />
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile toggle */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center"
                        aria-label={open ? "Close menu" : "Open menu"}
                    >
                        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {open && (
                    <NavMobileMenu
                        links={NAV_LINKS}
                        isAuthenticated={isAuthenticated}
                        user={user}
                        onLogout={handleLogout}
                        onClose={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>
        </header>
    );
}

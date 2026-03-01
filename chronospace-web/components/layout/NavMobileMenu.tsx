"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, LogOut } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import type { NavLink } from "./NavLinks";
import type { User } from "@/types";

interface Props {
    links: NavLink[];
    isAuthenticated: boolean;
    user: User | null;
    onLogout: () => void;
    onClose: () => void;
}

export function NavMobileMenu({ links, isAuthenticated, user, onLogout, onClose }: Props) {
    const pathname = usePathname();

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden border-b border-border bg-background/95 backdrop-blur-sm overflow-hidden"
        >
            <div className="max-w-6xl mx-auto px-4 py-3 space-y-1">
                {/* Nav links */}
                {links.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={onClose}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                            pathname === href
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </Link>
                ))}

                {/* Divider */}
                <div className="h-px bg-border my-1" />

                {/* Auth section */}
                {isAuthenticated && user ? (
                    <>
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                                {getInitials(user.username)}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{user.username}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard"
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <button
                            onClick={() => { onLogout(); onClose(); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col gap-2 pt-1 pb-2">
                        <Link
                            href="/login"
                            onClick={onClose}
                            className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-secondary transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            onClick={onClose}
                            className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                )}

                {/* Theme toggle row */}
                <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs text-muted-foreground">Theme</span>
                    <ThemeToggle />
                </div>
            </div>
        </motion.div>
    );
}

"use client";
import Link from "next/link";
import { LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types";

interface Props {
    user: User;
    onLogout: () => void;
}

export function NavUserMenu({ user, onLogout }: Props) {
    return (
        <div className="relative group">
            {/* Trigger */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border hover:border-primary/30 hover:bg-secondary transition-all duration-200">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {getInitials(user.username)}
                </div>
                <span className="text-sm font-medium hidden sm:block max-w-[80px] truncate">
                    {user.username}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform group-hover:rotate-180 duration-200" />
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-1 transition-all duration-200 z-50">
                <div className="rounded-xl border border-border bg-card shadow-lg shadow-black/5 overflow-hidden">
                    {/* User info */}
                    <div className="px-3 py-2.5 border-b border-border">
                        <p className="text-xs text-muted-foreground">Signed in as</p>
                        <p className="text-sm font-semibold truncate">{user.username}</p>
                    </div>

                    {/* Links */}
                    <div className="p-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
